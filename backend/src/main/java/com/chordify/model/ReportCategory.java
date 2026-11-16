package com.chordify.model;

/** Alasan member melaporkan sebuah lagu. */
public enum ReportCategory {

    /** Chord di dalam lirik tidak sesuai. */
    INCORRECT_CHORDS,

    /** Judul lagu sama dengan lagu yang sudah ada. */
    DUPLICATE_SONG,

    /** Lirik yang ditulis tidak benar. */
    INCORRECT_LYRICS,

    /** Konten sampah atau menyesatkan. */
    SPAM_CONTENT,

    /** Informasi lagu (artis, genre, kunci) tidak benar. */
    INCORRECT_INFO,

    /** Ada masalah hak cipta. */
    COPYRIGHT_ISSUE,

    /** Alasan lain di luar daftar di atas. */
    OTHER
}
