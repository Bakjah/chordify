package com.chordify.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email atau username wajib diisi") String identifier,
        @NotBlank(message = "Password wajib diisi") String password) {
}
