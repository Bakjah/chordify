package com.chordify.controller;

import com.chordify.dto.NotificationResponse;
import com.chordify.service.NotificationService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint notifikasi member.
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /** Notifikasi milik member yang sedang login. */
    @GetMapping
    public List<NotificationResponse> list(@RequestParam(defaultValue = "false") boolean unread,
                                           Authentication authentication) {
        return notificationService.list(userId(authentication), unread);
    }

    /** Jumlah notifikasi yang belum dibaca. */
    @GetMapping("/unread-count")
    public long unreadCount(Authentication authentication) {
        return notificationService.countUnread(userId(authentication));
    }

    /** Menandai satu notifikasi sudah dibaca. */
    @PutMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAsRead(@PathVariable Long id, Authentication authentication) {
        notificationService.markAsRead(userId(authentication), id);
    }

    /** Menandai semua notifikasi sudah dibaca. */
    @PutMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(userId(authentication));
    }

    /** Id user dari token yang dipakai; null kalau request tanpa login. */
    private Long userId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Long id)) {
            return null;
        }
        return id;
    }
}
