package com.chordify.security;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

/**
 * Daftar token yang sudah dicabut (logout).
 *
 * <p>JWT bersifat stateless: server tidak menyimpan sesi. Supaya logout benar-benar
 * mengakhiri sesi, id token yang dipakai dicatat di sini sampai waktu kedaluwarsa
 * tokennya sendiri. Daftar ini {@link Map} privat — akses hanya lewat method yang
 * disediakan (encapsulation).
 */
@Component
public class RevokedTokenStore {

    /** id token -> waktu kedaluwarsa token tersebut. */
    private final Map<String, Instant> revokedTokens = new ConcurrentHashMap<>();

    /** Mencatat token sebagai dicabut sampai waktu kedaluwarsa yang diberikan. */
    public void revoke(String tokenId, Instant expiresAt) {
        purgeExpired();
        revokedTokens.put(tokenId, expiresAt);
    }

    /** {@code true} kalau token dengan id ini sudah dicabut dan belum kedaluwarsa. */
    public boolean isRevoked(String tokenId) {
        Instant expiresAt = revokedTokens.get(tokenId);
        if (expiresAt == null) {
            return false;
        }
        if (expiresAt.isBefore(Instant.now())) {
            revokedTokens.remove(tokenId);
            return false;
        }
        return true;
    }

    /** Membuang entri yang sudah kedaluwarsa supaya daftar tidak tumbuh terus. */
    private void purgeExpired() {
        Instant now = Instant.now();
        revokedTokens.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
    }
}
