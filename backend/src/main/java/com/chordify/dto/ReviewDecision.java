package com.chordify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Keputusan admin atas sebuah laporan atau pengajuan verifikasi.
 *
 * <p>{@code status} memakai nama enum status yang sesuai (misal
 * {@code RESOLVED} untuk laporan, {@code APPROVED} untuk verifikasi).
 */
public record ReviewDecision(
        @NotBlank @Size(max = 20) String status,
        @Size(max = 2000) String note) {
}
