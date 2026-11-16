package com.chordify.model;

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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/**
 * Daftar lagu pilihan milik seorang member.
 *
 * <p>Isi daftar disimpan terpisah di {@link PlaylistSong} supaya satu playlist
 * bisa berisi lagu yang sama dengan milik orang lain.
 */
@Entity
@Table(name = "playlists")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    protected Playlist() {
    }

    /** Playlist baru: selalu punya pemilik dan judul. */
    public Playlist(User user, String title) {
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

    /** Mengubah judul dan keterangan playlist. */
    public void rename(String title, String description, String artworkColor) {
        this.title = title;
        this.description = description;
        this.artworkColor = artworkColor;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getArtworkColor() { return artworkColor; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
