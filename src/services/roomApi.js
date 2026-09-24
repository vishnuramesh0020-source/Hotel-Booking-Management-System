import axios from 'axios'

const API_BASE_URL = 'https://dummyjson.com/products'
const MUTATIONS_STORAGE_KEY = 'hbms_room_mutations'

// Preset high-resolution luxury hotel room images matching hotel tiers
export const PRESET_ROOM_IMAGES = [
  {
    label: 'Deluxe King Suite',
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Standard King Room',
    url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Executive Balcony Suite',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Ocean Penthouse',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Presidential Royal Suite',
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Luxury Garden Villa',
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

/**
 * Clean up any legacy hardcoded mock storage
 */
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('hbms_rooms')
  } catch (e) {
    console.error(e)
  }
}

/**
 * Retrieve user mutation delta (created, edited, deleted items)
 */
function getMutations() {
  try {
    const raw = localStorage.getItem(MUTATIONS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : { created: [], edited: {}, deleted: [] }
  } catch {
    return { created: [], edited: {}, deleted: [] }
  }
}

/**
 * Save user mutation delta
 */
function saveMutations(mutations) {
  try {
    localStorage.setItem(MUTATIONS_STORAGE_KEY, JSON.stringify(mutations))
  } catch (err) {
    console.error('Failed to save room mutations:', err)
  }
}

/**
 * Transforms an incoming product object from DummyJSON API into a hotel Room model
 */
export function transformProductToRoom(product) {
  const numId = Number(product.id) || 1
  const typeIndex = (numId - 1) % ROOM_TYPES.length
  const imgIndex = (numId - 1) % PRESET_ROOM_IMAGES.length
  const floor = Math.floor((numId - 1) / 3) + 1
  const roomNum = `${floor}0${((numId - 1) % 3) + 1}`

  // Derive status dynamically from API stock level
  let status = 'Available'
  if (product.stock !== undefined) {
    if (product.stock > 70) status = 'Available'
    else if (product.stock > 25) status = 'Occupied'
    else status = 'Under Maintenance'
  }

  // Derive price in Rupees (₹) based on API price
  const basePrice = Math.round(Number(product.price || 20) * 350)
  const price = Math.max(3500, Math.min(38000, basePrice))

  // Dynamic amenities tailored to room tier
  const amenitiesCount = 4 + (numId % 5)
  const amenities = ALL_AMENITIES.slice(0, amenitiesCount)

  return {
    id: String(product.id),
    apiSource: 'DummyJSON Products API',
    roomNumber: roomNum,
    roomType: ROOM_TYPES[typeIndex],
    pricePerNight: price,
    capacity: 2 + (numId % 4),
    floorNumber: floor,
    availabilityStatus: status,
    roomImage: PRESET_ROOM_IMAGES[imgIndex].url,
    thumbnail: product.thumbnail,
    bedType: typeIndex % 2 === 0 ? 'King Size Bed' : 'Queen Double Bed',
    roomSize: `${38 + (numId * 4)} m² / ${410 + (numId * 40)} sq ft`,
    description:
      product.description ||
      'Luxurious hotel suite equipped with premium amenities, soundproofing, and panoramic vistas.',
    amenities: amenities,
    rating: product.rating,
    stock: product.stock,
  }
}

/**
 * Fetch all rooms directly from DummyJSON Third-Party REST API via Axios
 */
export async function apiFetchRooms() {
  // Real live Axios call to DummyJSON Third-Party API
  const response = await axios.get(`${API_BASE_URL}?limit=12`, {
    timeout: 10000,
  })

  if (!response.data || !Array.isArray(response.data.products)) {
    throw new Error('Invalid response structure from Third-Party API.')
  }

  const mutations = getMutations()

  // Transform raw API products dynamically into Hotel Rooms
  let rooms = response.data.products.map(transformProductToRoom)

  // Filter out any rooms deleted by user
  if (mutations.deleted.length > 0) {
    rooms = rooms.filter((r) => !mutations.deleted.includes(String(r.id)))
  }

  // Overlay user edits on API records
  rooms = rooms.map((r) => {
    if (mutations.edited[r.id]) {
      return { ...r, ...mutations.edited[r.id] }
    }
    return r
  })

  // Prepend newly user-created rooms
  if (mutations.created.length > 0) {
    rooms = [...mutations.created, ...rooms]
  }

  return rooms
}

/**
 * Get room by ID (Calls Axios GET to DummyJSON for API products)
 */
export async function apiGetRoomById(id) {
  const mutations = getMutations()

  // Check if newly created room in mutations
  const createdMatch = mutations.created.find((r) => String(r.id) === String(id))
  if (createdMatch) {
    return createdMatch
  }

  // Fetch directly from DummyJSON API via Axios
  const numericId = !isNaN(Number(id)) ? Number(id) : null
  if (numericId) {
    const response = await axios.get(`${API_BASE_URL}/${numericId}`, {
      timeout: 8000,
    })

    if (!response.data || !response.data.id) {
      throw new Error(`Room with ID "${id}" was not found on the remote API.`)
    }

    const room = transformProductToRoom(response.data)

    // Check if edited
    if (mutations.edited[id]) {
      return { ...room, ...mutations.edited[id] }
    }

    return room
  }

  throw new Error(`Room with ID "${id}" was not found.`)
}

/**
 * Add a new room (Fires live Axios POST to DummyJSON API)
 */
export async function apiCreateRoom(roomData) {
  // Live Axios POST request to Third-Party DummyJSON API
  const response = await axios.post(
    `${API_BASE_URL}/add`,
    {
      title: `${roomData.roomType} #${roomData.roomNumber}`,
      price: Math.round(Number(roomData.pricePerNight) / 350) || 50,
      description: roomData.description,
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000,
    }
  )

  const serverAssignedId = response.data?.id ? String(response.data.id) : String(Date.now())

  const newRoom = {
    ...roomData,
    id: serverAssignedId,
    apiSource: 'DummyJSON POST /products/add',
    pricePerNight: Number(roomData.pricePerNight),
    capacity: Number(roomData.capacity),
    floorNumber: Number(roomData.floorNumber),
    createdAt: new Date().toISOString(),
  }

  const mutations = getMutations()
  mutations.created = [newRoom, ...mutations.created]
  saveMutations(mutations)

  return newRoom
}

/**
 * Update an existing room (Fires live Axios PUT to DummyJSON API)
 */
export async function apiUpdateRoom(id, updatedData) {
  const numericId = !isNaN(Number(id)) ? Number(id) : 1

  // Live Axios PUT request to Third-Party DummyJSON API
  await axios.put(
    `${API_BASE_URL}/${numericId}`,
    {
      title: `${updatedData.roomType || 'Room'} #${updatedData.roomNumber || ''}`,
      price: Math.round(Number(updatedData.pricePerNight || 8500) / 350) || 50,
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000,
    }
  )

  const mutations = getMutations()

  // Check if updating a user-created room
  const createdIndex = mutations.created.findIndex((r) => String(r.id) === String(id))
  if (createdIndex !== -1) {
    const updated = {
      ...mutations.created[createdIndex],
      ...updatedData,
      pricePerNight: Number(updatedData.pricePerNight || mutations.created[createdIndex].pricePerNight),
      capacity: Number(updatedData.capacity || mutations.created[createdIndex].capacity),
      floorNumber: Number(updatedData.floorNumber || mutations.created[createdIndex].floorNumber),
      updatedAt: new Date().toISOString(),
    }
    mutations.created[createdIndex] = updated
    saveMutations(mutations)
    return updated
  }

  // Otherwise record edit for API room
  mutations.edited[id] = {
    ...(mutations.edited[id] || {}),
    ...updatedData,
    ...(updatedData.pricePerNight !== undefined ? { pricePerNight: Number(updatedData.pricePerNight) } : {}),
    ...(updatedData.capacity !== undefined ? { capacity: Number(updatedData.capacity) } : {}),
    ...(updatedData.floorNumber !== undefined ? { floorNumber: Number(updatedData.floorNumber) } : {}),
    updatedAt: new Date().toISOString(),
  }
  saveMutations(mutations)

  // Return merged object
  const baseRoom = await apiGetRoomById(id)
  return { ...baseRoom, ...updatedData }
}

/**
 * Delete a room (Fires live Axios DELETE to DummyJSON API)
 */
export async function apiDeleteRoom(id) {
  const numericId = !isNaN(Number(id)) ? Number(id) : 1

  // Live Axios DELETE request to Third-Party DummyJSON API
  await axios.delete(`${API_BASE_URL}/${numericId}`, {
    timeout: 8000,
  })

  const mutations = getMutations()

  // If in created list, remove
  mutations.created = mutations.created.filter((r) => String(r.id) !== String(id))

  // Add to deleted list
  if (!mutations.deleted.includes(String(id))) {
    mutations.deleted.push(String(id))
  }

  // Remove any edits
  delete mutations.edited[id]

  saveMutations(mutations)
  return true
}
