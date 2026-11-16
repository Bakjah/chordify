package com.chordify.model;

/** Status penanganan laporan oleh admin. */
public enum ReportStatus {

    /** Baru dikirim, belum ditinjau. */
    OPEN,

    /** Sudah ditinjau admin. */
    REVIEWED,

    /** Laporan terbukti benar dan sudah diperbaiki. */
    RESOLVED,

    /** Laporan tidak dilanjutkan. */
    DISMISSED
}
