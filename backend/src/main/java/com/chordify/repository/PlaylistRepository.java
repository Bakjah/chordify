package com.chordify.repository;

import com.chordify.model.Playlist;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    /** Semua playlist seorang member, yang terbaru di atas. */
    List<Playlist> findByUserIdOrderByCreatedAtDesc(Long userId);

    /** Playlist milik member tertentu — dipakai agar tidak bisa diakses orang lain. */
    Optional<Playlist> findByIdAndUserId(Long id, Long userId);
}
