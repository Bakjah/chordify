package com.chordify.dto;

import com.chordify.model.Artist;

/**
 * Bentuk artis untuk tabel "Manage Artists".
 *
 * <p>Menambah jumlah lagu supaya admin tahu artis mana yang masih aman dihapus.
 */
public record AdminArtistResponse(Long id, String name, String artwork, String bio, long songCount) {

    public static AdminArtistResponse from(Artist artist, long songCount) {
        return new AdminArtistResponse(
                artist.getId(),
                artist.getName(),
                artist.getArtworkColor(),
                artist.getBio(),
                songCount);
    }
}
