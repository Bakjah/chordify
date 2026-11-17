package com.chordify.model;

import com.chordify.contract.Reportable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

/**
 * Lagu beserta lirik dan chord-nya.
 *
 * <p>Relasi sesuai ERD: satu lagu milik satu {@link Artist} dan satu {@link Genre},
 * dan bisa disumbangkan oleh satu {@link User} sebagai kontributor.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-1] Class &amp; Object — {@code Song} adalah class; setiap baris di
 *       tabel {@code songs} adalah objeknya, dibuat lewat {@code new Song(...)}.</li>
 *   <li>[PBO-2] Encapsulation — semua atribut {@code private}; isi lagu hanya
 *       dibaca lewat getter dan diubah lewat setter atau method domain.</li>
 *   <li>[PBO-6] Interface — {@code Song} memenuhi kontrak {@link Reportable},
 *       sehingga bisa dilaporkan tanpa service perlu tahu detail lagunya.</li>
 *   <li>[PBO-7] Constructor — objek hanya boleh dibuat lewat konstruktor yang
 *       mewajibkan judul, artis, dan genre.</li>
 * </ul>
 */
@Entity
@Table(name = "songs")
public class Song implements Reportable {

    // [PBO-2] Encapsulation — seluruh atribut di bawah private, diakses lewat
    // getter/setter atau method domain (misal isPublished(), changePasswordHash()).

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "genre_id", nullable = false)
    private Genre genre;

    /** Nada dasar lagu, misalnya "G Major". */
    @Column(name = "key_signature", length = 30)
    private String keySignature;

    /** Tingkat kesulitan, misalnya "Easy". */
    @Column(length = 20)
    private String difficulty;

    /** Warna dasar kartu artwork, misal "#315a52". */
    @Column(name = "artwork_color", length = 7)
    private String artworkColor;

    /**
     * Lirik dan chord disimpan sebagai JSON array di dalam kolom teks:
     * {@code [{"chord":"G","line":"Dan terjadi lagi"}]}.
     */
    @Column(columnDefinition = "TEXT")
    private String lyrics;

    /** Posisi capo, 0 berarti tanpa capo. */
    @Column(nullable = false)
    private int capo = 0;

    /** Alamat berkas audio untuk playback, misalnya "/uploads/songs/ab12.mp3". */
    @Column(name = "audio_path", length = 255)
    private String audioPath;

    /** Nama berkas audio asli dari pengguna. */
    @Column(name = "audio_name", length = 200)
    private String audioName;

    /** Tipe MIME berkas audio, misalnya "audio/mpeg". */
    @Column(name = "audio_type", length = 60)
    private String audioType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contributor_id")
    private User contributor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SongStatus status = SongStatus.PUBLISHED;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /** [PBO-7] Constructor — versi kosong dipakai Hibernate saat memuat baris dari database. */
    public Song() {
        // dipakai Hibernate saat memuat baris dari database
    }

    /**
     * Konstruktor domain: judul, artis, dan genre minimal wajib diisi.
     *
     * <p>Capo default nol dan status default {@link SongStatus#PUBLISHED} supaya
     * lagu baru langsung tampil.
     *
     * <p>[PBO-7] Constructor — inisialisasi objek lewat {@code new Song(...)}.
     */
    public Song(String title, Artist artist, Genre genre) {
        this.title = title;
        this.artist = artist;
        this.genre = genre;
    }

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /** Lagu yang sudah dipublish saja yang tampil di library publik. */
    public boolean isPublished() {
        return status == SongStatus.PUBLISHED;
    }

    /** Id lagu ini yang dipakai saat lagu dilaporkan. */
    @Override
    public Long getReportableId() {
        return id;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Artist getArtist() {
        return artist;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public Genre getGenre() {
        return genre;
    }

    public void setGenre(Genre genre) {
        this.genre = genre;
    }

    public String getKeySignature() {
        return keySignature;
    }

    public void setKeySignature(String keySignature) {
        this.keySignature = keySignature;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getArtworkColor() {
        return artworkColor;
    }

    public void setArtworkColor(String artworkColor) {
        this.artworkColor = artworkColor;
    }

    public String getLyrics() {
        return lyrics;
    }

    public void setLyrics(String lyrics) {
        this.lyrics = lyrics;
    }

    public int getCapo() {
        return capo;
    }

    public void setCapo(int capo) {
        this.capo = capo;
    }

    public String getAudioPath() {
        return audioPath;
    }

    public void setAudioPath(String audioPath) {
        this.audioPath = audioPath;
    }

    public String getAudioName() {
        return audioName;
    }

    public void setAudioName(String audioName) {
        this.audioName = audioName;
    }

    public String getAudioType() {
        return audioType;
    }

    public void setAudioType(String audioType) {
        this.audioType = audioType;
    }

    public User getContributor() {
        return contributor;
    }

    public void setContributor(User contributor) {
        this.contributor = contributor;
    }

    public SongStatus getStatus() {
        return status;
    }

    public void setStatus(SongStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
