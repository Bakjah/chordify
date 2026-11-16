package com.chordify.controller;

import com.chordify.dto.ReportRequest;
import com.chordify.dto.ReportResponse;
import com.chordify.service.ReportService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint laporan lagu untuk member.
 *
 * <p>Admin memakai {@code /api/admin/reports} untuk meninjau laporan.
 */
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /** Mengirim laporan baru untuk sebuah lagu. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReportResponse submit(@Valid @RequestBody ReportRequest request, Authentication authentication) {
        return reportService.submit(userId(authentication), request);
    }

    /** Laporan yang pernah dikirim member yang sedang login. */
    @GetMapping("/mine")
    public List<ReportResponse> listMine(Authentication authentication) {
        return reportService.listMine(userId(authentication));
    }

    /** Id user dari token yang dipakai; null kalau request tanpa login. */
    private Long userId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Long id)) {
            return null;
        }
        return id;
    }
}
