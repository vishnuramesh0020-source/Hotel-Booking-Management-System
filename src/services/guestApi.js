import axios from 'axios'

const API_BASE_URL = 'https://dummyjson.com/users'
const MUTATIONS_STORAGE_KEY = 'hbms_guest_mutations'

// Popular nationalities for quick selection
export const NATIONALITY_OPTIONS = [
  'Indian',
  'American',
  'British',
  'Canadian',
  'Australian',
  'German',
  'French',
  'Emirati (UAE)',
  'Singaporean',
  'Japanese',
  'Swiss',
  'Italian',
]

// VIP and Guest Tiers
export const GUEST_TIERS = ['Regular', 'VIP', 'Corporate']

/**
 * Retrieve user mutations (created, edited, deleted guests) from LocalStorage
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
 * Save user mutations to LocalStorage
 */
function saveMutations(mutations) {
  try {
    localStorage.setItem(MUTATIONS_STORAGE_KEY, JSON.stringify(mutations))
  } catch (err) {
    console.error('Failed to save guest mutations:', err)
  }
}

/**
 * Transform an incoming user object from DummyJSON Users API into the Hotelook Guest model
 */
export function transformUserToGuest(user) {
  const numId = Number(user.id) || 1
  const tierIndex = (numId - 1) % GUEST_TIERS.length

  // Generate a formatted ID proof number based on user ssn/ein or generated pattern
  const idProof =
    user.ein ||
    user.ssn ||
    `IDP-${String(100000 + numId * 739).slice(0, 4)}-${String(user.birthDate || '1990').slice(0, 4)}`

  // Format clean physical address
  const addr = user.address
    ? `${user.address.address || 'Street'}, ${user.address.city || 'City'}, ${user.address.state || 'State'}`
    : 'Suite 404, Harbor View Avenue, Mumbai'

  // Map nationality from country or deterministic fallback
  const nat = user.address?.country || NATIONALITY_OPTIONS[(numId - 1) % NATIONALITY_OPTIONS.length]

  return {
    id: String(user.id),
    apiSource: 'DummyJSON Users API',
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    mobileNumber: user.phone || `+91 98${String(10000000 + numId * 827).slice(0, 8)}`,
    address: addr,
    idProofNumber: idProof,
    nationality: nat,
    avatar: user.image || `https://dummyjson.com/icon/${user.username || 'guest'}/128`,
    vipStatus: GUEST_TIERS[tierIndex],
    gender: user.gender || 'unspecified',
    totalStays: (numId % 8) + 1,
    preferredRoomType: (numId % 2 === 0 ? 'Deluxe King Suite' : 'Penthouse Ocean Suite'),
    notes: user.company?.title ? `Corporate Guest (${user.company.title})` : 'Prefers high-floor room.',
    createdAt: user.meta?.createdAt || new Date(Date.now() - numId * 86400000 * 5).toISOString(),
  }
}

/**
 * Fetch all guests live from DummyJSON Third-Party REST API via Axios
 */
export async function apiFetchGuests() {
  const response = await axios.get(`${API_BASE_URL}?limit=16`, {
    timeout: 10000,
  })

  if (!response.data || !Array.isArray(response.data.users)) {
    throw new Error('Invalid response structure from Third-Party Users API.')
  }

  const mutations = getMutations()

  // Transform raw API users dynamically into Hotel Guests
  let guests = response.data.users.map(transformUserToGuest)

  // Filter out any guests deleted by user
  if (mutations.deleted.length > 0) {
    guests = guests.filter((g) => !mutations.deleted.includes(String(g.id)))
  }

  // Overlay user edits onto API records
  guests = guests.map((g) => {
    if (mutations.edited[g.id]) {
      return { ...g, ...mutations.edited[g.id] }
    }
    return g
  })

  // Prepend newly user-created guests
  if (mutations.created.length > 0) {
    guests = [...mutations.created, ...guests]
  }

  return guests
}

/**
 * Get guest by ID (Calls Axios GET to DummyJSON for API users)
 */
