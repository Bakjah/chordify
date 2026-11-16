package com.chordify.dto;

import java.util.List;

/**
 * Ringkasan angka untuk dashboard admin.
 *
 * <p>Semua angka dihitung dari database, jadi tidak ada angka dummy yang
 * bisa berbeda dengan isi platform.
 */
public record AdminStatsResponse(
        long totalUsers,
        long totalSongs,
        long publishedSongs,
        long pendingSongs,
        long openReports,
        long pendingVerifications,
        long verifiedUsers,
        List<String> recentActivity) {
}
