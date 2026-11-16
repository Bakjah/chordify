package com.chordify.repository;

import com.chordify.model.Favorite;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    /** Semua favorit seorang member, yang terbaru di atas. */
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);

    /** Favorit tertentu milik seorang member. */
    Optional<Favorite> findByUserIdAndSongId(Long userId, Long songId);

    /** Apakah member sudah menandai lagu ini sebagai favorit. */
    boolean existsByUserIdAndSongId(Long userId, Long songId);

    /** Jumlah favorit seorang member. */
    long countByUserId(Long userId);
}
