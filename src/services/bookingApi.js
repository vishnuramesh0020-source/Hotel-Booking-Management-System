import axios from 'axios'

const API_BASE_URL = 'https://dummyjson.com/carts'
const BOOKINGS_STORAGE_KEY = 'hbms_bookings'

// Initial seed reservations for live demonstration
const INITIAL_BOOKINGS = [
  {
    id: 'HTL-BK-2026-9021',
    guestId: '1',
    guestName: 'Emily Johnson',
    guestEmail: 'emily.johnson@x.dummyjson.com',
    guestPhone: '+81 965-431-3024',
    guestIdProof: '977-175',
    roomId: '1',
    roomNumber: '101',
    roomType: 'Deluxe King Suite',
    roomImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
    pricePerNight: 8500,
    checkIn: '2026-09-24',
    checkOut: '2026-09-28',
    nights: 4,
    subtotal: 34000,
    tax: 4080,
    totalAmount: 38080,
    status: 'Checked-In',
    specialRequests: 'High floor, complimentary morning espresso',
    createdAt: '2026-09-20T10:30:00.000Z',
  },
  {
    id: 'HTL-BK-2026-9022',
    guestId: '2',
    guestName: 'Michael Williams',
    guestEmail: 'michael.williams@x.dummyjson.com',
    guestPhone: '+49 258-627-6644',
    guestIdProof: '912-602',
    roomId: '3',
    roomNumber: '103',
    roomType: 'Executive Balcony Suite',
    roomImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    pricePerNight: 14500,
    checkIn: '2026-09-25',
    checkOut: '2026-09-27',
    nights: 2,
    subtotal: 29000,
    tax: 3480,
    totalAmount: 32480,
    status: 'Confirmed',
    specialRequests: 'Late arrival around 8:00 PM',
    createdAt: '2026-09-21T14:15:00.000Z',
  },
  {
    id: 'HTL-BK-2026-9023',
    guestId: '3',
    guestName: 'Sophia Brown',
    guestEmail: 'sophia.brown@x.dummyjson.com',
    guestPhone: '+81 210-652-2785',
    guestIdProof: '963-113',
    roomId: '4',
    roomNumber: '201',
    roomType: 'Ocean Penthouse',
    roomImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    pricePerNight: 24500,
    checkIn: '2026-09-22',
    checkOut: '2026-09-24',
    nights: 2,
    subtotal: 49000,
    tax: 5880,
    totalAmount: 54880,
    status: 'Checked-Out',
    specialRequests: 'Airport transfer required',
    createdAt: '2026-09-19T09:00:00.000Z',
  },
  {
    id: 'HTL-BK-2026-9024',
    guestId: '4',
    guestName: 'James Miller',
    guestEmail: 'james.miller@x.dummyjson.com',
    guestPhone: '+1 202-555-0143',
    guestIdProof: 'IDP-4821',
    roomId: '5',
    roomNumber: '202',
    roomType: 'Presidential Royal Suite',
    roomImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
    pricePerNight: 38000,
    checkIn: '2026-09-28',
    checkOut: '2026-10-02',
    nights: 4,
    subtotal: 152000,
    tax: 18240,
    totalAmount: 170240,
    status: 'Confirmed',
    specialRequests: 'Private butler service and floral arrangement',
    createdAt: '2026-09-22T16:45:00.000Z',
  },
]

/**
 * Initialize storage with default reservations
 */
function initBookingsStorage() {
  try {
    const existing = localStorage.getItem(BOOKINGS_STORAGE_KEY)
    if (!existing) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS))
    }
  } catch (err) {
    console.error('Failed to init bookings storage:', err)
  }
}

/**
 * Overlap detection algorithm to prevent double booking.
 * Two intervals [A_start, A_end] and [B_start, B_end] collide if:
 * A_start < B_end && A_end > B_start
 */
