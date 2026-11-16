package com.chordify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * Data yang dikirim member saat menambah atau mengedit lagu.
 *
 * <p>Artis dan genre ditulis sebagai nama, bukan id — supaya frontend tidak
 * perlu tahu id-nya. Backend yang mencari atau membuatnya.
 */
public record SongRequest(
        @NotBlank @Size(max = 150) String title,
        @NotBlank @Size(max = 100) String artist,
        @NotBlank @Size(max = 50) String genre,
        @Size(max = 30) String key,
        @Size(max = 20) String difficulty,
        @Size(max = 7) String artwork,
        List<LyricLine> lyrics,
        Integer capo) {
}
