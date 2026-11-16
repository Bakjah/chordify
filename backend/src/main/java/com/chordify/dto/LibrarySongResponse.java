package com.chordify.dto;

import com.chordify.model.Song;

/**
 * Bentuk lagu ringkas untuk halaman library member.
 *
 * <p>Namanya mengikuti bentuk kartu di halaman library member supaya
 * kartu favorit/riwayat bisa langsung pakai hasil API tanpa ubah tampilan.
 */
public record LibrarySongResponse(Long id, String title, String artist, String artwork) {

    public static LibrarySongResponse from(Song song) {
        return new LibrarySongResponse(
                song.getId(),
                song.getTitle(),
                song.getArtist().getName(),
                song.getArtworkColor());
    }
}
