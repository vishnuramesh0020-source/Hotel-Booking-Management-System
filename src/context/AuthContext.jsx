import { createContext, useContext, useState } from 'react'
import {
  initAuthStorage,
  getActiveUser,
  setActiveUser,
  clearActiveUser,
  authenticateUser,
  registerUser as storageRegisterUser,
  resetPassword as storageResetPassword,
} from '../services/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    initAuthStorage()
    return getActiveUser()
  })
  const [isLoading] = useState(false)

  /**
   * Log in user with credentials
   */
  const login = async (email, password) => {
    // Artificial small delay to simulate network latency for smoother UX
    await new Promise(resolve => setTimeout(resolve, 350))
    const authUser = authenticateUser({ email, password })
    setActiveUser(authUser)
    setUser(authUser)
    return authUser
  }

  /**
   * Register a new user
   */
  const register = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 350))
    const newUser = storageRegisterUser(userData)
    return newUser
  }

  /**
   * Log out currently active user
   */
  const logout = () => {
    clearActiveUser()
    setUser(null)
  }

  /**
   * Reset user password
   */
  const resetUserPassword = async (email, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 350))
    return storageResetPassword({ email, newPassword })
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
    resetUserPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
