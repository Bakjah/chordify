package com.chordify.dto;

import com.chordify.model.Playlist;
import java.time.LocalDateTime;

/**
 * Bentuk playlist yang dikirim ke frontend.
 *
 * <p>{@code songs} adalah jumlah lagu di dalamnya, bukan daftar — supaya kartu
 * playlist cukup satu baris tanpa request tambahan.
 */
public record PlaylistResponse(
        Long id,
        String title,
        String description,
        int songs,
        String artwork,
        LocalDateTime createdAt) {

    public static PlaylistResponse from(Playlist playlist, int songs) {
        return new PlaylistResponse(
                playlist.getId(),
                playlist.getTitle(),
                playlist.getDescription(),
                songs,
                playlist.getArtworkColor(),
                playlist.getCreatedAt());
    }
}
