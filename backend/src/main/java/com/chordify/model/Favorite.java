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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 * Satu lagu yang ditandai member sebagai favorit.
 *
 * <p>Relasi ke {@link User} dan {@link Song} disimpan sebagai foreign key, bukan
 * objek, supaya daftar favorit tidak ikut memuat data lagu yang tidak perlu.
 */
@Entity
@Table(
        name = "favorites",
        uniqueConstraints = @UniqueConstraint(name = "uk_favorites_user_song", columnNames = {"user_id", "song_id"}))
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    protected Favorite() {
    }

    /** Menandai sebuah lagu sebagai favorit milik user tertentu. */
    public Favorite(User user, Song song) {
        this.user = user;
        this.song = song;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Song getSong() { return song; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
