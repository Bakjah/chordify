package com.chordify.repository;

import com.chordify.model.SongHistory;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongHistoryRepository extends JpaRepository<SongHistory, Long> {

    /** Riwayat seorang member, yang terakhir dilihat paling atas. */
    List<SongHistory> findByUserIdOrderByViewedAtDesc(Long userId, Pageable pageable);

    /** Riwayat untuk satu pasang member-lagu. */
    Optional<SongHistory> findByUserIdAndSongId(Long userId, Long songId);

    /** Jumlah lagu yang pernah dilihat member. */
    long countByUserId(Long userId);
}
