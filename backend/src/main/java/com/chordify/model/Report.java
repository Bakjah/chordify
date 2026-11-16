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
 * Laporan member terhadap sebuah lagu.
 *
 * <p>Laporan bersifat penanda: member hanya submitting, keputusan ada di tangan
 * admin. Relasi ke lagu memakai {@code Song} karena itulah satu-satunya
 * {@link com.chordify.contract.Reportable} yang ada saat ini.
 */
@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Member yang mengirim laporan. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    /** Lagu yang dilaporkan. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    /** Alasan laporan. */
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    private ReportCategory category;

    /** Penjelasan tambahan dari member. */
    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ReportStatus status = ReportStatus.OPEN;

    /** Admin yang menangani laporan. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handled_by")
    private User handledBy;

    /** Catatan admin. */
    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    protected Report() {
    }

    /** Laporan baru dari member terhadap sebuah lagu. */
    public Report(User reporter, Song song, ReportCategory category, String details) {
        this.reporter = reporter;
        this.song = song;
        this.category = category;
        this.details = details;
        this.status = ReportStatus.OPEN;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    /** Admin menandai laporan sebagai sudah ditinjau. */
    public void review(User admin, String note, ReportStatus newStatus) {
        this.handledBy = admin;
        this.adminNote = note;
        this.status = newStatus;
        if (newStatus == ReportStatus.RESOLVED || newStatus == ReportStatus.DISMISSED) {
            this.resolvedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public User getReporter() { return reporter; }
    public Song getSong() { return song; }
    public ReportCategory getCategory() { return category; }
    public String getDetails() { return details; }
    public ReportStatus getStatus() { return status; }
    public User getHandledBy() { return handledBy; }
    public String getAdminNote() { return adminNote; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
}
