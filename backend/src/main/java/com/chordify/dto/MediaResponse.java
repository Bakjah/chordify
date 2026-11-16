package com.chordify.dto;

/**
 * Bentuk media lagu yang dikirim ke frontend.
 *
 * @param url alamat berkas audio; null kalau lagu belum punya media
 * @param name nama berkas asli
 * @param type tipe MIME berkas
 * @param size ukuran berkas dalam byte
 */
public record MediaResponse(String url, String name, String type, long size) {

    /** Bentuk respons untuk media yang sudah tersimpan. */
    public static MediaResponse from(StoredMedia media) {
        return new MediaResponse(media.url(), media.name(), media.type(), media.size());
    }
}
