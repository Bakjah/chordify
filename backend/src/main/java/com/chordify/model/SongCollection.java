package com.chordify.model;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.time.LocalDateTime;

/**
 * Abstract class dasar untuk daftar lagu milik member.
 *
 * <p>Playlist dan Setlist sebenarnya dua jenis yang sama: sama-sama daftar
 * lagu milik seorang member, sama-sama punya judul, keterangan, dan urutan
 * lagu. Yang membedakan cuma {@link Playlist} tidak menjaga urutan,
 * sedangkan {-@link Setlist} menjaga urutan untuk latihan atau gigs.
 *
 * <p>Semua milik dasar dikumpulkan di sini supaya dua anak tidak menulis
 * ulang kolom dan aturan yang sama. Kelas ini memakai
 * {@link MappedSuperclass}, bukan {@code @Entity} dengan {@code SINGLE_TABLE},
 * supaya tabel {@code playlists} dan {@code setlists} tetap terpisah dan data
 * yang sudah ada tidak perlu dimigrasi.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-3] Inheritance — {@code SongCollection} adalah superclass dari
 *       {@link Playlist} dan {@link Setlist}.</li>
 *   <li>[PBO-4] Polymorphism — pemanggil cukup menulis
 *       {@code collection.getCollectionType()} tanpa perlu cek tipe datanya.</li>
 *   <li>[PBO-5] Abstraction — class abstrak dengan method abstrak
 *       {@link #getCollectionType()}.</li>
 *   <li>[PBO-7] Constructor — konstruktor domain mewajibkan pemilik dan judul.</li>
 * </ul>
 */
@MappedSuperclass
public abstract class SongCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Pemilik daftar. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(length = 255)
    private String description;

    @Column(name = "artwork_color", length = 7)
    private String artworkColor;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /** [PBO-7] Constructor — versi kosong dipakai Hibernate saat memuat baris dari database. */
    protected SongCollection() {
    }

    /** [PBO-7] Constructor — daftar baru: selalu punya pemilik dan judul. */
    protected SongCollection(User user, String title) {
        this.user = user;
        this.title = title;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /** Mengubah judul dan keterangan daftar. */
    public void rename(String title, String description, String artworkColor) {
        this.title = title;
        this.description = description;
        this.artworkColor = artworkColor;
    }

    /**
     * Jenis daftar ini — {@code PLAYLIST} atau {@code SETLIST}.
     *
     * <p>Setiap anak menentukan sendiri jenisnya (method overriding), jadi
     * pemanggil cukup menulis {@code collection.getCollectionType()} tanpa
     * perlu cek tipe datanya.
     */
    public abstract String getCollectionType();

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getArtworkColor() { return artworkColor; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
