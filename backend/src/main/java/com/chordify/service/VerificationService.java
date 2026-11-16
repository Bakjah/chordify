package com.chordify.service;

import com.chordify.dto.ReviewDecision;
import com.chordify.dto.VerificationApplyRequest;
import com.chordify.dto.VerificationResponse;
import com.chordify.exception.ApiException;
import com.chordify.model.Member;
import com.chordify.model.User;
import com.chordify.model.VerificationRequest;
import com.chordify.model.VerificationStatus;
import com.chordify.repository.UserRepository;
import com.chordify.repository.VerificationRequestRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Pengajuan Verified User.
 *
 * <p>Satu member hanya boleh punya satu pengajuan yang masih menunggu. Saat
 * admin menyetujui, member langsung ditandai terverifikasi lewat
 * {@link Member#setVerified(boolean)}.
 */
@Service
public class VerificationService {

    private final UserRepository userRepository;
    private final VerificationRequestRepository verificationRequestRepository;
    private final NotificationService notificationService;

    public VerificationService(UserRepository userRepository,
                               VerificationRequestRepository verificationRequestRepository,
                               NotificationService notificationService) {
        this.userRepository = userRepository;
        this.verificationRequestRepository = verificationRequestRepository;
        this.notificationService = notificationService;
    }

    /** Member mengajukan verifikasi. */
    @Transactional
    public VerificationResponse submit(Long userId, VerificationApplyRequest request) {
        User member = requireUser(userId);
        if (member.isVerified()) {
            throw new ApiException(HttpStatus.CONFLICT, "Akun kamu sudah terverifikasi.");
        }
        if (verificationRequestRepository.existsByMemberIdAndStatus(member.getId(), VerificationStatus.PENDING)) {
            throw new ApiException(HttpStatus.CONFLICT, "Sudah ada pengajuan yang sedang ditinjau.");
        }
        VerificationRequest verification = verificationRequestRepository.save(
                new VerificationRequest(member, request.category().trim(), request.proof(), request.proofUrl()));
        notificationService.notify(member, "Verification request received",
                "Your " + verification.getCategory() + " application is now pending review.");
        return VerificationResponse.from(verification);
    }

    /** Pengajuan milik member yang sedang login. */
    @Transactional(readOnly = true)
    public List<VerificationResponse> listMine(Long userId) {
        return verificationRequestRepository.findByMemberIdOrderByCreatedAtDesc(userId).stream()
                .map(VerificationResponse::from)
                .toList();
    }

    /** Semua pengajuan, atau hanya satu status tertentu — antrean admin. */
    @Transactional(readOnly = true)
    public List<VerificationResponse> listAll(VerificationStatus status) {
        List<VerificationRequest> requests = status == null
                ? verificationRequestRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                : verificationRequestRepository.findByStatusOrderByCreatedAtDesc(status);
        return requests.stream().map(VerificationResponse::from).toList();
    }

    /** Admin menyetujui atau menolak pengajuan. */
    @Transactional
    public VerificationResponse review(Long adminId, Long requestId, ReviewDecision decision) {
        VerificationRequest verification = verificationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pengajuan tidak ditemukan."));
        User admin = requireUser(adminId);
        VerificationStatus status = parseStatus(decision.status());
        if (status == VerificationStatus.APPROVED) {
            verification.approve(admin, decision.note());
            notificationService.notify(verification.getMember(), "Verification approved",
                    "Your " + verification.getCategory() + " application has been approved.");
        } else if (status == VerificationStatus.REJECTED) {
            verification.reject(admin, decision.note());
            notificationService.notify(verification.getMember(), "Verification rejected",
                    "Your " + verification.getCategory() + " application has been rejected.");
        } else {
            verification.annotate(admin, decision.note());
        }
        return VerificationResponse.from(verification);
    }

    // ------------------------------------------------------------------ helper

    private VerificationStatus parseStatus(String raw) {
        try {
            return VerificationStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Status pengajuan tidak dikenal: " + raw);
        }
    }

    private User requireUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pengguna tidak ditemukan."));
    }
}
