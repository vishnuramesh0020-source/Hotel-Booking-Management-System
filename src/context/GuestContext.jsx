import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  apiFetchGuests,
  apiGetGuestById,
  apiCreateGuest,
  apiUpdateGuest,
  apiDeleteGuest,
} from '../services/guestApi'

const GuestContext = createContext(null)

export function GuestProvider({ children }) {
  const [guests, setGuests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch guests on mount
  const loadGuests = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiFetchGuests()
      setGuests(data)
    } catch (err) {
      console.error('Failed to load guests:', err)
      setError(err.message || 'Unable to connect to Guests API. Please verify network connection.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGuests()
  }, [loadGuests])

  // Create guest
  const addGuest = async (guestData) => {
    const created = await apiCreateGuest(guestData)
    setGuests((prev) => [created, ...prev])
    return created
  }

  // Update guest
  const editGuest = async (id, updatedData) => {
    const updated = await apiUpdateGuest(id, updatedData)
    setGuests((prev) => prev.map((g) => (String(g.id) === String(id) ? updated : g)))
    return updated
  }

  // Delete guest
  const removeGuest = async (id) => {
    await apiDeleteGuest(id)
    setGuests((prev) => prev.filter((g) => String(g.id) !== String(id)))
    return true
  }

  // Get single guest
  const getGuest = async (id) => {
    const found = guests.find((g) => String(g.id) === String(id))
    if (found) return found
    return apiGetGuestById(id)
  }

  const value = {
    guests,
    isLoading,
    error,
    loadGuests,
    addGuest,
    editGuest,
    removeGuest,
    getGuest,
  }

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>
}

export function useGuests() {
  const context = useContext(GuestContext)
  if (!context) {
    throw new Error('useGuests must be used within a GuestProvider')
  }
  return context
}
