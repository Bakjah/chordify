package com.chordify.contract;

import com.chordify.model.Song;

/**
 * Isi dari sebuah daftar lagu — dipakai oleh baris playlist maupun setlist.
 *
 * <p>Kedua daftar memang berbeda jenis di database, tapi perlakuannya sama:
 * menyimpan satu lagu pada urutan tertentu. Dengan kontrak ini, service cukup
 * menulis satu cara untuk membaca keduanya (polymorfisme).
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-6] Interface — kontrak {@code CollectionEntry}, diimplementasikan
 *       oleh {@code SongSlot} sehingga baris playlist dan baris setlist bisa
 *       dibaca dengan satu cara yang sama.</li>
 * </ul>
 */
public interface CollectionEntry {

    /** Lagu yang ditambahkan ke daftar. */
    Song getSong();

    /** Urutan lagu di dalam daftar, mulai dari 0. */
    int getPosition();
}
