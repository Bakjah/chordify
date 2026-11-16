import api from './api.js'

export const verificationService = {
  // --- Member ---
  submit: (payload) => api.post('/verification', payload).then((r) => r.data),
  mine: () => api.get('/verification/mine').then((r) => r.data),

  // --- Admin ---
  adminList: (status) => api.get('/admin/verification', { params: { status } }).then((r) => r.data),
  adminReview: (id, decision) => api.put(`/admin/verification/${id}/review`, decision).then((r) => r.data),
}
