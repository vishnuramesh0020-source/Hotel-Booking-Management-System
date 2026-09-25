/**
 * Hotelook Reporting & Analytics Data Service
 * Provides comprehensive data structures and metrics for Executive Reports & Operations Analytics.
 */

// Monthly performance for the current year (2026)
export const MONTHLY_REPORT_DATA = [
  { month: 'Jan', monthFull: 'January 2026', revenue: 980000, bookings: 124, completed: 110, cancelled: 8, occupancy: 64.5, adr: 7900 },
  { month: 'Feb', monthFull: 'February 2026', revenue: 1120000, bookings: 142, completed: 128, cancelled: 10, occupancy: 71.2, adr: 8100 },
  { month: 'Mar', monthFull: 'March 2026', revenue: 1250000, bookings: 158, completed: 145, cancelled: 7, occupancy: 78.4, adr: 8400 },
  { month: 'Apr', monthFull: 'April 2026', revenue: 1180000, bookings: 146, completed: 132, cancelled: 9, occupancy: 73.1, adr: 8250 },
  { month: 'May', monthFull: 'May 2026', revenue: 1340000, bookings: 168, completed: 154, cancelled: 6, occupancy: 82.5, adr: 8600 },
  { month: 'Jun', monthFull: 'June 2026', revenue: 1450000, bookings: 182, completed: 169, cancelled: 8, occupancy: 86.8, adr: 8900 },
  { month: 'Jul', monthFull: 'July 2026', revenue: 1580000, bookings: 196, completed: 181, cancelled: 9, occupancy: 91.2, adr: 9100 },
  { month: 'Aug', monthFull: 'August 2026', revenue: 1620000, bookings: 204, completed: 190, cancelled: 7, occupancy: 93.5, adr: 9250 },
  { month: 'Sep', monthFull: 'September 2026', revenue: 1420000, bookings: 175, completed: 160, cancelled: 11, occupancy: 84.0, adr: 8800 },
  { month: 'Oct', monthFull: 'October 2026', revenue: 1310000, bookings: 162, completed: 148, cancelled: 9, occupancy: 79.5, adr: 8550 },
  { month: 'Nov', monthFull: 'November 2026', revenue: 1185000, bookings: 148, completed: 135, cancelled: 8, occupancy: 74.2, adr: 8300 },
  { month: 'Dec', monthFull: 'December 2026', revenue: 1520000, bookings: 190, completed: 176, cancelled: 6, occupancy: 89.0, adr: 9150 },
]

// Weekly velocity (Past 7 Days)
export const WEEKLY_REPORT_DATA = [
  { day: 'Mon', dayFull: 'Monday', revenue: 164000, bookings: 22, occupancy: 68.0 },
  { day: 'Tue', dayFull: 'Tuesday', revenue: 182000, bookings: 25, occupancy: 72.5 },
  { day: 'Wed', dayFull: 'Wednesday', revenue: 215000, bookings: 30, occupancy: 79.0 },
  { day: 'Thu', dayFull: 'Thursday', revenue: 228000, bookings: 32, occupancy: 83.4 },
  { day: 'Fri', dayFull: 'Friday', revenue: 310000, bookings: 42, occupancy: 94.0 },
  { day: 'Sat', dayFull: 'Saturday', revenue: 345000, bookings: 46, occupancy: 97.5 },
  { day: 'Sun', dayFull: 'Sunday', revenue: 198000, bookings: 26, occupancy: 75.0 },
]

// Yearly performance (Past 4 Years)
export const YEARLY_REPORT_DATA = [
  { year: '2023', revenue: 11200000, bookings: 1420, completed: 1310, occupancy: 68.2, adr: 7200 },
  { year: '2024', revenue: 13800000, bookings: 1750, completed: 1630, occupancy: 76.5, adr: 7900 },
  { year: '2025', revenue: 16400000, bookings: 2050, completed: 1920, occupancy: 83.1, adr: 8500 },
  { year: '2026 (YTD)', revenue: 15955000, bookings: 1995, completed: 1870, occupancy: 80.6, adr: 8750 },
]

// Most booked room type leaderboards
export const ROOM_TYPE_RANKINGS = [
  {
    type: 'Deluxe Suite',
    category: 'Luxury Suite',
    totalBookings: 642,
    sharePercentage: 32.2,
    totalNights: 1926,
    avgNightsPerStay: 3.0,
    pricePerNight: 8500,
    totalRevenue: 16371000,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    popularAmenities: ['King Bed', 'Balcony', 'High-Speed Wi-Fi', 'Complimentary Breakfast'],
  },
  {
    type: 'Executive Room',
    category: 'Corporate Luxury',
    totalBookings: 485,
    sharePercentage: 24.3,
    totalNights: 1212,
    avgNightsPerStay: 2.5,
    pricePerNight: 7200,
    totalRevenue: 8726400,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    popularAmenities: ['Ergonomic Workspace', 'Express Check-In', 'Lounge Access'],
  },
  {
    type: 'Presidential Royal Suite',
    category: 'Signature Suite',
    totalBookings: 320,
    sharePercentage: 16.0,
    totalNights: 1280,
    avgNightsPerStay: 4.0,
    pricePerNight: 38000,
    totalRevenue: 48640000,
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    popularAmenities: ['Private Butler', 'Panoramic Skyline View', 'Jacuzzi & Spa'],
  },
  {
    type: 'Standard King',
    category: 'Classic Comfort',
    totalBookings: 295,
    sharePercentage: 14.8,
    totalNights: 590,
    avgNightsPerStay: 2.0,
    pricePerNight: 4500,
    totalRevenue: 2655000,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    popularAmenities: ['King Size Bed', 'Smart TV', 'City View'],
  },
  {
    type: 'Family Ocean Suite',
    category: 'Family Vacation',
    totalBookings: 253,
    sharePercentage: 12.7,
    totalNights: 1012,
    avgNightsPerStay: 4.0,
    pricePerNight: 14000,
    totalRevenue: 14168000,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    popularAmenities: ['Connecting Rooms', 'Ocean Balcony', 'Kids Play Zone Access'],
  },
]

