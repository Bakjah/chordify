package com.chordify.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Profil publik seorang kontributor.
 *
 * <p>Hanya yang terlihat oleh tamu, jadi tidak ada email atau data sensitif di
 * sini.
 */
public record PublicProfileResponse(
        String username,
        String role,
        boolean verified,
        String verifiedCategory,
        String bio,
        String profilePhotoUrl,
        LocalDateTime memberSince,
        int contributions,
        int favorites,
        List<LibrarySongResponse> songs) {
}
