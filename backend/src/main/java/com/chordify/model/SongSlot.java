package com.chordify.model;

import com.chordify.contract.CollectionEntry;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import java.time.LocalDateTime;

/**
 * Abstract class dasar untuk satu baris di dalam daftar lagu.
 *
 * <p>Baris playlist dan baris setlist sama-sama berisi satu lagu pada
 * urutan tertentu, lalu disimpan terpisah supaya satu daftar bisa punya lagu
 * yang sama dengan daftar milik orang lain. Bagian yang sama itu dikumpulkan
 * di sini; yang membedakan hanya lagu itu disimpan di playlist atau di setlist.
 *
 * <p>Kelas ini sekaligus memenuhi kontrak {@link CollectionEntry}, jadi
 * service cukup menulis satu cara baca untuk kedua jenis baris.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-3] Inheritance — {@code SongSlot} adalah superclass dari
 *       {@link PlaylistSong} dan {@link SetlistSong}.</li>
 *   <li>[PBO-5] Abstraction — class abstrak, tidak bisa di-instansiasi sendiri.</li>
 *   <li>[PBO-6] Interface — {@code SongSlot implements CollectionEntry}.</li>
 * </ul>
 */
@MappedSuperclass
public abstract class SongSlot implements CollectionEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Lagu yang ditambahkan ke daftar. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    /** Urutan lagu di dalam daftar, mulai dari 0. */
    @Column(nullable = false)
    private int position;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    protected SongSlot() {
    }

    /** Menambahkan satu lagu ke daftar pada urutan tertentu. */
    protected SongSlot(Song song, int position) {
        this.song = song;
        this.position = position;
    }

    @PrePersist
    void onCreate() {
        this.addedAt = LocalDateTime.now();
    }

    @Override
    public Song getSong() {
        return song;
    }

    @Override
    public int getPosition() {
        return position;
    }

    public Long getId() { return id; }
    public LocalDateTime getAddedAt() { return addedAt; }
}
