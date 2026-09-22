// Key constants for LocalStorage
export const USERS_STORAGE_KEY = 'hbms_users'
export const AUTH_USER_STORAGE_KEY = 'hbms_auth_user'

// Pre-seeded demo accounts for quick testing & evaluation
const INITIAL_DEMO_USERS = [
  {
    id: 'user-001',
    name: 'Sarah Jenkins',
    email: 'guest@hotel.com',
    password: 'Password123!',
    phone: '+1 (555) 234-5678',
    role: 'User',
    createdAt: new Date('2025-01-15T09:00:00Z').toISOString(),
  },
  {
    id: 'owner-002',
    name: 'Alexander Wright',
    email: 'admin@hotel.com',
    password: 'Admin123!',
    phone: '+1 (555) 876-5432',
    role: 'Hotel Owner',
    createdAt: new Date('2025-01-10T14:30:00Z').toISOString(),
  },
]

/**
 * Initialize storage with default demo users if not present
 */
export function initAuthStorage() {
  const existingUsers = localStorage.getItem(USERS_STORAGE_KEY)
  if (!existingUsers) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USERS))
  }
}

/**
 * Get all registered users from Local Storage
 */
export function getUsers() {
  initAuthStorage()
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (err) {
    console.error('Error reading users from localStorage:', err)
    return []
  }
}

/**
 * Find user by email (case-insensitive)
 */
export function findUserByEmail(email) {
  if (!email) return null
  const users = getUsers()
  return users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase()) || null
}

/**
 * Register a new user in Local Storage
 */
export function registerUser({ name, email, password, phone = '', role = 'Guest' }) {
  initAuthStorage()
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const existing = users.find(u => u.email.trim().toLowerCase() === normalizedEmail)
  if (existing) {
    throw new Error('An account with this email address already exists.')
  }

  const newUser = {
    id: 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    name: name.trim(),
    email: normalizedEmail,
    password: password, // In production this would be hashed on backend
    phone: phone.trim(),
    role: role || 'Guest',
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

  // Return safe user object (without password)
  const { password: _, ...safeUser } = newUser
  return safeUser
}

/**
 * Authenticate user credentials
 */
export function authenticateUser({ email, password }) {
  initAuthStorage()
  const normalizedEmail = email.trim().toLowerCase()
  const user = findUserByEmail(normalizedEmail)

  if (!user) {
    throw new Error('No account found with this email address.')
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please verify and try again.')
  }

  // Generate mock session token & safe payload
  const token = 'hbms_jwt_' + btoa(`${user.id}:${Date.now()}`)
  const { password: _, ...safeUser } = user

  return {
    ...safeUser,
    token,
    lastLoginAt: new Date().toISOString(),
  }
}

/**
 * Reset user password in Local Storage
 */
export function resetPassword({ email, newPassword }) {
  initAuthStorage()
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const userIndex = users.findIndex(u => u.email.trim().toLowerCase() === normalizedEmail)

  if (userIndex === -1) {
    throw new Error('No account found with this email address.')
  }

  users[userIndex].password = newPassword
  users[userIndex].updatedAt = new Date().toISOString()

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  return true
}

/**
 * Get currently active user from Local Storage
 */
export function getActiveUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.error('Error reading active session:', err)
    return null
  }
}

/**
 * Set currently active user session in Local Storage
 */
export function setActiveUser(user) {
  try {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
  } catch (err) {
    console.error('Error saving active session:', err)
  }
}

/**
 * Clear active session from Local Storage
 */
export function clearActiveUser() {
  try {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY)
  } catch (err) {
    console.error('Error clearing session:', err)
  }
}
