package com.chordify.dto;

import com.chordify.model.Report;
import java.time.LocalDateTime;

/**
 * Bentuk laporan yang dikirim ke frontend.
 */
public record ReportResponse(
        Long id,
        Long songId,
        String songTitle,
        String artist,
        String category,
        String details,
        String status,
        String reporter,
        LocalDateTime createdAt,
        String adminNote) {

    public static ReportResponse from(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getSong().getId(),
                report.getSong().getTitle(),
                report.getSong().getArtist().getName(),
                report.getCategory().name(),
                report.getDetails(),
                report.getStatus().name(),
                report.getReporter().getUsername(),
                report.getCreatedAt(),
                report.getAdminNote());
    }
}
