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
 * Isi satu setlist: satu lagu pada urutan tertentu.
 */
@Entity
@Table(
        name = "setlist_songs",
        uniqueConstraints = @UniqueConstraint(name = "uk_setlist_songs", columnNames = {"setlist_id", "song_id"}))
public class SetlistSong implements CollectionEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "setlist_id", nullable = false)
    private Setlist setlist;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(nullable = false)
    private int position;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    protected SetlistSong() {
    }

    /** Menambahkan lagu ke setlist pada urutan tertentu. */
    public SetlistSong(Setlist setlist, Song song, int position) {
        this.setlist = setlist;
        this.song = song;
        this.position = position;
    }

    @PrePersist
    void onCreate() {
        this.addedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Setlist getSetlist() { return setlist; }
    public Song getSong() { return song; }
    public int getPosition() { return position; }
    public LocalDateTime getAddedAt() { return addedAt; }
}
