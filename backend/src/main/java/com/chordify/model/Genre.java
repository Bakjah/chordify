package com.chordify.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Genre lagu, misalnya Pop atau Rock.
 *
 * <p>Satu genre punya banyak lagu (relasi satu ke banyak dari {@link Song}).
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-1] Class &amp; Object — {@code Genre} adalah class; tiap baris di
 *       tabel {@code genres} adalah objeknya.</li>
 *   <li>[PBO-2] Encapsulation — atribut private, diakses lewat getter/setter.</li>
 *   <li>[PBO-7] Constructor — objek genre dibuat lewat {@code new Genre(name)}.</li>
 * </ul>
 */
@Entity
@Table(name = "genres")
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    public Genre() {
        // dipakai Hibernate saat memuat baris dari database
    }

    /** Konstruktor domain: nama genre minimal wajib diisi. */
    public Genre(String name) {
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
}
