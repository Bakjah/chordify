package com.chordify.model;

/** Status pengajuan Verified User. */
public enum VerificationStatus {

    /** Menunggu ditinjau admin. */
    PENDING,

    /** Disetujui — member dapat badge terverifikasi. */
    APPROVED,

    /** Ditolak. */
    REJECTED
}
