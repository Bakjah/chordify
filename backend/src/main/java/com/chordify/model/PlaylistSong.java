package com.chordify.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 * Isi satu playlist: satu lagu pada posisi tertentu.
 *
 * <p>Posisi disimpan supaya urutan lagu yang ditampilkan user tetap sama
 * seperti saat dia menaatannya. Bagian yang sama dengan baris setlist
 * diwarisi dari {@link SongSlot}.
 */
@Entity
@Table(
        name = "playlist_songs",
        uniqueConstraints = @UniqueConstraint(name = "uk_playlist_songs", columnNames = {"playlist_id", "song_id"}))
public class PlaylistSong extends SongSlot {

    /** Playlist yang memuat baris ini. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    protected PlaylistSong() {
        super();
    }

    /** Menambahkan lagu ke playlist pada urutan tertentu. */
    public PlaylistSong(Playlist playlist, Song song, int position) {
        super(song, position);
        this.playlist = playlist;
    }

    public Playlist getPlaylist() { return playlist; }
}
