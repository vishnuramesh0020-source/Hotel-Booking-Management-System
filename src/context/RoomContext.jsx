import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  apiFetchRooms,
  apiGetRoomById,
  apiCreateRoom,
  apiUpdateRoom,
  apiDeleteRoom,
} from '../services/roomApi'

const RoomContext = createContext(null)

export function RoomProvider({ children }) {
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch rooms on mount
  const loadRooms = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiFetchRooms()
      setRooms(data)
    } catch (err) {
      console.error('Failed to load rooms:', err)
      setError(err.message || 'Unable to connect to rooms API. Please check your network.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRooms()
  }, [loadRooms])

  // Create room
  const addRoom = async (roomData) => {
    const created = await apiCreateRoom(roomData)
    setRooms((prev) => [created, ...prev])
    return created
  }

  // Update room
  const editRoom = async (id, updatedData) => {
    const updated = await apiUpdateRoom(id, updatedData)
    setRooms((prev) => prev.map((r) => (String(r.id) === String(id) ? updated : r)))
    return updated
  }

  // Delete room
  const removeRoom = async (id) => {
    await apiDeleteRoom(id)
    setRooms((prev) => prev.filter((r) => String(r.id) !== String(id)))
    return true
  }

  // Get single room
  const getRoom = async (id) => {
    // Check if in local state
    const found = rooms.find((r) => String(r.id) === String(id))
    if (found) return found
    return apiGetRoomById(id)
  }

  // Update room availability status directly (e.g. Occupied, Available)
  const updateRoomAvailability = async (roomId, availabilityStatus) => {
    const room = rooms.find(
      (r) => String(r.id) === String(roomId) || String(r.roomNumber) === String(roomId)
    )
    if (room) {
      return editRoom(room.id, { ...room, availabilityStatus })
    }
  }

  const value = {
    rooms,
    isLoading,
    error,
    loadRooms,
    addRoom,
    editRoom,
    updateRoomAvailability,
    removeRoom,
    getRoom,
  }

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}

export function useRooms() {
  const context = useContext(RoomContext)
  if (!context) {
    throw new Error('useRooms must be used within a RoomProvider')
  }
  return context
}
