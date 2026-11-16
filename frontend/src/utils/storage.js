// "Remember me" -> localStorage (bertahan), tanpa itu -> sessionStorage (hilang saat tab ditutup).
const TOKEN_KEY = 'chordify.token'
const USER_KEY = 'chordify.user'

const read = (key) => {
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key)
  } catch {
    return null
  }
}

export const storage = {
  save({ token, user }, remember) {
    this.clear()
    const store = remember ? localStorage : sessionStorage
    store.setItem(TOKEN_KEY, token)
    store.setItem(USER_KEY, JSON.stringify(user))
  },
  getToken() {
    return read(TOKEN_KEY)
  },
  getUser() {
    const raw = read(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  clear() {
    for (const store of [localStorage, sessionStorage]) {
      store.removeItem(TOKEN_KEY)
      store.removeItem(USER_KEY)
    }
  },
}
