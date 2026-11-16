package com.chordify.security;

import com.chordify.model.User;
import io.jsonwebtoken.Claims;

/**
 * Kontrak pengelolaan token sesi.
 *
 * <p>Komponen lain (service, filter) hanya bergantung pada kontrak ini, bukan
 * pada JWT secara spesifik — sehingga implementasi token bisa ditukar tanpa
 * mengubah pemanggilnya (interface / abstraction).
 */
public interface TokenService {

    /** Membuat token baru untuk pengguna. */
    String issue(User user);

    /**
     * Memeriksa token.
     *
     * @return claims token kalau valid dan belum dicabut, {@code null} kalau tidak
     */
    Claims parse(String token);

    /** Mencabut token sehingga server tidak menerimanya lagi (dipakai saat logout). */
    void revoke(String token);

    /**
     * {@code true} kalau token dengan claims ini sudah dicabut lewat {@link #revoke(String)}.
     * Claims dipakai (bukan string token) supaya filter tidak perlu mem-parsing token dua kali.
     */
    boolean isRevoked(Claims claims);
}
