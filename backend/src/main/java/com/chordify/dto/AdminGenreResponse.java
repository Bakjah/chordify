package com.chordify.dto;

import com.chordify.model.Genre;

/**
 * Bentuk genre untuk tabel "Manage Genres".
 *
 * <p>Menambah jumlah lagu supaya admin tahu genre mana yang masih aman dihapus.
 */
public record AdminGenreResponse(Long id, String name, long songCount) {

    public static AdminGenreResponse from(Genre genre, long songCount) {
        return new AdminGenreResponse(genre.getId(), genre.getName(), songCount);
    }
}