// Departmental revenue stream distribution
export const REVENUE_STREAMS_REPORT = [
  { name: 'Room & Suite Stays', amount: 12450000, percentage: 56.4, color: '#1b4332' },
  { name: 'Gourmet Dining & In-Room Dining', amount: 4820000, percentage: 21.8, color: '#2d6a4f' },
  { name: 'Spa, Wellness & Poolside Cabana', amount: 2650000, percentage: 12.0, color: '#f07f2e' },
  { name: 'Conferences & Banquet Events', amount: 2160000, percentage: 9.8, color: '#0ea5e9' },
]

// Day of week booking demand trends
export const DAY_OF_WEEK_TRENDS = [
  { day: 'Monday', share: 11, label: 'Low Leisure, Moderate Corporate' },
  { day: 'Tuesday', share: 13, label: 'Peak Corporate Check-Ins' },
  { day: 'Wednesday', share: 14, label: 'High Corporate Stay' },
  { day: 'Thursday', share: 15, label: 'Pre-Weekend Business' },
  { day: 'Friday', share: 22, label: 'Peak Weekend Leisure Check-Ins' },
  { day: 'Saturday', share: 25, label: 'Highest Occupancy Rate' },
  { day: 'Sunday', share: 10, label: 'Transition & Departures' },
]

// Active guest demographic segments
export const ACTIVE_GUEST_SEGMENTS = [
  { segment: 'Corporate & Business', count: 88, percentage: 41, avgNights: 2.4, color: '#1b4332' },
  { segment: 'Couples & Leisure', count: 64, percentage: 30, avgNights: 3.6, color: '#2d6a4f' },
  { segment: 'Family Vacationers', count: 42, percentage: 20, avgNights: 4.2, color: '#f07f2e' },
  { segment: 'VIP & High Net Worth', count: 20, percentage: 9, avgNights: 4.8, color: '#eab308' },
]

// Stay duration distribution
export const STAY_DURATION_DISTRIBUTION = [
  { range: '1-2 Nights (Short / Business)', percentage: 48, count: 960 },
  { range: '3-4 Nights (Standard Leisure)', percentage: 34, count: 680 },
  { range: '5-7 Nights (Extended Holiday)', percentage: 14, count: 280 },
  { range: '8+ Nights (Long Stay / Corporate)', percentage: 4, count: 80 },
]

/**
 * Calculates live reports by combining actual store records with simulated history
 */
export function computeReportStatistics(liveBookings = [], liveRooms = [], liveGuests = []) {
  // Live bookings breakdown
  const totalLive = liveBookings.length
  const completedBookings = liveBookings.filter((b) => b.status === 'Checked-Out')
  const inHouseBookings = liveBookings.filter((b) => b.status === 'Checked-In')
  const confirmedBookings = liveBookings.filter((b) => b.status === 'Confirmed')
  const cancelledBookings = liveBookings.filter((b) => b.status === 'Cancelled')

  // Live revenue from non-cancelled bookings
  const liveTotalRevenue = liveBookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + Number(b.finalBilledAmount || b.totalAmount || 0), 0)

  // Overall combined historical + live revenue
  const combinedTotalRevenue = 15955000 + liveTotalRevenue

  // Occupancy rate calculation
  const totalRoomsCount = liveRooms.length > 0 ? liveRooms.length : 128
  const occupiedRoomsCount = liveRooms.length > 0
    ? liveRooms.filter((r) => r.availabilityStatus === 'Occupied' || r.status === 'Occupied').length
    : inHouseBookings.length || 86
  const occupancyRate = Math.min(100, Math.round((occupiedRoomsCount / totalRoomsCount) * 1000) / 10)

  // Most booked room type from actual bookings
  const roomTypeCounts = {}
  liveBookings.forEach((b) => {
    const type = b.roomType || 'Deluxe Suite'
    roomTypeCounts[type] = (roomTypeCounts[type] || 0) + 1
  })

  let mostBookedType = 'Deluxe Suite'
  let maxCount = 0
  Object.entries(roomTypeCounts).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count
      mostBookedType = type
    }
  })

  // Active in-house guests count
  const activeGuestsCount = inHouseBookings.reduce((sum, b) => {
    return sum + (Number(b.guestsCount) || 2)
  }, 0) || 86

  // Average Daily Rate (ADR)
  const totalNights = liveBookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (Number(b.nights) || 1), 0) || 1
  const calculatedAdr = Math.round(liveTotalRevenue / totalNights) || 8750

  // RevPAR = ADR * (Occupancy Rate / 100)
  const calculatedRevPar = Math.round(calculatedAdr * (occupancyRate / 100))

  return {
    totalRevenue: combinedTotalRevenue,
    liveRevenue: liveTotalRevenue,
    totalBookings: 1995 + totalLive,
    monthlyBookings: 190 + confirmedBookings.length,
    occupancyRate: occupancyRate || 78.4,
    occupiedRooms: occupiedRoomsCount,
    totalRooms: totalRoomsCount,
    mostBookedType,
    mostBookedCount: maxCount || 642,
    activeGuests: activeGuestsCount,
    inHouseReservations: inHouseBookings.length,
    completedStays: 1870 + completedBookings.length,
    cancelledStays: 84 + cancelledBookings.length,
    adr: calculatedAdr,
    revPar: calculatedRevPar,
    totalGuestsRecorded: (liveGuests.length || 214) + 1200,
  }
}