export async function apiGetGuestById(id) {
  const mutations = getMutations()

  // Check if newly created guest in mutations
  const createdMatch = mutations.created.find((g) => String(g.id) === String(id))
  if (createdMatch) {
    return createdMatch
  }

  // Fetch directly from DummyJSON Users API via Axios
  const numericId = !isNaN(Number(id)) ? Number(id) : null
  if (numericId) {
    const response = await axios.get(`${API_BASE_URL}/${numericId}`, {
      timeout: 8000,
    })

    if (!response.data || !response.data.id) {
      throw new Error(`Guest with ID "${id}" was not found on remote API.`)
    }

    const guest = transformUserToGuest(response.data)

    // Check if edited locally
    if (mutations.edited[id]) {
      return { ...guest, ...mutations.edited[id] }
    }

    return guest
  }

  throw new Error(`Guest with ID "${id}" was not found.`)
}

/**
 * Add a new guest (Fires live Axios POST to DummyJSON API)
 */
export async function apiCreateGuest(guestData) {
  const nameParts = guestData.fullName.trim().split(' ')
  const firstName = nameParts[0] || 'Guest'
  const lastName = nameParts.slice(1).join(' ') || 'User'

  // Live Axios POST request to Third-Party DummyJSON Users API
  const response = await axios.post(
    `${API_BASE_URL}/add`,
    {
      firstName,
      lastName,
      email: guestData.email,
      phone: guestData.mobileNumber,
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000,
    }
  )

  const serverAssignedId = response.data?.id ? String(response.data.id) : String(Date.now())

  const newGuest = {
    ...guestData,
    id: serverAssignedId,
    apiSource: 'DummyJSON POST /users/add',
    avatar:
      guestData.avatar ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guestData.fullName)}&backgroundColor=1b4332`,
    vipStatus: guestData.vipStatus || 'Regular',
    totalStays: 1,
    createdAt: new Date().toISOString(),
  }

  const mutations = getMutations()
  mutations.created = [newGuest, ...mutations.created]
  saveMutations(mutations)

  return newGuest
}

/**
 * Update an existing guest (Fires live Axios PUT to DummyJSON API)
 */
export async function apiUpdateGuest(id, updatedData) {
  const numericId = !isNaN(Number(id)) ? Number(id) : 1
  const nameParts = (updatedData.fullName || '').trim().split(' ')

  // Live Axios PUT request to Third-Party DummyJSON Users API
  await axios.put(
    `${API_BASE_URL}/${numericId}`,
    {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      email: updatedData.email,
      phone: updatedData.mobileNumber,
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000,
    }
  )

  const mutations = getMutations()

  // Check if updating a user-created guest
  const createdIndex = mutations.created.findIndex((g) => String(g.id) === String(id))
  if (createdIndex !== -1) {
    const updated = {
      ...mutations.created[createdIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    }
    mutations.created[createdIndex] = updated
    saveMutations(mutations)
    return updated
  }

  // Otherwise record edit for API guest
  mutations.edited[id] = {
    ...(mutations.edited[id] || {}),
    ...updatedData,
    updatedAt: new Date().toISOString(),
  }
  saveMutations(mutations)

  // Return merged object
  const baseGuest = await apiGetGuestById(id)
  return { ...baseGuest, ...updatedData }
}

/**
 * Delete a guest (Fires live Axios DELETE to DummyJSON API)
 */
export async function apiDeleteGuest(id) {
  const numericId = !isNaN(Number(id)) ? Number(id) : 1

  // Live Axios DELETE request to Third-Party DummyJSON Users API
  await axios.delete(`${API_BASE_URL}/${numericId}`, {
    timeout: 8000,
  })

  const mutations = getMutations()

  // If in created list, remove
  mutations.created = mutations.created.filter((g) => String(g.id) !== String(id))

  // Add to deleted list
  if (!mutations.deleted.includes(String(id))) {
    mutations.deleted.push(String(id))
  }

  // Remove any edits
  delete mutations.edited[id]

  saveMutations(mutations)
  return true
}
