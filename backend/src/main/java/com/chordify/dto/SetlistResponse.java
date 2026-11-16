package com.chordify.dto;

import com.chordify.model.Setlist;
import java.time.LocalDateTime;

/**
 * Bentuk setlist yang dikirim ke frontend.
 *
 * <p>Strukturnya sama dengan {@link PlaylistResponse} karena keduanya memang
 * daftar lagu milik member — bedanya hanya setlist urutannya dijaga member.
 */
public record SetlistResponse(
        Long id,
        String title,
        String description,
        int songs,
        String artwork,
        LocalDateTime createdAt) {

    public static SetlistResponse from(Setlist setlist, int songs) {
        return new SetlistResponse(
                setlist.getId(),
                setlist.getTitle(),
                setlist.getDescription(),
                songs,
                setlist.getArtworkColor(),
                setlist.getCreatedAt());
    }
}
