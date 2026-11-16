package com.chordify.model;

/**
 * Statusmoderate lagu di dashboard admin.
 *
 * <p>Lagu kontribusi member bisa disetujui, ditolak, atau masih menunggu review.
 */
public enum SongStatus {

    /** Tampil di library publik. */
    PUBLISHED,

    /** Menunggu peninjauan admin. */
    PENDING,

    /** Ditolak admin. */
    REJECTED
}
