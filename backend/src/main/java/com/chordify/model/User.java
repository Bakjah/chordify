package com.chordify.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/**
 * Kelas induk Admin dan Member (abstraksi + pewarisan).
 * Satu tabel `users`, dibedakan kolom {@code role} sebagai discriminator.
 *
 * <p>Password tidak pernah disimpan apa adanya: yang disimpan adalah hash-nya,
 * dan hash itu hanya bisa diganti lewat aksi domain {@link #changePasswordHash(String)}
 * supaya tidak bisa dimanipulasi dari luar (encapsulation).
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-1] Class &amp; Object — {@code User} adalah class; objeknya adalah
 *       akun Member atau Admin.</li>
 *   <li>[PBO-2] Encapsulation — atribut private; {@code passwordHash} tidak punya
 *       setter publik, hanya bisa diubah lewat {@link #changePasswordHash(String)}.</li>
 *   <li>[PBO-3] Inheritance — {@code User} adalah superclass dari {@link Member}
 *       dan {@link Admin}.</li>
 *   <li>[PBO-4] Polymorphism — {@link #isVerified()} dan {@link #getRole()} punya
 *       implementasi berbeda di tiap anak class.</li>
 *   <li>[PBO-5] Abstraction — class abstrak: tidak bisa di-instansiasi sendiri,
 *       hanya lewat subclass-nya.</li>
 *   <li>[PBO-7] Constructor — dua konstruktor: kosong untuk Hibernate dan
 *       konstruktor domain yang mewajibkan username, email, dan hash password.</li>
 * </ul>
 */
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "role", discriminatorType = DiscriminatorType.STRING, length = 20)
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String username;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(length = 255)
    private String bio;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** [PBO-7] Constructor — versi kosong dipakai Hibernate saat memuat baris dari database. */
    protected User() {
    }

    /**
     * Konstruktor domain: akun baru harus selalu punya username, email, dan hash password.
     * Tidak ada jalan lain untuk membuat akun yang tidak punya ketiga nilai ini.
     *
     * <p>[PBO-7] Constructor — objek akun selalu dibuat lewat konstruktor ini,
     * lalu mewarisikonstruktor ke {@link Member} atau {@link Admin}.
     */
    protected User(String username, String email, String passwordHash) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /** Peran pengguna. Tiap subclass menentukan sendiri nilainya (method overriding). */
    public abstract String getRole();

    /**
     * Status verifikasi. Hanya Member yang bisa diverifikasi, role lain otomatis tidak
     * (overriding). Dipanggil lewat {@code User} sehingga tidak perlu cek {@code instanceof}.
     *
     * <p>[PBO-4] Polymorphism — method ini dioverride di {@link Member}; pemanggil
     * cukup menulis {@code user.isVerified()} untuk tipe apa pun.
     */
    public boolean isVerified() {
        return false;
    }

    /** Aturan domain: akun hanya boleh masuk ke aplikasi kalau masih aktif. */
    public boolean canLogin() {
        return active;
    }

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    /**
     * Mengganti hash password. Dipakai saat registrasi dan saat pengguna mengganti password;
     * tidak ada setter publik lain untuk {@code passwordHash}.
     */
    public void changePasswordHash(String newPasswordHash) {
        this.passwordHash = newPasswordHash;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
