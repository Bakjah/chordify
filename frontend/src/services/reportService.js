import api from './api.js'

// Alasan laporan yang bisa dipilih member. Nilainya sama dengan nama enum
// ReportCategory di backend supaya tidak perlu kamus tambahan.
export const REPORT_CATEGORIES = [
  { value: 'INCORRECT_CHORDS', label: 'Incorrect Chords' },
  { value: 'DUPLICATE_SONG', label: 'Duplicate Song' },
  { value: 'INCORRECT_LYRICS', label: 'Incorrect Lyrics' },
  { value: 'SPAM_CONTENT', label: 'Spam Content' },
  { value: 'INCORRECT_INFO', label: 'Incorrect Info' },
  { value: 'COPYRIGHT_ISSUE', label: 'Copyright Issue' },
  { value: 'OTHER', label: 'Other' },
]

export const reportService = {
  // --- Member ---
  submit: (payload) => api.post('/reports', payload).then((r) => r.data),
  mine: () => api.get('/reports/mine').then((r) => r.data),

  // --- Admin ---
  adminList: (status) => api.get('/admin/reports', { params: { status } }).then((r) => r.data),
  adminReview: (id, decision) => api.put(`/admin/reports/${id}/review`, decision).then((r) => r.data),
}
