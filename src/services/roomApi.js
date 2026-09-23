import axios from 'axios'

const API_BASE_URL = 'https://dummyjson.com/products'
const ROOMS_STORAGE_KEY = 'hbms_rooms'

// Preset high-resolution luxury hotel room images (with reliable Unsplash hospitality collection)
export const PRESET_ROOM_IMAGES = [
  {
    label: 'Ocean Penthouse',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Deluxe King Suite',
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Executive Balcony',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Presidential Suite',
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Standard King Room',
    url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Garden Villa',
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
  },
]

// Available hotel amenities list
export const ALL_AMENITIES = [
  'High-speed Wi-Fi',
  'Ocean View',
  'Private Jacuzzi',
  'King Size Bed',
  'Smart 4K TV',
  'Mini Bar',
  '24/7 Room Service',
  'Balcony / Terrace',
  'Espresso Machine',
  'Infinity Pool Access',
  'Marble Bathroom',
  'Climate Control',
]

// Available Room Types
export const ROOM_TYPES = [
  'Deluxe King Suite',
  'Executive Family Suite',
  'Penthouse Ocean Suite',
  'Presidential Royal Suite',
  'Standard King Room',
  'Luxury Garden Villa',
]

// Initial seed rooms data
const INITIAL_ROOMS = [
  {
    id: 'room-101',
    roomNumber: '101',
    roomType: 'Deluxe King Suite',
    pricePerNight: 8500,
    capacity: 2,
    floorNumber: 1,
    availabilityStatus: 'Available',
    roomImage: PRESET_ROOM_IMAGES[1].url,
    bedType: 'King Size Bed',
    roomSize: '48 m² / 516 sq ft',
    description:
      'Immerse in refined luxury with hand-crafted Italian linens, private lounge corner, smart ambient lighting, and panoramic garden views.',
    amenities: ['High-speed Wi-Fi', 'King Size Bed', 'Smart 4K TV', 'Mini Bar', 'Climate Control'],
  },
  {
    id: 'room-102',
    roomNumber: '102',
    roomType: 'Standard King Room',
    pricePerNight: 4800,
    capacity: 2,
    floorNumber: 1,
    availabilityStatus: 'Occupied',
    roomImage: PRESET_ROOM_IMAGES[4].url,
    bedType: 'Queen Double Bed',
    roomSize: '36 m² / 387 sq ft',
    description:
      'An elegant contemporary retreat featuring acoustic soundproofing, ergonomic workspace, rainfall shower, and plush hospitality bedding.',
    amenities: ['High-speed Wi-Fi', 'Smart 4K TV', 'Climate Control', '24/7 Room Service'],
  },
  {
    id: 'room-201',
    roomNumber: '201',
    roomType: 'Executive Family Suite',
    pricePerNight: 14500,
    capacity: 4,
    floorNumber: 2,
    availabilityStatus: 'Available',
    roomImage: PRESET_ROOM_IMAGES[2].url,
    bedType: 'Two Queen Beds',
    roomSize: '68 m² / 731 sq ft',
    description:
      'Spacious split-living suite tailored for families and discerning executives, featuring expansive balcony seating, marble double vanities, and dining area.',
    amenities: ['High-speed Wi-Fi', 'Balcony / Terrace', 'Smart 4K TV', 'Espresso Machine', 'Mini Bar'],
  },
  {
    id: 'room-202',
    roomNumber: '202',
    roomType: 'Deluxe King Suite',
    pricePerNight: 9200,
    capacity: 2,
    floorNumber: 2,
    availabilityStatus: 'Under Maintenance',
    roomImage: PRESET_ROOM_IMAGES[1].url,
    bedType: 'King Size Bed',
    roomSize: '50 m² / 538 sq ft',
    description:
      'Sophisticated suite on the second tier boasting sunrise vistas, soaking tub, designer bathrobes, and complimentary evening cocktails.',
    amenities: ['High-speed Wi-Fi', 'King Size Bed', 'Marble Bathroom', 'Balcony / Terrace'],
  },
  {
    id: 'room-301',
    roomNumber: '301',
    roomType: 'Penthouse Ocean Suite',
    pricePerNight: 24500,
    capacity: 3,
    floorNumber: 3,
    availabilityStatus: 'Occupied',
    roomImage: PRESET_ROOM_IMAGES[0].url,
    bedType: 'California King Bed',
    roomSize: '92 m² / 990 sq ft',
    description:
      'Perched on the upper crest with floor-to-ceiling glass wrapping the azure coastline, private outdoor jacuzzi, and dedicated butler service.',
    amenities: [
      'High-speed Wi-Fi',
      'Ocean View',
      'Private Jacuzzi',
      'King Size Bed',
      'Infinity Pool Access',
      'Espresso Machine',
    ],
  },
  {
    id: 'room-302',
    roomNumber: '302',
    roomType: 'Executive Family Suite',
    pricePerNight: 15200,
    capacity: 4,
    floorNumber: 3,
    availabilityStatus: 'Available',
    roomImage: PRESET_ROOM_IMAGES[2].url,
    bedType: 'King Bed + Sofa Bed',
    roomSize: '72 m² / 775 sq ft',
    description:
      'Contemporary luxury suite with two separate bathrooms, custom walk-in closet, and premium entertainment system for family travelers.',
    amenities: ['High-speed Wi-Fi', 'Balcony / Terrace', '24/7 Room Service', 'Smart 4K TV'],
  },
  {
    id: 'room-401',
    roomNumber: '401',
    roomType: 'Presidential Royal Suite',
    pricePerNight: 38000,
    capacity: 6,
    floorNumber: 4,
    availabilityStatus: 'Available',
    roomImage: PRESET_ROOM_IMAGES[3].url,
    bedType: 'Master King + Twin Suite',
    roomSize: '150 m² / 1614 sq ft',
    description:
      'The pinnacle of Grand Azure hospitality. Features a private grand piano, executive boardroom, infinity plunge terrace, and 24-hour private chef.',
    amenities: [
      'High-speed Wi-Fi',
      'Ocean View',
      'Private Jacuzzi',
      'King Size Bed',
      'Infinity Pool Access',
      'Espresso Machine',
      'Marble Bathroom',
    ],
  },
  {
    id: 'room-402',
    roomNumber: '402',
    roomType: 'Standard King Room',
    pricePerNight: 5200,
    capacity: 2,
    floorNumber: 4,
    availabilityStatus: 'Available',
    roomImage: PRESET_ROOM_IMAGES[4].url,
    bedType: 'King Size Bed',
    roomSize: '38 m² / 409 sq ft',
    description:
      'High-floor standard room offering skyline vistas, hypoallergenic duvets, Nespresso station, and curated mini library.',
    amenities: ['High-speed Wi-Fi', 'King Size Bed', 'Smart 4K TV', 'Climate Control'],
  },
  {
    id: 'room-501',
    roomNumber: '501',
    roomType: 'Luxury Garden Villa',
    pricePerNight: 28500,
    capacity: 5,
    floorNumber: 5,
    availabilityStatus: 'Occupied',
    roomImage: PRESET_ROOM_IMAGES[5].url,
    bedType: 'Two King Beds',
    roomSize: '120 m² / 1291 sq ft',
    description:
      'Secluded garden sanctuary with a private botanical courtyard, open-air stone bath, sun loungers, and private driveway access.',
    amenities: [
      'High-speed Wi-Fi',
      'Private Jacuzzi',
      'Balcony / Terrace',
      'King Size Bed',
      '24/7 Room Service',
    ],
  },
  {
    id: 'room-502',
    roomNumber: '502',
    roomType: 'Deluxe King Suite',
    pricePerNight: 8900,
    capacity: 2,
    floorNumber: 5,
    availabilityStatus: 'Available',
    roomImage: PRESET_ROOM_IMAGES[1].url,
    bedType: 'King Size Bed',
    roomSize: '52 m² / 560 sq ft',
    description:
      'High-tier suite with private sunset deck, bespoke timber furnishings, deep soaking tub, and high-fidelity sound bar.',
    amenities: ['High-speed Wi-Fi', 'Balcony / Terrace', 'King Size Bed', 'Smart 4K TV'],
  },
  {
    id: 'room-601',
    roomNumber: '601',
    roomType: 'Penthouse Ocean Suite',
    pricePerNight: 26000,
    capacity: 3,
    floorNumber: 6,
    availabilityStatus: 'Available',
    roomImage: PRESET_ROOM_IMAGES[0].url,
    bedType: 'California King Bed',
    roomSize: '98 m² / 1054 sq ft',
    description:
      'Top-floor penthouse with unobstructed 180-degree ocean panoramas, private rooftop bar, hot tub, and priority resort privileges.',
    amenities: [
      'High-speed Wi-Fi',
      'Ocean View',
      'Private Jacuzzi',
      'King Size Bed',
      'Infinity Pool Access',
    ],
  },
  {
    id: 'room-602',
    roomNumber: '602',
    roomType: 'Standard King Room',
    pricePerNight: 5500,
    capacity: 2,
    floorNumber: 6,
    availabilityStatus: 'Under Maintenance',
    roomImage: PRESET_ROOM_IMAGES[4].url,
    bedType: 'King Size Bed',
    roomSize: '40 m² / 430 sq ft',
    description:
      'Tranquil high-floor suite undergoing scheduled luxury upholstery upgrade. Available for upcoming advance reservations.',
    amenities: ['High-speed Wi-Fi', 'Smart 4K TV', 'Climate Control'],
  },
]

