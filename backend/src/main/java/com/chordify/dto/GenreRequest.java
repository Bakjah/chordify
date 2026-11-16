package com.chordify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data yang dikirim admin saat menambah atau mengubah genre.
 */
public record GenreRequest(
        @NotBlank(message = "Nama genre wajib diisi")
        @Size(max = 50, message = "Nama genre maksimal 50 karakter")
        String name) {
}
