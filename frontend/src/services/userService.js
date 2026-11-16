import api from './api.js'

// Profil publik seorang kontributor.
export const userService = {
  // username tanpa tanda "@".
  profile: (username) =>
    api.get(`/users/${encodeURIComponent(username)}/profile`).then((r) => r.data),
}
