package com.chordify.dto;

/**
 * Ringkasan satu lagu milik artis, untuk halaman detail artis.
 */
public record ArtistSong(Long id, String title, String artwork) {
}
