package com.chordify.repository;

import com.chordify.model.Notification;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /** Semua notifikasi seorang pengguna, yang terbaru di atas. */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /** Notifikasi yang belum dibaca seorang pengguna. */
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(Long userId);

    /** Notifikasi tertentu milik seorang pengguna. */
    Optional<Notification> findByIdAndUserId(Long id, Long userId);

    /** Jumlah notifikasi yang belum dibaca. */
    long countByUserIdAndReadFalse(Long userId);
}
