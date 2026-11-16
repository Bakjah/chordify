package com.chordify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Data yang dikirim member saat melaporkan sebuah lagu.
 *
 * <p>{@code category} memakai nama enum {@code ReportCategory} (misal
 * {@code INCORRECT_CHORDS}) supaya frontend dan backend punya satu kosakata.
 */
public record ReportRequest(
        @NotNull Long songId,
        @NotBlank @Size(max = 30) String category,
        @Size(max = 2000) String details) {
}
