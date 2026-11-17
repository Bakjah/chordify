package com.chordify.contract;

import com.chordify.dto.StoredMedia;

/**
 * Kontrak penyimpanan berkas media (audio untuk playback).
 *
 * <p>Kontrak ini memisahkan kebutuhan aplikasi dari cara berkas disimpan.
 * Implementasi {@link MediaStorage} yang dipakai saat ini menyimpan berkas di
 * disk, tetapi pemanggil hanya bergantung pada antarmuka ini.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-6] Interface — kontrak {@code MediaStorage}; service cukup
 *       bergantung pada antarmuka ini, bukan pada implementasi disk-nya.</li>
 * </ul>
 */
public interface MediaStorage {

    /**
     * Menyimpan satu berkas media.
     *
     * @param namespace folder tujuan, misalnya {@code songs}
     * @param filename nama berkas asli dari pengguna
     * @param contentType tipe MIME berkas, misalnya {@code audio/mpeg}
     * @param content isi berkas
     * @return berkas yang tersimpan beserta URL publiknya
     */
    StoredMedia store(String namespace, String filename, String contentType, byte[] content);

    /**
     * Menghapus berkas yang sudah tersimpan. Berkas yang tidak ada diabaikan.
     *
     * @param url URL publik berkas, misalnya {@code /uploads/songs/abc.mp3}
     */
    void delete(String url);
}
