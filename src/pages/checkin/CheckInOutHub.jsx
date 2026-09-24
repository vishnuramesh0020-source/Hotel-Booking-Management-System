import { useState, useMemo } from 'react'
import {
  UserCheck,
  LogOut,
  Calendar,
  KeyRound,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  BedDouble,
  History,
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import CheckInModal from '../../components/checkin/CheckInModal'
import CheckOutModal from '../../components/checkin/CheckOutModal'
import BookingDetailsModal from '../../components/bookings/BookingDetailsModal'
import { useBookings } from '../../context/BookingContext'
import { calculateStayDuration } from '../../services/bookingApi'

export default function CheckInOutHub() {
  const { bookings, isLoading } = useBookings()

  // Active Tab: 'operations' | 'checkin-history' | 'checkout-history'
  const [activeTab, setActiveTab] = useState('operations')

  // Operations sub-filter: 'all' | 'ready-checkin' | 'ready-checkout'
  const [opsFilter, setOpsFilter] = useState('all')

  // Search query
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [selectedBookingForCheckIn, setSelectedBookingForCheckIn] = useState(null)
  const [selectedBookingForCheckOut, setSelectedBookingForCheckOut] = useState(null)
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null)

  // KPI Metrics
  const stats = useMemo(() => {
    const activeInHouse = bookings.filter((b) => b.status === 'Checked-In')
    const pendingArrivals = bookings.filter((b) => b.status === 'Confirmed')
    const completedDepartures = bookings.filter((b) => b.status === 'Checked-Out')
    const checkedInHistoryCount = bookings.filter((b) => b.actualCheckIn || b.status === 'Checked-In' || b.status === 'Checked-Out').length

    return {
      activeInHouse: activeInHouse.length,
      pendingArrivals: pendingArrivals.length,
      completedDepartures: completedDepartures.length,
      totalArrivalsLogged: checkedInHistoryCount,
    }
  }, [bookings])

  // Filtered operational bookings (Confirmed & Checked-In)
  const operationalBookings = useMemo(() => {
    let list = bookings.filter(
      (b) => b.status === 'Confirmed' || b.status === 'Checked-In'
    )

    if (opsFilter === 'ready-checkin') {
      list = list.filter((b) => b.status === 'Confirmed')
    } else if (opsFilter === 'ready-checkout') {
      list = list.filter((b) => b.status === 'Checked-In')
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.guestName.toLowerCase().includes(q) ||
          String(b.roomNumber).toLowerCase().includes(q) ||
          (b.keycardNumber && b.keycardNumber.toLowerCase().includes(q))
      )
    }

    return list
  }, [bookings, opsFilter, searchQuery])

  // Check-In History List
  const checkInHistory = useMemo(() => {
    let list = bookings.filter(
      (b) => b.actualCheckIn || b.status === 'Checked-In' || b.status === 'Checked-Out'
    )

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.guestName.toLowerCase().includes(q) ||
          String(b.roomNumber).toLowerCase().includes(q) ||
          (b.keycardNumber && b.keycardNumber.toLowerCase().includes(q)) ||
          (b.checkedInBy && b.checkedInBy.toLowerCase().includes(q))
      )
    }

    return list.sort((a, b) => {
      const timeA = new Date(a.actualCheckIn || a.checkIn).getTime()
      const timeB = new Date(b.actualCheckIn || b.checkIn).getTime()
      return timeB - timeA
    })
  }, [bookings, searchQuery])

  // Check-Out History List
  const checkOutHistory = useMemo(() => {
    let list = bookings.filter(
      (b) => b.status === 'Checked-Out' || b.actualCheckOut
    )

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.guestName.toLowerCase().includes(q) ||
          String(b.roomNumber).toLowerCase().includes(q) ||
          (b.keycardNumber && b.keycardNumber.toLowerCase().includes(q)) ||
          (b.checkedOutBy && b.checkedOutBy.toLowerCase().includes(q))
      )
    }

    return list.sort((a, b) => {
      const timeA = new Date(a.actualCheckOut || a.checkOut).getTime()
      const timeB = new Date(b.actualCheckOut || b.checkOut).getTime()
      return timeB - timeA
    })
  }, [bookings, searchQuery])

  return (
    <div className="min-h-screen bg-[#f4f4ec] text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#1b4332] text-white p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Real-Time Desk Sync</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Check-In & Check-Out Hub
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                Seamless front-desk operations for guest arrivals and departures. Synchronizes room inventory in real-time, validates identity proofs, issues keycards, and tracks historical audits.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-2xl px-4 py-3 text-right backdrop-blur-xs border border-white/15">
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                  In-House Guests
                </p>
                <p className="text-2xl font-black text-white">{stats.activeInHouse}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                In-House Stays
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">{stats.activeInHouse}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                Occupying live suites
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1b4332] flex items-center justify-center border border-emerald-100">
              <BedDouble className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending Arrivals
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">{stats.pendingArrivals}</p>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                Awaiting check-in
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-100">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Check-Ins Recorded
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {stats.totalArrivalsLogged}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Total guest arrivals
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center border border-sky-100">
              <KeyRound className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Completed Check-Outs
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {stats.completedDepartures}
              </p>
              <p className="text-[11px] text-purple-600 font-medium mt-0.5">
                Rooms released & billed
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center border border-purple-100">
              <LogOut className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tabbed Navigation & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          {/* Main Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('operations')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === 'operations'
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Front-Desk Operations</span>
              <span
                className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === 'operations' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {operationalBookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checkin-history')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === 'checkin-history'
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Check-In History</span>
              <span
                className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === 'checkin-history'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {checkInHistory.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checkout-history')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === 'checkout-history'
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Check-Out History</span>
              <span
                className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === 'checkout-history'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {checkOutHistory.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guest, room, keycard..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] transition"
            />
          </div>
        </div>

        {/* TAB 1: FRONT DESK OPERATIONS (ACTIVE & DUE) */}
        {activeTab === 'operations' && (
          <div className="space-y-4">
            {/* Sub-Filters */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpsFilter('all')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  opsFilter === 'all'
                    ? 'bg-[#1b4332] text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Operations ({bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Checked-In').length})
              </button>
              <button
                type="button"
                onClick={() => setOpsFilter('ready-checkin')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  opsFilter === 'ready-checkin'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Ready for Check-In ({stats.pendingArrivals})</span>
              </button>
              <button
                type="button"
                onClick={() => setOpsFilter('ready-checkout')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  opsFilter === 'ready-checkout'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>In-House / Ready for Check-Out ({stats.activeInHouse})</span>
              </button>
            </div>

            {/* Operational Cards Grid */}
            {isLoading ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
                <div className="w-8 h-8 border-4 border-[#1b4332]/20 border-t-[#1b4332] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">Loading front-desk operations...</p>
              </div>
            ) : operationalBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">No Matching Stays Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  There are no current reservations matching the filter criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {operationalBookings.map((booking) => {
                  const duration = calculateStayDuration(
                    booking.checkIn,
                    booking.checkOut,
                    booking.actualCheckIn,
                    booking.actualCheckOut,
                    booking.status
                  )

                  const isCheckedIn = booking.status === 'Checked-In'

                  return (
                    <div
                      key={booking.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-4"
                    >
                      {/* Top Row: Room & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.roomImage}
                            alt={booking.roomNumber}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black text-slate-900">
                                Room #{booking.roomNumber}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500">
                                {booking.roomType}
                              </span>
                            </div>
                            <p className="text-xs font-mono font-bold text-[#1b4332] mt-0.5">
                              ₹{Number(booking.pricePerNight).toLocaleString()}{' '}
                              <span className="font-normal text-slate-400">/ night</span>
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 flex items-center gap-1.5 ${
                            isCheckedIn
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isCheckedIn ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'
                            }`}
                          />
                          <span>{booking.status}</span>
                        </span>
                      </div>

                      {/* Guest Information */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {booking.guestName ? booking.guestName[0].toUpperCase() : 'G'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {booking.guestName}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {booking.guestPhone} • {booking.guestEmail}
                            </p>
                          </div>
                        </div>

                        {booking.keycardNumber && (
                          <div className="text-right shrink-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Keycard
                            </span>
                            <span className="text-xs font-mono font-bold text-[#1b4332]">
                              {booking.keycardNumber}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Stay Duration & Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Stay Duration:</span>
                          </span>
                          <span
                            className={`font-semibold ${
                              duration.isOverstay ? 'text-rose-600 font-bold' : 'text-slate-800'
                            }`}
                          >
                            {duration.displayText}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              duration.isOverstay
                                ? 'bg-rose-500'
                                : isCheckedIn
                                ? 'bg-[#1b4332]'
                                : 'bg-slate-300'
                            }`}
                            style={{ width: `${Math.max(5, duration.progressPercent)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>Check-In: {booking.checkIn}</span>
                          <span>Check-Out: {booking.checkOut}</span>
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForDetails(booking)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
                        >
                          View Voucher Ref: {booking.id}
                        </button>

                        <div>
                          {!isCheckedIn ? (
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForCheckIn(booking)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1b4332] hover:bg-[#143729] shadow-sm transition cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Process Check-In</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForCheckOut(booking)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition cursor-pointer"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Process Check-Out</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHECK-IN HISTORY */}
        {activeTab === 'checkin-history' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Guest Arrival Audit Log</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete record of guest check-ins, keycard issuance, and ID verifications
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 w-fit">
                {checkInHistory.length} Arrival Records Logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-5">Booking Ref</th>
                    <th className="py-3.5 px-4">Guest Details</th>
                    <th className="py-3.5 px-4">Room Assigned</th>
                    <th className="py-3.5 px-4">Check-In Timestamp</th>
                    <th className="py-3.5 px-4">Issued Keycard</th>
                    <th className="py-3.5 px-4">ID Verification</th>
                    <th className="py-3.5 px-4">Stay Duration</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {checkInHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        No check-in history records found.
                      </td>
                    </tr>
                  ) : (
                    checkInHistory.map((b) => {
                      const duration = calculateStayDuration(
                        b.checkIn,
                        b.checkOut,
                        b.actualCheckIn,
                        b.actualCheckOut,
                        b.status
                      )

                      return (
                        <tr key={b.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-5 font-mono font-bold text-slate-900">
                            {b.id}
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-bold text-slate-900">{b.guestName}</p>
                            <p className="text-[11px] text-slate-500">{b.guestPhone}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-900">Room #{b.roomNumber}</span>
                            <span className="block text-[11px] text-slate-500">{b.roomType}</span>
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-700">
                            {b.actualCheckIn
                              ? new Date(b.actualCheckIn).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : `${b.checkIn} (Scheduled)`}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-mono font-bold text-[#1b4332] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {b.keycardNumber || 'KC-' + b.roomNumber}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-800">
                              {duration.totalNights} Nights
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForDetails(b)}
                              className="text-xs font-semibold text-[#1b4332] hover:underline cursor-pointer"
                            >
                              Voucher
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CHECK-OUT HISTORY */}
        {activeTab === 'checkout-history' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Guest Departure & Settlement Audit Log</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete history of guest check-outs, room condition inspection, and final billed revenues
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-purple-50 text-purple-800 rounded-full border border-purple-200 w-fit">
                {checkOutHistory.length} Completed Stays Logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-5">Booking Ref</th>
                    <th className="py-3.5 px-4">Guest Details</th>
                    <th className="py-3.5 px-4">Room Released</th>
                    <th className="py-3.5 px-4">Check-Out Timestamp</th>
                    <th className="py-3.5 px-4">Stay Duration</th>
                    <th className="py-3.5 px-4">Room Condition</th>
                    <th className="py-3.5 px-4">Settled Amount</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {checkOutHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        No check-out records found. Check out an active guest to see records here.
                      </td>
                    </tr>
                  ) : (
                    checkOutHistory.map((b) => {
                      const duration = calculateStayDuration(
                        b.checkIn,
                        b.checkOut,
                        b.actualCheckIn,
                        b.actualCheckOut,
                        'Checked-Out'
                      )

                      return (
                        <tr key={b.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-5 font-mono font-bold text-slate-900">
                            {b.id}
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-bold text-slate-900">{b.guestName}</p>
                            <p className="text-[11px] text-slate-500">{b.guestPhone}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-900">Room #{b.roomNumber}</span>
                            <span className="block text-[10px] text-emerald-700 font-semibold">
                              Available
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-700">
                            {b.actualCheckOut
                              ? new Date(b.actualCheckOut).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : `${b.checkOut} (Recorded)`}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-900">
                              {duration.totalNights} Nights Completed
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold px-2 py-0.5 rounded-full text-slate-700 bg-slate-100 border border-slate-200">
                              {b.roomCondition || 'Good'}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-[#1b4332] text-sm">
                            ₹{Number(b.finalBilledAmount || b.totalAmount).toLocaleString()}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForDetails(b)}
                              className="text-xs font-semibold text-[#1b4332] hover:underline cursor-pointer"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Check-In Modal */}
      {selectedBookingForCheckIn && (
        <CheckInModal
          isOpen={Boolean(selectedBookingForCheckIn)}
          booking={selectedBookingForCheckIn}
          onClose={() => setSelectedBookingForCheckIn(null)}
        />
      )}

      {/* Check-Out Modal */}
      {selectedBookingForCheckOut && (
        <CheckOutModal
          isOpen={Boolean(selectedBookingForCheckOut)}
          booking={selectedBookingForCheckOut}
          onClose={() => setSelectedBookingForCheckOut(null)}
        />
      )}

      {/* Booking Voucher & Invoice Modal */}
      {selectedBookingForDetails && (
        <BookingDetailsModal
          isOpen={Boolean(selectedBookingForDetails)}
          booking={selectedBookingForDetails}
          onClose={() => setSelectedBookingForDetails(null)}
        />
      )}
    </div>
  )
}
