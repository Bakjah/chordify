package com.chordify.repository;

import com.chordify.model.Report;
import com.chordify.model.ReportStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

    /** Laporan yang dikirim member, yang terbaru di atas. */
    List<Report> findByReporterIdOrderByCreatedAtDesc(Long reporterId);

    /** Semua laporan dengan status tertentu — dipakai antrean admin. */
    List<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status);

    /** Laporan terhadap sebuah lagu. */
    List<Report> findBySongIdOrderByCreatedAtDesc(Long songId);

    /** Apakah member sudah punya laporan terbuka untuk lagu ini. */
    boolean existsByReporterIdAndSongIdAndStatus(Long reporterId, Long songId, ReportStatus status);

    /** Jumlah laporan dengan status tertentu. */
    long countByStatus(ReportStatus status);
}
