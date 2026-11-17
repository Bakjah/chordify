package com.chordify.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 * Isi satu setlist: satu lagu pada posisi tertentu.
 *
 * <p>Bagian yang sama dengan baris playlist diwarisi dari {@link SongSlot}.
 */
@Entity
@Table(
        name = "setlist_songs",
        uniqueConstraints = @UniqueConstraint(name = "uk_setlist_songs", columnNames = {"setlist_id", "song_id"}))
public class SetlistSong extends SongSlot {

    /** Setlist yang memuat baris ini. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "setlist_id", nullable = false)
    private Setlist setlist;

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    protected SetlistSong() {
        super();
    }

    /** Menambahkan lagu ke setlist pada urutan tertentu. */
    public SetlistSong(Setlist setlist, Song song, int position) {
        super(song, position);
        this.setlist = setlist;
    }

    public Setlist getSetlist() { return setlist; }
}
