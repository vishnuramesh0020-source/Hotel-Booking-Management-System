<<<<<<< HEAD
import {
  User,
  Shield,
  Calendar,
  BedDouble,
  Sparkles,
  LogOut,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/layout/Navbar'
=======
import { useState } from 'react'
import {
  Sparkles,
  Calendar,
  LogOut,
  Hotel,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/layout/Navbar'
import StatCards from '../../components/dashboard/StatCards'
import RevenueSummary from '../../components/dashboard/RevenueSummary'
import RecentBookings from '../../components/dashboard/RecentBookings'
import QuickActions from '../../components/dashboard/QuickActions'
import { HOTEL_STATS, RECENT_BOOKINGS } from '../../services/dashboardData'
>>>>>>> a0439d709e3b588c80bd89b5b78028de9b43b116
import { toast } from 'react-toastify'

export default function Dashboard() {
  const { user, logout } = useAuth()
<<<<<<< HEAD
=======
  const [stats, setStats] = useState(HOTEL_STATS)
  const [recentBookingsList, setRecentBookingsList] = useState(RECENT_BOOKINGS)
>>>>>>> a0439d709e3b588c80bd89b5b78028de9b43b116

  const handleLogout = () => {
    logout()
    toast.info('You have been logged out.')
  }

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-[#f4f4ec] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#1b4332] text-white p-6 sm:p-10 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authenticated Session Active</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="mt-2 text-sm sm:text-base text-emerald-100/90 max-w-2xl">
                You are currently signed in to <span className="font-bold text-white">Hotelook</span> as{' '}
                <span className="font-semibold underline decoration-amber-400">{user?.role}</span>.
                Your profile and active credentials are saved in browser Local Storage.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleLogout}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors cursor-pointer"
=======
  const handleNewBookingCreated = (newBooking) => {
    setRecentBookingsList((prev) => [newBooking, ...prev])
    setStats((prev) => ({
      ...prev,
      totalBookings: prev.totalBookings + 1,
      occupiedRooms: prev.occupiedRooms + 1,
      availableRooms: Math.max(0, prev.availableRooms - 1),
      occupancyRate: Number(
        (((prev.occupiedRooms + 1) / prev.totalRooms) * 100).toFixed(1)
      ),
    }))
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
>>>>>>> a0439d709e3b588c80bd89b5b78028de9b43b116
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* User Profile Details & Session Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information Card */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Stored User Profile</h2>
                  <p className="text-xs text-slate-500">
                    Values pulled directly from Local Storage (`hbms_auth_user`)
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </span>
                <p className="text-sm font-bold text-slate-900">{user?.name || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </span>
                <p className="text-sm font-bold text-slate-900">{user?.email || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Contact Phone
                </span>
                <p className="text-sm font-bold text-slate-900">{user?.phone || 'Not provided'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Account Role
                </span>
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#1b4332]/10 text-[#1b4332]">
                  {user?.role || 'User'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f8f2] border border-slate-200/60 sm:col-span-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Session Token
                </span>
                <p className="text-xs font-mono text-slate-700 break-all bg-white p-2.5 rounded-xl border border-slate-200">
                  {user?.token || 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* Hotel Management Quick Stats Overview */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-[#1b4332]" />
                <span>Hotelook Services</span>
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Booking Mode</p>
                    <p className="text-sm font-bold text-[#1b4332]">{user?.role || 'User'}</p>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#1b4332]" />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Reservations</p>
                    <p className="text-sm font-bold text-slate-900">0 Active</p>
                  </div>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Protected State</p>
                    <p className="text-sm font-bold text-emerald-700">Authenticated</p>
                  </div>
                  <Shield className="w-4 h-4 text-emerald-600" />
                </div>
=======
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
>>>>>>> a0439d709e3b588c80bd89b5b78028de9b43b116
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
