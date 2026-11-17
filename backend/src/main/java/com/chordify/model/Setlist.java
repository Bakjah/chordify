package com.chordify.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * Urutan lagu untuk latihan atau gigs — setlist punya urutan yang dijaga
 * member, berbeda dari playlist yang sifatnya kumpulan.
 *
 * <p>Kolom dan aturan yang sama dengan {@link Playlist} diwarisi dari
 * {@link SongCollection}; yang membedakan hanya jenis daftarnya.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-3] Inheritance — {@code Setlist extends SongCollection}.</li>
 *   <li>[PBO-9] Method Overriding — {@link #getCollectionType()} di-override
 *       menjadi {@code "SETLIST"}.</li>
 * </ul>
 */
@Entity
@Table(name = "setlists")
public class Setlist extends SongCollection {

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    protected Setlist() {
        super();
    }

    /** [PBO-7] Constructor — setlist baru: selalu punya pemilik dan judul. */
    public Setlist(User user, String title) {
        super(user, title);
    }

    /**
     * Override dari {@link SongCollection}: setlist adalah daftar berurutan.
     *
     * <p>[PBO-9] Method Overriding — implementasi milik Setlist untuk method
     * abstrak di superclass.
     */
    @Override
    public String getCollectionType() {
        return "SETLIST";
    }
}
