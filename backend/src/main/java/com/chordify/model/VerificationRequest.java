package com.chordify.model;

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
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * Pengajuan Verified User.
 *
 * <p>Member mengirim pengajuan dengan bukti; admin yang menyetujui atau
 * menolak. Saat disetujui, {@link Member#isVerified()} menjadi {@code true} dan
 * {@link Member#getVerifiedCategory()} terisi.
 */
@Entity
@Table(name = "verification_requests")
public class VerificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Member yang mengajukan. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User member;

    /** Kategori yang dimohon, misal {@code Verified Artist}. */
    @Column(name = "category", nullable = false, length = 30)
    private String category;

    /** Bukti write-up / tautan ke portofolio. */
    @Column(name = "proof", columnDefinition = "TEXT")
    private String proof;

    /** Tautan bukti tambahan (media sosial, YouTube, dsb). */
    @Column(name = "proof_url", length = 255)
    private String proofUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private VerificationStatus status = VerificationStatus.PENDING;

    /** Admin yang menilai pengajuan. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    /** Alasan penolakan atau catatan admin. */
    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    protected VerificationRequest() {
    }

    /** Pengajuan baru dari member. */
    public VerificationRequest(User member, String category, String proof, String proofUrl) {
        this.member = member;
        this.category = category;
        this.proof = proof;
        this.proofUrl = proofUrl;
        this.status = VerificationStatus.PENDING;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    /** Admin menyetujui pengajuan dan menandai member sebagai terverifikasi. */
    public void approve(User admin, String note) {
        applyDecision(admin, note, VerificationStatus.APPROVED);
        if (member instanceof Member) {
            Member memberAccount = (Member) member;
            memberAccount.setVerified(true);
            memberAccount.setVerifiedCategory(category);
        }
    }

    /** Admin menolak pengajuan. */
    public void reject(User admin, String note) {
        applyDecision(admin, note, VerificationStatus.REJECTED);
    }

    /** Admin menulis catatan tanpa mengubah status pengajuan. */
    public void annotate(User admin, String note) {
        this.reviewedBy = admin;
        this.adminNote = note;
    }

    private void applyDecision(User admin, String note, VerificationStatus newStatus) {
        this.reviewedBy = admin;
        this.adminNote = note;
        this.status = newStatus;
        this.reviewedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getMember() { return member; }
    public String getCategory() { return category; }
    public String getProof() { return proof; }
    public String getProofUrl() { return proofUrl; }
    public VerificationStatus getStatus() { return status; }
    public User getReviewedBy() { return reviewedBy; }
    public String getAdminNote() { return adminNote; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
}
