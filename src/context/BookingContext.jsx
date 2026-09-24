import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  apiFetchBookings,
  apiCreateBooking,
  apiUpdateBookingStatus,
  apiCancelBooking,
  checkRoomOverlap,
} from '../services/bookingApi'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch bookings on mount
  const loadBookings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiFetchBookings()
      setBookings(data)
    } catch (err) {
      console.error('Failed to load bookings:', err)
      setError(err.message || 'Unable to load reservations. Please check network connection.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  // Create new reservation
  const addBooking = async (bookingData) => {
    const created = await apiCreateBooking(bookingData)
    setBookings((prev) => [created, ...prev])
    return created
  }

  // Update status (e.g. Checked-In, Checked-Out, Cancelled)
  const updateStatus = async (id, newStatus) => {
    const updated = await apiUpdateBookingStatus(id, newStatus)
    setBookings((prev) => prev.map((b) => (String(b.id) === String(id) ? updated : b)))
    return updated
  }

  // Cancel reservation
  const cancel = async (id) => {
    const updated = await apiCancelBooking(id)
    setBookings((prev) => prev.map((b) => (String(b.id) === String(id) ? updated : b)))
    return updated
  }

  // Check if a specific room has overlapping bookings
  const checkConflict = (roomId, checkIn, checkOut, excludeBookingId = null) => {
    return checkRoomOverlap(bookings, roomId, checkIn, checkOut, excludeBookingId)
  }

  const value = {
    bookings,
    isLoading,
    error,
    loadBookings,
    addBooking,
    updateStatus,
    cancel,
    checkConflict,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBookings() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider')
  }
  return context
}
