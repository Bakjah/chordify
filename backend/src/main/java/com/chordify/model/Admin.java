package com.chordify.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * Admin: pengelola platform. Akun admin tidak bisa didaftarkan lewat API —
 * hanya dibuat oleh seeder DataInitializer (lihat {@code config.DataInitializer}).
 */
@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    /** Konstruktor kosong — dipakai Hibernate. */
    public Admin() {
        super();
    }

    /** Akun admin baru. */
    public Admin(String username, String email, String passwordHash) {
        super(username, email, passwordHash);
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }
}
