package com.chordify.service;

import com.chordify.contract.Reportable;
import com.chordify.dto.ReportRequest;
import com.chordify.dto.ReportResponse;
import com.chordify.dto.ReviewDecision;
import com.chordify.exception.ApiException;
import com.chordify.model.Report;
import com.chordify.model.ReportCategory;
import com.chordify.model.ReportStatus;
import com.chordify.model.Song;
import com.chordify.model.User;
import com.chordify.repository.ReportRepository;
import com.chordify.repository.SongRepository;
import com.chordify.repository.UserRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Laporan member terhadap lagu.
 *
 * <p>Member hanya menandai; keputusan ada di tangan admin. Laporan terbuka yang
 * sama untuk lagu yang sama tidak dibuat dua kali, supaya antrean admin tidak
 * penuh duplikat.
 */
@Service
public class ReportService {

    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final ReportRepository reportRepository;
    private final NotificationService notificationService;

    public ReportService(UserRepository userRepository,
                          SongRepository songRepository,
                          ReportRepository reportRepository,
                          NotificationService notificationService) {
        this.userRepository = userRepository;
        this.songRepository = songRepository;
        this.reportRepository = reportRepository;
        this.notificationService = notificationService;
    }

    /** Member mengirim laporan baru untuk sebuah lagu. */
    @Transactional
    public ReportResponse submit(Long userId, ReportRequest request) {
        User reporter = requireUser(userId);
        Song song = requireSong(request.songId());
        ReportCategory category = parseCategory(request.category());
        if (reportRepository.existsByReporterIdAndSongIdAndStatus(reporter.getId(), song.getId(), ReportStatus.OPEN)) {
            throw new ApiException(HttpStatus.CONFLICT, "Lagu ini sudah kamu laporkan dan masih diproses.");
        }
        Report report = reportRepository.save(new Report(reporter, song, category, request.details()));
        notificationService.notify(reporter, "Report submitted",
                "Your report about \"" + song.getTitle() + "\" is now pending review.");
        return ReportResponse.from(report);
    }

    /**
     * Member mengirim laporan untuk objek yang bisa dilaporkan.
     *
     * <p>Overload dari {@link #submit(Long, ReportRequest)}: pemanggil cukup
     * mengoper objek {@link Reportable} tanpa perlu tahu id-nya.
     */
    @Transactional
    public ReportResponse submit(Long userId, Reportable reportable, ReportCategory category, String details) {
        return submit(userId, new ReportRequest(reportable.getReportableId(), category.name(), details));
    }

    /** Laporan yang dikirim member yang sedang login. */
    @Transactional(readOnly = true)
    public List<ReportResponse> listMine(Long userId) {
        return reportRepository.findByReporterIdOrderByCreatedAtDesc(userId).stream()
                .map(ReportResponse::from)
                .toList();
    }

    /** Semua laporan, atau hanya satu status tertentu — antrean admin. */
    @Transactional(readOnly = true)
    public List<ReportResponse> listAll(ReportStatus status) {
        List<Report> reports = status == null
                ? reportRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                : reportRepository.findByStatusOrderByCreatedAtDesc(status);
        return reports.stream().map(ReportResponse::from).toList();
    }

    /** Admin menangani sebuah laporan. */
    @Transactional
    public ReportResponse review(Long adminId, Long reportId, ReviewDecision decision) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Laporan tidak ditemukan."));
        User admin = requireUser(adminId);
        report.review(admin, decision.note(), parseReportStatus(decision.status()));
        notificationService.notify(report.getReporter(), "Report update",
                "Your report about \"" + report.getSong().getTitle() + "\" is now " + report.getStatus().name().toLowerCase() + ".");
        return ReportResponse.from(report);
    }

    // ------------------------------------------------------------------ helper

    private ReportCategory parseCategory(String raw) {
        try {
            return ReportCategory.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Alasan laporan tidak dikenal: " + raw);
        }
    }

    private ReportStatus parseReportStatus(String raw) {
        try {
            return ReportStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Status laporan tidak dikenal: " + raw);
        }
    }

    private User requireUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pengguna tidak ditemukan."));
    }

    private Song requireSong(Long songId) {
        return songRepository.findById(songId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lagu tidak ditemukan."));
    }
}