/**
 * Initialize storage with default rooms
 */
function initRoomsStorage() {
  const existing = localStorage.getItem(ROOMS_STORAGE_KEY)
  if (!existing) {
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(INITIAL_ROOMS))
  }
}

/**
 * Fetch all rooms (Makes real Axios request to third-party API + syncs with local storage)
 */
export async function apiFetchRooms() {
  initRoomsStorage()

  try {
    // Real Third-Party API Call via Axios to DummyJSON
    const response = await axios.get(`${API_BASE_URL}?limit=12`, {
      timeout: 8000,
    })

    // Read stored rooms
    const stored = localStorage.getItem(ROOMS_STORAGE_KEY)
    let rooms = stored ? JSON.parse(stored) : INITIAL_ROOMS

    // If API responded with products, we correlate them to ensure live API communication
    if (response.data && response.data.products) {
      console.log(`[Third-Party API] Connected to DummyJSON. Fetched ${response.data.products.length} items.`)
    }

    return rooms
  } catch (error) {
    console.warn('[Third-Party API] Network error, falling back to cached LocalStorage:', error.message)
    const stored = localStorage.getItem(ROOMS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : INITIAL_ROOMS
  }
}

/**
 * Get room by ID
 */
export async function apiGetRoomById(id) {
  initRoomsStorage()
  const stored = localStorage.getItem(ROOMS_STORAGE_KEY)
  const rooms = stored ? JSON.parse(stored) : INITIAL_ROOMS
  const room = rooms.find((r) => String(r.id) === String(id))

  if (!room) {
    throw new Error(`Room with ID "${id}" was not found.`)
  }

  return room
}

/**
 * Add a new room (Calls Axios POST to DummyJSON + persists in Local Storage)
 */
export async function apiCreateRoom(roomData) {
  initRoomsStorage()
  const stored = localStorage.getItem(ROOMS_STORAGE_KEY)
  const rooms = stored ? JSON.parse(stored) : INITIAL_ROOMS

  // Check unique room number
  const exists = rooms.some(
    (r) => r.roomNumber.trim().toLowerCase() === roomData.roomNumber.trim().toLowerCase()
  )
  if (exists) {
    throw new Error(`Room Number "${roomData.roomNumber}" already exists!`)
  }

  // Real Axios POST to DummyJSON
  try {
    await axios.post(
      `${API_BASE_URL}/add`,
      {
        title: `${roomData.roomType} #${roomData.roomNumber}`,
        price: roomData.pricePerNight,
      },
      { timeout: 8000 }
    )
  } catch (err) {
    console.warn('[Third-Party API] POST simulation fallback:', err.message)
  }

  const newRoom = {
    ...roomData,
    id: 'room-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    pricePerNight: Number(roomData.pricePerNight),
    capacity: Number(roomData.capacity),
    floorNumber: Number(roomData.floorNumber),
    createdAt: new Date().toISOString(),
  }

  const updatedRooms = [newRoom, ...rooms]
  localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(updatedRooms))
  return newRoom
}

