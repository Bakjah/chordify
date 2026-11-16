package com.chordify.controller;

import com.chordify.dto.AdminSongResponse;
import com.chordify.dto.AdminStatsResponse;
import com.chordify.dto.AdminUserResponse;
import com.chordify.dto.ReportResponse;
import com.chordify.dto.ReviewDecision;
import com.chordify.dto.SongStatusRequest;
import com.chordify.dto.UserActiveRequest;
import com.chordify.dto.VerificationResponse;
import com.chordify.exception.ApiException;
import com.chordify.model.ReportStatus;
import com.chordify.model.SongStatus;
import com.chordify.model.VerificationStatus;
import com.chordify.service.AdminService;
import com.chordify.service.ReportService;
import com.chordify.service.VerificationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint khusus admin: antrean laporan dan antrean pengajuan verifikasi.
 *
 * <p>Aksesnya sudah dijaga {@code SecurityConfig} — seluruh {@code /api/admin/**}
 * hanya boleh dibuka oleh pengguna dengan role ADMIN.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ReportService reportService;
    private final VerificationService verificationService;
    private final AdminService adminService;

    public AdminController(ReportService reportService,
                           VerificationService verificationService,
                           AdminService adminService) {
        this.reportService = reportService;
        this.verificationService = verificationService;
        this.adminService = adminService;
    }

    // -------------------------------------------------------------- dashboard

    /** Angka ringkas platform untuk dashboard admin. */
    @GetMapping("/stats")
    public AdminStatsResponse stats() {
        return adminService.stats();
    }

    /** Daftar akun untuk tabel "Manage Users". */
    @GetMapping("/users")
    public List<AdminUserResponse> listUsers() {
        return adminService.listUsers();
    }

    /** Admin mengaktifkan atau menonaktifkan sebuah akun. */
    @PutMapping("/users/{id}/active")
    public AdminUserResponse setUserActive(@PathVariable Long id,
                                            @RequestBody UserActiveRequest request) {
        return adminService.setUserActive(id, request.active());
    }

    /** Daftar lagu untuk tabel "Manage Songs". */
    @GetMapping("/songs")
    public List<AdminSongResponse> listSongs() {
        return adminService.listSongs();
    }

    /** Admin memublish atau menolak sebuah lagu. */
    @PutMapping("/songs/{id}/status")
    public AdminSongResponse setSongStatus(@PathVariable Long id,
                                            @Valid @RequestBody SongStatusRequest request) {
        return adminService.setSongStatus(id, parseSongStatus(request.status()));
    }

    // ---------------------------------------------------------------- laporan

    /** Antrean laporan, bisa difilter per status. */
    @GetMapping("/reports")
    public List<ReportResponse> listReports(@RequestParam(required = false) String status) {
        return reportService.listAll(parseReportStatus(status));
    }

    /** Admin menangani satu laporan. */
    @PutMapping("/reports/{id}/review")
    public ReportResponse reviewReport(@PathVariable Long id,
                                       @Valid @RequestBody ReviewDecision decision,
                                       Authentication authentication) {
        return reportService.review(userId(authentication), id, decision);
    }

    // ------------------------------------------------------------ verifikasi

    /** Antrean pengajuan verifikasi, bisa difilter per status. */
    @GetMapping("/verification")
    public List<VerificationResponse> listVerification(@RequestParam(required = false) String status) {
        return verificationService.listAll(parseVerificationStatus(status));
    }

    /** Admin menyetujui atau menolak satu pengajuan. */
    @PutMapping("/verification/{id}/review")
    public VerificationResponse reviewVerification(@PathVariable Long id,
                                                    @Valid @RequestBody ReviewDecision decision,
                                                    Authentication authentication) {
        return verificationService.review(userId(authentication), id, decision);
    }

    // ------------------------------------------------------------------ helper

    private ReportStatus parseReportStatus(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return ReportStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Status laporan tidak dikenal: " + raw);
        }
    }

    private VerificationStatus parseVerificationStatus(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return VerificationStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Status pengajuan tidak dikenal: " + raw);
        }
    }

    private SongStatus parseSongStatus(String raw) {
        try {
            return SongStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Status lagu tidak dikenal: " + raw);
        }
    }

    /** Id user dari token yang dipakai; null kalau request tanpa login. */
    private Long userId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Long id)) {
            return null;
        }
        return id;
    }
}
