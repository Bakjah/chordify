package com.chordify.repository;

import com.chordify.model.Setlist;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SetlistRepository extends JpaRepository<Setlist, Long> {

    /** Semua setlist seorang member, yang terbaru di atas. */
    List<Setlist> findByUserIdOrderByCreatedAtDesc(Long userId);

    /** Setlist milik member tertentu — dipakai agar tidak bisa diakses orang lain. */
    Optional<Setlist> findByIdAndUserId(Long id, Long userId);
}
