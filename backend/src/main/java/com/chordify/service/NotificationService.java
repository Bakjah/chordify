package com.chordify.service;

import com.chordify.dto.NotificationResponse;
import com.chordify.exception.ApiException;
import com.chordify.model.Notification;
import com.chordify.model.User;
import com.chordify.repository.NotificationRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Notifikasi pengguna.
 *
 * <p>Notifikasi dibuat oleh sistem, bukan oleh pengguna sendiri, jadi tidak ada
 * endpoint untuk membuat notifikasi dari sisi member.
 */
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /** Notifikasi milik seorang pengguna, yang terbaru di atas. */
    @Transactional(readOnly = true)
    public List<NotificationResponse> list(Long userId, boolean unreadOnly) {
        List<Notification> notifications = unreadOnly
                ? notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                : notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream().map(NotificationResponse::from).toList();
    }

    /** Jumlah notifikasi yang belum dibaca. */
    @Transactional(readOnly = true)
    public long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    /** Menandai satu notifikasi sudah dibaca. */
    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Notifikasi tidak ditemukan."));
        notification.markAsRead();
    }

    /** Menandai semua notifikasi sudah dibaca. */
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                .forEach(notification -> notification.markAsRead());
    }

    /** Membuat notifikasi baru untuk seorang pengguna. */
    @Transactional
    public void notify(User user, String title, String body) {
        notificationRepository.save(new Notification(user, title, body));
    }
}
