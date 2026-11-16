package com.chordify.repository;

import com.chordify.model.VerificationRequest;
import com.chordify.model.VerificationStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, Long> {

    /** Pengajuan milik seorang member, yang terbaru di atas. */
    List<VerificationRequest> findByMemberIdOrderByCreatedAtDesc(Long memberId);

    /** Pengajuan dengan status tertentu — dipakai antrean admin. */
    List<VerificationRequest> findByStatusOrderByCreatedAtDesc(VerificationStatus status);

    /** Pengajuan terakhir milik seorang member. */
    Optional<VerificationRequest> findFirstByMemberIdOrderByCreatedAtDesc(Long memberId);

    /** Apakah member sudah punya pengajuan yang masih menunggu. */
    boolean existsByMemberIdAndStatus(Long memberId, VerificationStatus status);

    /** Jumlah pengajuan dengan status tertentu. */
    long countByStatus(VerificationStatus status);
}
