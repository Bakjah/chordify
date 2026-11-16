package com.chordify.dto;

import com.chordify.model.Song;
import java.time.LocalDateTime;

/**
 * Baris tabel "Manage Songs" untuk konsol admin.
 */
public record AdminSongResponse(
        Long id,
        String title,
        String artist,
        String genre,
        String contributor,
        LocalDateTime createdAt,
        String status) {

    public static AdminSongResponse from(Song song) {
        return new AdminSongResponse(
                song.getId(),
                song.getTitle(),
                song.getArtist().getName(),
                song.getGenre().getName(),
                song.getContributor() == null ? "-" : "@" + song.getContributor().getUsername(),
                song.getCreatedAt(),
                song.getStatus().name());
    }
}
