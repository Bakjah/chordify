import api from './api.js'

// Lagu-lagu yang disumbangkan member yang sedang login.
export const contributionService = {
  // params: { page, size }
  mine: (params) => api.get('/contributions', { params }).then((r) => r.data),
}
