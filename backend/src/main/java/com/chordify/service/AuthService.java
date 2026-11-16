package com.chordify.service;

import com.chordify.dto.AuthResponse;
import com.chordify.dto.LoginRequest;
import com.chordify.dto.RegisterRequest;
import com.chordify.dto.UserResponse;
import com.chordify.exception.ApiException;
import com.chordify.model.Member;
import com.chordify.model.User;
import com.chordify.repository.UserRepository;
import com.chordify.security.TokenService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Layanan autentikasi: registrasi, login, logout, dan sesi berjalan.
 *
 * <p>Validasi memakai anotasi pada DTO, tapi dijalankan juga di level service lewat
 * {@link Validator} — jadi service tetap aman dipanggil dari mana saja, bukan cuma
 * lewat controller.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final Validator validator;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       TokenService tokenService, Validator validator) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.validator = validator;
    }

    /** Masuk memakai email atau username. */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        ensureValid(req);
        String identifier = req.identifier().trim();
        User user = userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase(identifier, identifier)
                .filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Email/username atau password salah"));

        if (!user.canLogin()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Akun dinonaktifkan");
        }
        return new AuthResponse(tokenService.issue(user), UserResponse.from(user));
    }

    /** Overloading: bentuk ringkas dari {@link #login(LoginRequest)}. */
    @Transactional(readOnly = true)
    public AuthResponse login(String identifier, String password) {
        return login(new LoginRequest(identifier, password));
    }

    /** Registrasi selalu membuat Member. Admin hanya dibuat lewat seeder. */
    @Transactional
    public AuthResponse register(RegisterRequest req) {
        ensureValid(req);
        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "Email sudah terdaftar");
        }
        if (userRepository.existsByUsernameIgnoreCase(req.username())) {
            throw new ApiException(HttpStatus.CONFLICT, "Username sudah dipakai");
        }
        Member member = new Member(
                req.username().trim(),
                req.email().trim().toLowerCase(),
                passwordEncoder.encode(req.password()));
        userRepository.save(member);
        return new AuthResponse(tokenService.issue(member), UserResponse.from(member));
    }

    /** Overloading: bentuk ringkas dari {@link #register(RegisterRequest)}. */
    @Transactional
    public AuthResponse register(String username, String email, String password) {
        return register(new RegisterRequest(username, email, password));
    }

    /**
     * Logout: token yang dipakai dicabut sehingga server tidak menerimanya lagi.
     * Aman dipanggil berkali-kali — logout yang kedua tidak-error.
     */
    public void logout(String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        tokenService.revoke(token);
    }

    @Transactional(readOnly = true)
    public UserResponse me(Long userId) {
        return userRepository.findById(userId)
                .map(UserResponse::from)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Sesi tidak valid"));
    }

    /** Menjalankan aturan validasi DTO di level service. */
    private void ensureValid(LoginRequest req) {
        if (req == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Data login wajib diisi");
        }
        rejectViolations(validator.validate(req));
    }

    private void ensureValid(RegisterRequest req) {
        if (req == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Data registrasi wajib diisi");
        }
        rejectViolations(validator.validate(req));
    }

    private void rejectViolations(Set<? extends ConstraintViolation<?>> violations) {
        if (violations.isEmpty()) {
            return;
        }
        String message = violations.stream()
                .map(ConstraintViolation::getMessage)
                .sorted()
                .collect(Collectors.joining("; "));
        throw new ApiException(HttpStatus.BAD_REQUEST, message);
    }
}
