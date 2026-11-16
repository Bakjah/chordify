import api from './api.js'

// Notifikasi milik user yang sedang login.
export const notificationService = {
  // params: { unread } — unread=true hanya yang belum dibaca.
  list: (params) => api.get('/notifications', { params }).then((r) => r.data),
  // Jumlah notifikasi yang belum dibaca.
  unreadCount: () => api.get('/notifications/unread-count').then((r) => r.data),
  // Tandai satu notifikasi sudah dibaca.
  markAsRead: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
  // Tandai semua notifikasi sudah dibaca.
  markAllAsRead: () => api.put('/notifications/read-all').then((r) => r.data),
}
