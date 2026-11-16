package com.chordify.repository;

import com.chordify.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCaseOrUsernameIgnoreCase(String email, String username);

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    /** Semua akun, yang terbaru dibuat di atas — dipakai tabel "Manage Users" admin. */
    List<User> findAllByOrderByCreatedAtDesc();

    /** Jumlah member yang sudah mendapat badge verified. */
    @Query("select count(m) from com.chordify.model.Member m where m.verified = true")
    long countVerifiedMembers();
}
