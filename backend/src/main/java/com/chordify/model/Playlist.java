package com.chordify.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * Playlist: daftar lagu pilihan milik seorang member.
 *
 * <p>Isi daftar disimpan terpisah di {@link PlaylistSong} supaya satu playlist
 * bisa berisi lagu yang sama dengan milik orang lain.
 *
 * <p>Kolom dan aturan yang sama dengan {@link Setlist} diwarisi dari
 * {@link SongCollection}; yang membedakan hanya jenis daftarnya.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-1] Class &amp; Object — {@code Playlist} adalah class; tiap baris di
 *       tabel {@code playlists} adalah objeknya.</li>
 *   <li>[PBO-3] Inheritance — {@code Playlist extends SongCollection}.</li>
 *   <li>[PBO-9] Method Overriding — {@link #getCollectionType()} di-override
 *       menjadi {@code "PLAYLIST"}.</li>
 * </ul>
 */
@Entity
@Table(name = "playlists")
public class Playlist extends SongCollection {

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    protected Playlist() {
        super();
    }

    /** [PBO-7] Constructor — playlist baru: selalu punya pemilik dan judul. */
    public Playlist(User user, String title) {
        super(user, title);
    }

    /**
     * Override dari {@link SongCollection}: playlist adalah daftar yang urutannya longgar.
     *
     * <p>[PBO-9] Method Overriding — implementasi milik Playlist untuk method
     * abstrak di superclass.
     */
    @Override
    public String getCollectionType() {
        return "PLAYLIST";
    }
}
