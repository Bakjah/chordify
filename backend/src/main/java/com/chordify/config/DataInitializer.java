package com.chordify.config;

import com.chordify.model.Admin;
import com.chordify.model.Member;
import com.chordify.model.User;
import com.chordify.repository.UserRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Membuat akun awal supaya aplikasi langsung bisa dicoba: satu admin utama dan
 * beberapa member contoh.
 *
 * <p>Setiap akun hanya dibuat kalau emailnya belum terdaftar, jadi seeder aman
 * dijalankan berulang kali tanpa bikin duplikat.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    /**
     * Satu akun contoh yang akan dibuat.
     *
     * @param verification status verifikasi seperti di tabel admin: {@code null} belum
     *     mengajukan, {@code "PENDING"} menunggu persetujuan, {@code "VERIFIED"} sudah punya badge
     */
    private record SeedAccount(String username, String email, boolean admin, String verification) {}

    /** Akun contoh, sama persis dengan tabel pengguna di halaman admin. */
    private static final List<SeedAccount> SEED_ACCOUNTS = List.of(
            new SeedAccount("bagja", "bagja@mail.com", true, null),
            new SeedAccount("nadya", "nadya@mail.com", false, null),
            new SeedAccount("dimas", "dimas@mail.com", false, "PENDING"),
            new SeedAccount("noahofficial", "team@noah.id", false, "VERIFIED"),
            new SeedAccount("guitarist", "user@mail.com", false, null));

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final boolean seedEnabled;
    private final String adminEmail;
    private final String adminUsername;
    private final String adminPassword;
    private final String memberPassword;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.seed.enabled:true}") boolean seedEnabled,
                           @Value("${app.admin.email}") String adminEmail,
                           @Value("${app.admin.username}") String adminUsername,
                           @Value("${app.admin.password}") String adminPassword,
                           @Value("${app.seed.password}") String memberPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.seedEnabled = seedEnabled;
        this.adminEmail = adminEmail;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.memberPassword = memberPassword;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled) {
            log.info("Seeder akun dimatikan (app.seed.enabled=false).");
            return;
        }
        seedAdmin();
        seedSampleAccounts();
    }

    /** Akun admin utama. Passwordnya berdiri sendiri karena dipakai masuk ke dashboard. */
    private void seedAdmin() {
        if (userRepository.existsByEmailIgnoreCase(adminEmail)) {
            return;
        }
        Admin admin = new Admin(adminUsername, adminEmail, passwordEncoder.encode(adminPassword));
        userRepository.save(admin);
        log.info("Akun admin awal dibuat: {} — segera ganti passwordnya.", adminEmail);
    }

    /** Akun contoh. Semuanya memakai password yang sama. */
    private void seedSampleAccounts() {
        for (SeedAccount seed : SEED_ACCOUNTS) {
            if (userRepository.existsByEmailIgnoreCase(seed.email())) {
                continue;
            }
            User account = buildAccount(seed);
            userRepository.save(account);
            log.info("Akun {} dibuat: {} ({})", account.getRole(), seed.email(), seed.username());
        }
    }

    /**
     * Mengubah data seed menjadi objek user sesuai perannya.
     *
     * <p>Status verifikasi hanya ada di {@link Member}; admin memakai bawaan {@link User}.
     */
    private User buildAccount(SeedAccount seed) {
        String passwordHash = passwordEncoder.encode(memberPassword);
        if (seed.admin()) {
            return new Admin(seed.username(), seed.email(), passwordHash);
        }
        Member member = new Member(seed.username(), seed.email(), passwordHash);
        member.setVerified("VERIFIED".equals(seed.verification()));
        member.setVerifiedCategory(seed.verification());
        return member;
    }
}
