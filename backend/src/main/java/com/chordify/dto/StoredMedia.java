package com.chordify.dto;

/**
 * Berkas media yang sudah tersimpan di storage.
 *
 * @param url alamat publik berkas, dipakai frontend sebagai sumber audio
 * @param name nama berkas asli dari pengguna
 * @param type tipe MIME berkas
 * @param size ukuran berkas dalam byte
 */
public record StoredMedia(String url, String name, String type, long size) {
}