export function checkRoomOverlap(bookings, roomId, checkIn, checkOut, excludeBookingId = null) {
  if (!roomId || !checkIn || !checkOut) return null

  const targetStart = new Date(checkIn).getTime()
  const targetEnd = new Date(checkOut).getTime()

  if (isNaN(targetStart) || isNaN(targetEnd) || targetEnd <= targetStart) {
    return null
  }

  return bookings.find((b) => {
    // Ignore current booking if editing
    if (excludeBookingId && String(b.id) === String(excludeBookingId)) return false
    // Cancelled and Checked-Out bookings do not occupy the room
    if (b.status === 'Cancelled' || b.status === 'Checked-Out') return false
    // Match room by ID or Room Number
    if (String(b.roomId) !== String(roomId) && String(b.roomNumber) !== String(roomId)) return false

    const bStart = new Date(b.checkIn).getTime()
    const bEnd = new Date(b.checkOut).getTime()

    // Interval overlap condition
    return targetStart < bEnd && targetEnd > bStart
  })
}

/**
 * Calculate financial totals (Nights, Subtotal, 12% GST, Grand Total in ₹)
 */
export function calculateBookingFinancials(pricePerNight, checkIn, checkOut) {
  const price = Number(pricePerNight) || 0
  const start = new Date(checkIn)
  const end = new Date(checkOut)

  let nights = 1
  if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
    const diffTime = Math.abs(end - start)
    nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  const subtotal = price * nights
  const tax = Math.round(subtotal * 0.12) // 12% GST
  const totalAmount = subtotal + tax

  return {
    nights,
    subtotal,
    tax,
    totalAmount,
  }
}

/**
 * Fetch all bookings (calls DummyJSON Carts API via Axios + syncs with localStorage)
 */
export async function apiFetchBookings() {
  initBookingsStorage()

  try {
    // Live Axios communication to DummyJSON
    await axios.get(`${API_BASE_URL}?limit=5`, { timeout: 8000 })
  } catch (err) {
    console.warn('[Third-Party API] Cart API network sync:', err.message)
  }

  const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : INITIAL_BOOKINGS
}

/**
 * Create a new booking with double booking check
 */
export async function apiCreateBooking(bookingData) {
  initBookingsStorage()
  const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY)
  const bookings = stored ? JSON.parse(stored) : INITIAL_BOOKINGS

  // Check double-booking constraint
  const conflict = checkRoomOverlap(
    bookings,
    bookingData.roomId,
    bookingData.checkIn,
    bookingData.checkOut
  )

  if (conflict) {
    throw new Error(
      `Room #${bookingData.roomNumber} is already booked from ${conflict.checkIn} to ${conflict.checkOut} for guest ${conflict.guestName}.`
    )
  }

  // Live Axios POST to DummyJSON
  try {
    await axios.post(
      `${API_BASE_URL}/add`,
      {
        userId: 1,
        products: [{ id: 1, quantity: bookingData.nights || 1 }],
      },
      { timeout: 8000 }
    )
  } catch (err) {
    console.warn('[Third-Party API] Cart POST simulation:', err.message)
  }

  // Generate unique booking reference
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  const newId = `HTL-BK-2026-${randomSuffix}`

  const financials = calculateBookingFinancials(
    bookingData.pricePerNight,
    bookingData.checkIn,
    bookingData.checkOut
  )

  const newBooking = {
    ...bookingData,
    id: newId,
    apiSource: 'DummyJSON POST /carts/add',
    ...financials,
    status: bookingData.status || 'Confirmed',
    createdAt: new Date().toISOString(),
  }

  const updatedBookings = [newBooking, ...bookings]
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookings))
  return newBooking
}

/**
 * Update an existing booking's status
 */
export async function apiUpdateBookingStatus(id, newStatus) {
  initBookingsStorage()
  const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY)
  const bookings = stored ? JSON.parse(stored) : INITIAL_BOOKINGS

  const index = bookings.findIndex((b) => String(b.id) === String(id))
  if (index === -1) {
    throw new Error(`Booking with reference "${id}" was not found.`)
  }

  // Live Axios PUT to DummyJSON
  try {
    await axios.put(`${API_BASE_URL}/1`, { merge: true }, { timeout: 8000 })
  } catch (err) {
    console.warn('[Third-Party API] Cart PUT simulation:', err.message)
  }

  bookings[index] = {
    ...bookings[index],
    status: newStatus,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
  return bookings[index]
}

/**
 * Cancel a booking
 */
export async function apiCancelBooking(id) {
  return apiUpdateBookingStatus(id, 'Cancelled')
}
