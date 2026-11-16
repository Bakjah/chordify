package com.chordify.dto;

import com.chordify.model.User;
import java.time.LocalDateTime;

/**
 * Baris tabel "Manage Users" untuk konsol admin.
 */
public record AdminUserResponse(
        Long id,
        String username,
        String email,
        String role,
        String verification,
        String verifiedCategory,
        LocalDateTime joined,
        String status) {

    /**
     * Status verifikasi untuk ditampilkan di tabel.
     *
     * <p>Admin tidak pernah punya status verifikasi, jadi nilainya selalu NONE.
     *
     * @param username      nama akun
     * @param email         email akun
     * @param role          peran akun, "ADMIN" atau "MEMBER"
     * @param verified      apakah sudah diverifikasi
     * @param category      kategori verifikasi kalau ada
     * @param pendingRequest apakah masih punya pengajuan yang menunggu
     * @param joined        kapan akun dibuat
     * @param active        apakah akun masih aktif
     */
    public static AdminUserResponse of(User user,
                                       boolean verified,
                                       String category,
                                       boolean pendingRequest,
                                       LocalDateTime joined,
                                       boolean active) {
        String verification = verified ? "VERIFIED" : (pendingRequest ? "PENDING" : "NONE");
        return new AdminUserResponse(
                user.getId(),
                "@" + user.getUsername(),
                user.getEmail(),
                user.getRole(),
                verification,
                category,
                joined,
                active ? "ACTIVE" : "INACTIVE");
    }
}
