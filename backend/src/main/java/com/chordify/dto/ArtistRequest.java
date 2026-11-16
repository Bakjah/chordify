package com.chordify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data yang dikirim admin saat menambah atau mengubah artis.
 */
public record ArtistRequest(
        @NotBlank(message = "Nama artis wajib diisi")
        @Size(max = 100, message = "Nama artis maksimal 100 karakter")
        String name,
        @Size(max = 7, message = "Warna artwork maksimal 7 karakter")
        String artwork,
        @Size(max = 255, message = "Bio maksimal 255 karakter")
        String bio) {
}
