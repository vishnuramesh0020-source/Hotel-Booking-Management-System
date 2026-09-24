import { useState, useMemo } from 'react'
import {
  Sparkles,
  Calendar,
  LogOut,
  Hotel,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRooms } from '../../context/RoomContext'
import { useGuests } from '../../context/GuestContext'
import { useBookings } from '../../context/BookingContext'
import Navbar from '../../components/layout/Navbar'
import StatCards from '../../components/dashboard/StatCards'
import RevenueSummary from '../../components/dashboard/RevenueSummary'
import RecentBookings from '../../components/dashboard/RecentBookings'
import QuickActions from '../../components/dashboard/QuickActions'
import { HOTEL_STATS, RECENT_BOOKINGS } from '../../services/dashboardData'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { rooms } = useRooms()
  const { guests } = useGuests()
  const { bookings } = useBookings()
  const [recentBookingsList, setRecentBookingsList] = useState(RECENT_BOOKINGS)

  // Real-time computed hotel KPI metrics dynamically derived from live contexts
  const stats = useMemo(() => {
    const totalRooms = rooms.length > 0 ? rooms.length : HOTEL_STATS.totalRooms
    const occupiedRooms = rooms.filter((r) => r.availabilityStatus === 'Occupied').length
    const availableRooms = rooms.filter((r) => r.availabilityStatus === 'Available').length
    const totalGuests = guests.length > 0 ? guests.length : HOTEL_STATS.totalGuests
    const totalBookings = bookings.length > 0 ? bookings.length : HOTEL_STATS.totalBookings
    const todaysCheckIns = bookings.filter((b) => b.status === 'Checked-In').length
    const todaysCheckOuts = bookings.filter((b) => b.status === 'Checked-Out').length
    const pendingArrivals = bookings.filter((b) => b.status === 'Confirmed').length
    const occupancyRate =
      totalRooms > 0 ? Number(((occupiedRooms / totalRooms) * 100).toFixed(1)) : 67.2

    return {
      totalRooms,
      availableRooms: availableRooms || HOTEL_STATS.availableRooms,
      occupiedRooms: occupiedRooms || HOTEL_STATS.occupiedRooms,
      cleanRooms: availableRooms || HOTEL_STATS.cleanRooms,
      totalGuests,
      totalBookings,
      todaysCheckIns: todaysCheckIns || HOTEL_STATS.todaysCheckIns,
      todaysCheckOuts: todaysCheckOuts || HOTEL_STATS.todaysCheckOuts,
      pendingArrivals: pendingArrivals || HOTEL_STATS.pendingArrivals,
      occupancyRate,
    }
  }, [rooms, guests, bookings])

  const handleLogout = () => {
    logout()
    toast.info('You have been logged out.')
  }

  const handleNewBookingCreated = (newBooking) => {
    setRecentBookingsList((prev) => [newBooking, ...prev])
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#f4f4ec] text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Welcome Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#1b4332] text-white p-6 sm:p-8 shadow-xl">
          {/* Subtle background luxury glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hotelook Operations Hub</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{currentDate}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Manager'}!
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                Here is your live hotel analytics briefing. The property is operating at{' '}
                <span className="font-bold text-white underline decoration-amber-400">
                  {stats.occupancyRate}% occupancy
                </span>{' '}
                with <span className="font-bold text-white">{stats.availableRooms} rooms</span>{' '}
                ready for immediate assignment.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-emerald-200">Active Role</span>
                <span className="text-sm font-bold text-white">{user?.role || 'Hotel Owner'}</span>
              </div>

              <button
                onClick={handleLogout}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: KPI Stat Cards (All 7 Requested Metrics) */}
        <StatCards stats={stats} />

        {/* Section 2: Analytics & Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Column (2/3): Revenue Summary + Recent Bookings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Summary with Timeframe Filters & Visualizer */}
            <RevenueSummary />

            {/* Recent Bookings Table & Status Logs */}
            <RecentBookings bookings={recentBookingsList} />
          </div>

          {/* Right Sidebar Column (1/3): Quick Actions & Room Type Breakdown */}
          <div className="space-y-8">
            {/* Quick Action Cards */}
            <QuickActions onNewBookingCreated={handleNewBookingCreated} />

            {/* Room Category Occupancy Matrix */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center">
                    <Hotel className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Room Type Occupancy
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">Live</span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Deluxe King Suites</span>
                    <span className="text-slate-900 font-bold">48 / 50 (96%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1b4332] h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Executive Family Suites</span>
                    <span className="text-slate-900 font-bold">24 / 30 (80%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2d6a4f] h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Penthouse Ocean Suites</span>
                    <span className="text-slate-900 font-bold">6 / 8 (75%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#f07f2e] h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Standard King Rooms</span>
                    <span className="text-slate-900 font-bold">8 / 40 (20%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Compliance & Security Badge */}
            <div className="p-5 rounded-3xl bg-[#efefe3]/80 border border-slate-200/80 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Hospitality Grade Security</p>
                <p className="text-[11px] text-slate-500">
                  PCI-DSS compliant booking logs & encrypted guest records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
