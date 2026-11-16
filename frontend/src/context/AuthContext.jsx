import { createContext, useCallback, useMemo, useState } from 'react'
import { authService } from '../services/authService.js'
import { storage } from '../utils/storage.js'
import { ROLES } from '../constants/roles.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser())

  const login = useCallback(async ({ identifier, password, remember }) => {
    const data = await authService.login({ identifier, password })
    storage.save({ token: data.token, user: data.user }, remember)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload)
    storage.save({ token: data.token, user: data.user }, true)
    setUser(data.user)
    return data.user
  }, [])

  // Logout tetap membersihkan sesi lokal walau server tidak bisa dihubungi.
  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Token mungkin sudah kedaluwarsa — sesi lokal tetap dibersihkan.
    } finally {
      storage.clear()
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === ROLES.ADMIN,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
