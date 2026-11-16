package com.chordify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data yang dikirim member saat mengajukan verifikasi Verified User.
 */
public record VerificationApplyRequest(
        @NotBlank @Size(max = 30) String category,
        @Size(max = 4000) String proof,
        @Size(max = 255) String proofUrl) {
}
