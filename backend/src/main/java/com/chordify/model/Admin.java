package com.chordify.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * Admin: pengelola platform. Akun admin tidak bisa didaftarkan lewat API —
 * hanya dibuat oleh seeder DataInitializer (lihat {@code config.DataInitializer}).
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-3] Inheritance — {@code Admin extends User}.</li>
 *   <li>[PBO-9] Method Overriding — {@link #getRole()} di-override; method
 *       {@code isVerified()} memakai aturan bawaan superclass.</li>
 * </ul>
 */
@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    /** Konstruktor kosong — dipakai Hibernate. */
    public Admin() {
        super();
    }

    /** [PBO-7] Constructor — akun admin baru, meneruskan data ke superclass. */
    public Admin(String username, String email, String passwordHash) {
        super(username, email, passwordHash);
    }

    /** [PBO-9] Method Overriding — versi Admin dari aturan peran di superclass. */
    @Override
    public String getRole() {
        return "ADMIN";
    }
}
