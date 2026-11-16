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
 * Riwayat lagu yang pernah dibuka seorang member.
 *
 * <p>Satu member punya paling banyak satu baris untuk satu lagu, jadi
 * membuka lagu yang sama dua kali hanya memperbarui waktu dilihat.
 */
@Entity
@Table(
        name = "song_history",
        uniqueConstraints = @UniqueConstraint(name = "uk_song_history_user_song", columnNames = {"user_id", "song_id"}))
public class SongHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(name = "viewed_at", nullable = false)
    private LocalDateTime viewedAt;

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    protected SongHistory() {
    }

    /** Mencatat pertama kali seorang member membuka sebuah lagu. */
    public SongHistory(User user, Song song) {
        this.user = user;
        this.song = song;
    }

    @PrePersist
    void onCreate() {
        if (viewedAt == null) {
            viewedAt = LocalDateTime.now();
        }
    }

    /** Menandai lagu baru saja dilihat — dipanggil setiap kali halaman dibuka lagi. */
    public void touch() {
        this.viewedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Song getSong() { return song; }
    public LocalDateTime getViewedAt() { return viewedAt; }
}
