package com.chordify.service;

import com.chordify.dto.AdminSongResponse;
import com.chordify.dto.AdminStatsResponse;
import com.chordify.dto.AdminUserResponse;
import com.chordify.exception.ApiException;
import com.chordify.model.Member;
import com.chordify.model.ReportStatus;
import com.chordify.model.Song;
import com.chordify.model.SongStatus;
import com.chordify.model.User;
import com.chordify.model.VerificationStatus;
import com.chordify.repository.ReportRepository;
import com.chordify.repository.SongRepository;
import com.chordify.repository.UserRepository;
import com.chordify.repository.VerificationRequestRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Layanan konsol admin: statistik platform, daftar user, dan daftar lagu.
 */
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final ReportRepository reportRepository;
    private final VerificationRequestRepository verificationRequestRepository;
    private final NotificationService notificationService;

    public AdminService(UserRepository userRepository,
                        SongRepository songRepository,
                        ReportRepository reportRepository,
                        VerificationRequestRepository verificationRequestRepository,
                        NotificationService notificationService) {
        this.userRepository = userRepository;
        this.songRepository = songRepository;
        this.reportRepository = reportRepository;
        this.verificationRequestRepository = verificationRequestRepository;
        this.notificationService = notificationService;
    }

    /** Angka ringkas untuk dashboard admin. */
    @Transactional(readOnly = true)
    public AdminStatsResponse stats() {
        List<String> activity = new ArrayList<>();

        songRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(5)
                .forEach(song -> activity.add("Song contributed — " + song.getTitle()));

        reportRepository.findByStatusOrderByCreatedAtDesc(ReportStatus.OPEN).stream()
                .limit(5)
                .forEach(report -> activity.add("Report submitted — " + report.getSong().getTitle()));

        verificationRequestRepository.findByStatusOrderByCreatedAtDesc(VerificationStatus.PENDING).stream()
                .limit(5)
                .forEach(request -> activity.add("Verification request — @" + request.getMember().getUsername()));

        return new AdminStatsResponse(
                userRepository.count(),
                songRepository.count(),
                songRepository.countByStatus(SongStatus.PUBLISHED),
                songRepository.countByStatus(SongStatus.PENDING),
                reportRepository.countByStatus(ReportStatus.OPEN),
                verificationRequestRepository.countByStatus(VerificationStatus.PENDING),
                userRepository.countVerifiedMembers(),
                activity);
    }

    /** Daftar akun untuk tabel "Manage Users". */
    @Transactional(readOnly = true)
    public List<AdminUserResponse> listUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(user -> toUserResponse(user))
                .toList();
    }

    /** Daftar lagu untuk tabel "Manage Songs". */
    @Transactional(readOnly = true)
    public List<AdminSongResponse> listSongs() {
        return songRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(AdminSongResponse::from)
                .toList();
    }

    /**
     * Admin memublish atau menolak sebuah lagu.
     *
     * @param songId id lagu
     * @param status status baru
     * @return lagu setelah statusnya berubah
     */
    @Transactional
    public AdminSongResponse setSongStatus(Long songId, SongStatus status) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lagu tidak ditemukan."));
        song.setStatus(status);
        songRepository.save(song);
        if (song.getContributor() != null) {
            notificationService.notify(song.getContributor(), "Song contribution " + status.name().toLowerCase(),
                    "\"" + song.getTitle() + "\" is now " + status.name().toLowerCase() + ".");
        }
        return AdminSongResponse.from(song);
    }

    /** Admin menonaktifkan atau mengaktifkan kembali sebuah akun. */
    @Transactional
    public AdminUserResponse setUserActive(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pengguna tidak ditemukan."));
        if (active) {
            user.activate();
        } else {
            user.deactivate();
        }
        userRepository.save(user);
        return toUserResponse(user);
    }

    /** Menyusun baris tabel user beserta status verifikasinya. */
    private AdminUserResponse toUserResponse(User user) {
        boolean pending = verificationRequestRepository
                .findFirstByMemberIdOrderByCreatedAtDesc(user.getId())
                .map(request -> request.getStatus() == VerificationStatus.PENDING)
                .orElse(false);
        String category = user instanceof Member member ? member.getVerifiedCategory() : null;
        return AdminUserResponse.of(
                user,
                user.isVerified(),
                category,
                pending,
                user.getCreatedAt(),
                user.isActive());
    }
}
