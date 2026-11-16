package com.chordify.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Username wajib diisi")
        @Size(min = 3, max = 30, message = "Username 3–30 karakter")
        @Pattern(regexp = "^[A-Za-z0-9_.]+$", message = "Username hanya huruf, angka, titik, dan underscore")
        String username,

        @NotBlank(message = "Email wajib diisi")
        @Email(message = "Format email tidak valid")
        String email,

        @NotBlank(message = "Password wajib diisi")
        @Size(min = 8, max = 72, message = "Password minimal 8 karakter")
        String password) {
}