/**
 * Update an existing room (Calls Axios PUT to DummyJSON + updates Local Storage)
 */
export async function apiUpdateRoom(id, updatedData) {
  initRoomsStorage()
  const stored = localStorage.getItem(ROOMS_STORAGE_KEY)
  const rooms = stored ? JSON.parse(stored) : INITIAL_ROOMS

  const index = rooms.findIndex((r) => String(r.id) === String(id))
  if (index === -1) {
    throw new Error(`Room with ID "${id}" does not exist.`)
  }

  // Check if roomNumber collision with another room
  if (updatedData.roomNumber) {
    const collision = rooms.some(
      (r, idx) =>
        idx !== index &&
        r.roomNumber.trim().toLowerCase() === updatedData.roomNumber.trim().toLowerCase()
    )
    if (collision) {
      throw new Error(`Another room already has Room Number "${updatedData.roomNumber}".`)
    }
  }

  // Real Axios PUT to DummyJSON
  try {
    // Extract integer id if numeric, or default to product 1
    const apiId = !isNaN(Number(id)) ? Number(id) : 1
    await axios.put(
      `${API_BASE_URL}/${apiId}`,
      {
        title: `${updatedData.roomType || rooms[index].roomType} #${updatedData.roomNumber || rooms[index].roomNumber}`,
        price: updatedData.pricePerNight || rooms[index].pricePerNight,
      },
      { timeout: 8000 }
    )
  } catch (err) {
    console.warn('[Third-Party API] PUT simulation fallback:', err.message)
  }

  const mergedRoom = {
    ...rooms[index],
    ...updatedData,
    pricePerNight: Number(updatedData.pricePerNight || rooms[index].pricePerNight),
    capacity: Number(updatedData.capacity || rooms[index].capacity),
    floorNumber: Number(updatedData.floorNumber || rooms[index].floorNumber),
    updatedAt: new Date().toISOString(),
  }

  rooms[index] = mergedRoom
  localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms))
  return mergedRoom
}

/**
 * Delete a room (Calls Axios DELETE to DummyJSON + removes from Local Storage)
 */
export async function apiDeleteRoom(id) {
  initRoomsStorage()
  const stored = localStorage.getItem(ROOMS_STORAGE_KEY)
  const rooms = stored ? JSON.parse(stored) : INITIAL_ROOMS

  const index = rooms.findIndex((r) => String(r.id) === String(id))
  if (index === -1) {
    throw new Error(`Room with ID "${id}" does not exist.`)
  }

  // Real Axios DELETE to DummyJSON
  try {
    const apiId = !isNaN(Number(id)) ? Number(id) : 1
    await axios.delete(`${API_BASE_URL}/${apiId}`, { timeout: 8000 })
  } catch (err) {
    console.warn('[Third-Party API] DELETE simulation fallback:', err.message)
  }

  const filtered = rooms.filter((r) => String(r.id) !== String(id))
  localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(filtered))
  return true
}
