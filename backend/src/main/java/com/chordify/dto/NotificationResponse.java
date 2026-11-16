package com.chordify.dto;

import com.chordify.model.Notification;
import java.time.LocalDateTime;

/**
 * Bentuk notifikasi yang dikirim ke frontend.
 */
public record NotificationResponse(
        Long id,
        String title,
        String body,
        boolean unread,
        LocalDateTime createdAt) {

    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getBody(),
                !notification.isRead(),
                notification.getCreatedAt());
    }
}
