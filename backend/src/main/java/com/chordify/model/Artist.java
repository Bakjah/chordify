package com.chordify.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Artis atau grup yang memiliki lagu.
 *
 * <p>Satu artis punya banyak lagu (relasi satu ke banyak dari {@link Song}).
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-1] Class &amp; Object — {@code Artist} adalah class; tiap baris di
 *       tabel {@code artists} adalah objeknya.</li>
 *   <li>[PBO-2] Encapsulation — atribut private, diakses lewat getter/setter.</li>
 *   <li>[PBO-7] Constructor — objek artis dibuat lewat {@code new Artist(name)}.</li>
 * </ul>
 */
@Entity
@Table(name = "artists")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "artwork_color", length = 7)
    private String artworkColor;

    @Column(length = 255)
    private String bio;

    public Artist() {
        // dipakai Hibernate saat memuat baris dari database
    }

    /** Konstruktor domain: nama artis minimal wajib diisi. */
    public Artist(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getArtworkColor() {
        return artworkColor;
    }

    public void setArtworkColor(String artworkColor) {
        this.artworkColor = artworkColor;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
