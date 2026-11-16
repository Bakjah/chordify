package com.chordify.controller;

import com.chordify.dto.AuthResponse;
import com.chordify.dto.LoginRequest;
import com.chordify.dto.RegisterRequest;
import com.chordify.dto.UserResponse;
import com.chordify.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoint autentikasi.
 *
 * <ul>
 *   <li>{@code POST /api/auth/register} — daftar akun baru (Member)</li>
 *   <li>{@code POST /api/auth/login} — tukar kredensial dengan token sesi</li>
 *   <li>{@code POST /api/auth/logout} — cabut token sesi yang sedang dipakai</li>
 *   <li>{@code GET  /api/auth/me} — profil user dari token yang dipakai</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String BEARER_PREFIX = "Bearer ";

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    /**
     * Logout. Token yang dipakai dicabut sehingga request berikutnya dengan token
     * sama akan ditolak dengan 401.
     */
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        authService.logout(bearerToken(authorization));
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        return authService.me((Long) authentication.getPrincipal());
    }

    /** Mengambil bagian token dari header "Authorization: Bearer <token>". */
    private String bearerToken(String authorization) {
        if (authorization == null || !authorization.startsWith(BEARER_PREFIX)) {
            return null;
        }
        return authorization.substring(BEARER_PREFIX.length()).trim();
    }
}