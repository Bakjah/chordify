package com.chordify.model;

import jakarta.persistence.*;

/**
 * Member: pengguna umum Chordify. Member adalah satu-satunya role yang bisa
 * mengajukan verifikasi (Verified User).
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-3] Inheritance — {@code Member extends User}, jadi mewarisi seluruh
 *       data akun (username, email, hash password) dari superclass-nya.</li>
 *   <li>[PBO-9] Method Overriding — {@link #getRole()} dan {@link #isVerified()}
 *       di-override dengan aturan milik Member.</li>
 * </ul>
 */
@Entity
@DiscriminatorValue("MEMBER")
public class Member extends User {

    /** Verified User: Artist / Songwriter / Band Member / Musician (disetujui admin). */
    @Column(name = "verified")
    private boolean verified = false;

    @Column(name = "verified_category", length = 30)
    private String verifiedCategory;

    /** Konstruktor kosong — dipakai Hibernate saat memuat baris dari database. */
    public Member() {
        super();
    }

    /** [PBO-7] Constructor — akun member baru, meneruskan data ke superclass. */
    public Member(String username, String email, String passwordHash) {
        super(username, email, passwordHash);
    }

    /** [PBO-9] Method Overriding — versi Member dari aturan peran di superclass. */
    @Override
    public String getRole() {
        return "MEMBER";
    }

    /**
     * Override dari {@link User}: hanya Member yang bisa berstatus terverifikasi.
     *
     * <p>[PBO-9] Method Overriding — implementasi berbeda dari milik superclass.
     */
    @Override
    public boolean isVerified() {
        return verified;
    }

    public String getVerifiedCategory() { return verifiedCategory; }
    public void setVerifiedCategory(String verifiedCategory) { this.verifiedCategory = verifiedCategory; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
