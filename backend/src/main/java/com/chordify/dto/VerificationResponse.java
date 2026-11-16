package com.chordify.dto;

import com.chordify.model.VerificationRequest;
import java.time.LocalDateTime;

/**
 * Bentuk pengajuan verifikasi yang dikirim ke frontend.
 */
public record VerificationResponse(
        Long id,
        String category,
        String proof,
        String proofUrl,
        String status,
        String applicant,
        LocalDateTime createdAt,
        LocalDateTime reviewedAt,
        String adminNote) {

    public static VerificationResponse from(VerificationRequest request) {
        return new VerificationResponse(
                request.getId(),
                request.getCategory(),
                request.getProof(),
                request.getProofUrl(),
                request.getStatus().name(),
                request.getMember().getUsername(),
                request.getCreatedAt(),
                request.getReviewedAt(),
                request.getAdminNote());
    }
}
