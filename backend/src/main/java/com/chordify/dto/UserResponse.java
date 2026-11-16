package com.chordify.dto;

import com.chordify.model.User;

public record UserResponse(Long id, String username, String email, String role, boolean verified) {

    /**
     * Status verifikasi diambil lewat {@link User#isVerified()}, jadi pemanggil tidak
     * perlu tahu subclass mana yang dipakai (polymorfisme).
     */
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.isVerified());
    }
}