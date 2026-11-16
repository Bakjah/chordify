package com.chordify.model;

import com.chordify.contract.CollectionEntry;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 * Isi satu playlist: satu lagu pada posisi tertentu.
 *
 * <p>Posisi disimpan supaya urutan lagu yang ditampilkan user tetap sama
 * seperti saat dia menaatannya.
 */
@Entity
@Table(
        name = "playlist_songs",
        uniqueConstraints = @UniqueConstraint(name = "uk_playlist_songs", columnNames = {"playlist_id", "song_id"}))
public class PlaylistSong implements CollectionEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(nullable = false)
    private int position;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    protected PlaylistSong() {
    }

    /** Menambahkan lagu ke playlist pada urutan tertentu. */
    public PlaylistSong(Playlist playlist, Song song, int position) {
        this.playlist = playlist;
        this.song = song;
        this.position = position;
    }

    @PrePersist
    void onCreate() {
        this.addedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Playlist getPlaylist() { return playlist; }
    public Song getSong() { return song; }
    public int getPosition() { return position; }
    public LocalDateTime getAddedAt() { return addedAt; }
}
