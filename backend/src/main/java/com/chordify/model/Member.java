package com.chordify.model;

import jakarta.persistence.*;

/**
 * Member: pengguna umum Chordify. Member adalah satu-satunya role yang bisa
 * mengajukan verifikasi (Verified User).
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

    /** Akun member baru. */
    public Member(String username, String email, String passwordHash) {
        super(username, email, passwordHash);
    }

    @Override
    public String getRole() {
        return "MEMBER";
    }

    /** Override dari {@link User}: hanya Member yang bisa berstatus terverifikasi. */
    @Override
    public boolean isVerified() {
        return verified;
    }

    public String getVerifiedCategory() { return verifiedCategory; }
    public void setVerifiedCategory(String verifiedCategory) { this.verifiedCategory = verifiedCategory; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
