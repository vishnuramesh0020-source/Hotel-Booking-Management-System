import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  Ban,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useBookings } from '../../context/BookingContext'
import { useRooms } from '../../context/RoomContext'
import { calculateStayDuration } from '../../services/bookingApi'
import Navbar from '../../components/layout/Navbar'
import BookingHistoryStats from '../../components/history/BookingHistoryStats'
import BookingHistoryDetailModal from '../../components/history/BookingHistoryDetailModal'
import CancelHistoryModal from '../../components/history/CancelHistoryModal'

const ITEMS_PER_PAGE = 8

export default function BookingHistory() {
  const { bookings, cancel } = useBookings()
  const { updateRoomAvailability } = useRooms()

  // State for search & filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [dateFilterType, setDateFilterType] = useState('all') // 'all', 'today', 'week', 'month', 'past30', 'custom'
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')
  const [currentPage, setCurrentPage] = useState(1)

  // State for modals
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null)
  const [bookingToCancel, setBookingToCancel] = useState(null)

  // Helper for Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-Out':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Completed Stay',
          icon: CheckCircle2,
        }
      case 'Checked-In':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'In-House',
          icon: Clock,
        }
      case 'Confirmed':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Confirmed',
          icon: LogOut,
        }
      case 'Cancelled':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Cancelled',
          icon: Ban,
        }
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: status,
          icon: CheckCircle2,
        }
    }
  }

  // Filter & Search Logic
  const filteredBookings = useMemo(() => {
    let result = [...bookings]

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.guestName.toLowerCase().includes(q) ||
          (b.guestEmail && b.guestEmail.toLowerCase().includes(q)) ||
          (b.guestPhone && b.guestPhone.toLowerCase().includes(q)) ||
          String(b.roomNumber).toLowerCase().includes(q) ||
          b.roomType.toLowerCase().includes(q) ||
          (b.keycardNumber && b.keycardNumber.toLowerCase().includes(q))
      )
    }

    // 2. Status Filter
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Completed') {
        result = result.filter((b) => b.status === 'Checked-Out')
      } else if (selectedStatus === 'In-House') {
        result = result.filter((b) => b.status === 'Checked-In')
      } else {
        result = result.filter((b) => b.status === selectedStatus)
      }
    }

    // 3. Date Filtering
    if (dateFilterType !== 'all') {
      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]

      if (dateFilterType === 'today') {
        result = result.filter((b) => b.checkIn === todayStr || b.checkOut === todayStr)
      } else if (dateFilterType === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        result = result.filter((b) => new Date(b.checkIn) >= weekAgo)
      } else if (dateFilterType === 'month') {
        result = result.filter((b) => {
          const d = new Date(b.checkIn)
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        })
      } else if (dateFilterType === 'past30') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        result = result.filter((b) => new Date(b.checkIn) >= thirtyDaysAgo)
      } else if (dateFilterType === 'custom') {
        if (customStartDate) {
          result = result.filter((b) => b.checkIn >= customStartDate)
        }
        if (customEndDate) {
          result = result.filter((b) => b.checkOut <= customEndDate)
        }
      }
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.checkIn) - new Date(a.checkIn)
      }
      if (sortBy === 'date-asc') {
        return new Date(a.checkIn) - new Date(b.checkIn)
      }
      if (sortBy === 'nights-desc') {
        return Number(b.nights) - Number(a.nights)
      }
      if (sortBy === 'nights-asc') {
        return Number(a.nights) - Number(b.nights)
      }
      if (sortBy === 'amount-desc') {
        return Number(b.finalBilledAmount || b.totalAmount) - Number(a.finalBilledAmount || a.totalAmount)
      }
      if (sortBy === 'amount-asc') {
        return Number(a.finalBilledAmount || a.totalAmount) - Number(b.finalBilledAmount || b.totalAmount)
      }
      return 0
    })

    return result
  }, [
    bookings,
    searchQuery,
    selectedStatus,
    dateFilterType,
    customStartDate,
    customEndDate,
    sortBy,
  ])

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredBookings, currentPage])

  // Reset page on filter changes
  const handleStatusChange = (status) => {
    setSelectedStatus(status)
    setCurrentPage(1)
  }

  const handleDateTypeChange = (type) => {
    setDateFilterType(type)
    setCurrentPage(1)
  }

  // Handle Cancellation Execution
  const handleConfirmCancel = async (bookingId, reason) => {
    try {
      const target = bookings.find((b) => String(b.id) === String(bookingId))
      await cancel(bookingId)
      if (target?.roomId && updateRoomAvailability) {
        await updateRoomAvailability(target.roomId, 'Available')
      }
      toast.success(
        `Booking ${bookingId} cancelled (${reason || 'Guest Request'}). Room inventory released back to Available.`
      )
    } catch (err) {
      toast.error(err.message || 'Failed to cancel reservation.')
    }
  }

  // Export History to CSV
  const handleExportCSV = () => {
    toast.info('Generating Reservation Archive CSV...', { autoClose: 1500 })
    setTimeout(() => {
      let csv = 'BookingID,GuestName,Email,RoomNumber,RoomType,CheckIn,CheckOut,Nights,TotalAmount,Status\n'
      filteredBookings.forEach((b) => {
        csv += `${b.id},"${b.guestName}",${b.guestEmail || ''},${b.roomNumber},"${b.roomType}",${b.checkIn},${b.checkOut},${b.nights},${b.finalBilledAmount || b.totalAmount},${b.status}\n`
      })
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Hotelook_Booking_History_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Reservation history CSV exported!')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        
        {/* Top Header & Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1b4332]/10 text-[#1b4332]">
                Audited Stay Ledger
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Historical Reservation Archives</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Reservation Archive & History
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Comprehensive historical records of completed stays, in-house occupancies, upcoming bookings, and cancellations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs hover:shadow-sm transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#1b4332]" />
              <span>Export History CSV</span>
            </button>
          </div>
        </div>

        {/* 6-Metric Booking History KPI Stats */}
        <BookingHistoryStats bookings={bookings} />

        {/* Filter & Search Control Panel */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search across Booking ID, Guest Name, Email, Room #, Suite Type, or Keycard..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Status:</span>
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
                {[
                  { id: 'All', label: 'All Records' },
                  { id: 'Completed', label: 'Completed Stays' },
                  { id: 'In-House', label: 'In-House' },
                  { id: 'Confirmed', label: 'Confirmed' },
                  { id: 'Cancelled', label: 'Cancelled' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleStatusChange(tab.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedStatus === tab.id
                        ? 'bg-[#1b4332] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-Filters: Date Range Presets & Sorting */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Date Presets */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date Period:</span>
                </span>
                <select
                  value={dateFilterType}
                  onChange={(e) => handleDateTypeChange(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] cursor-pointer"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today's Check-Ins/Outs</option>
                  <option value="week">Past 7 Days</option>
                  <option value="month">This Month</option>
                  <option value="past30">Past 30 Days</option>
                  <option value="custom">Custom Date Range...</option>
                </select>
              </div>

              {/* Custom Date Pickers if active */}
              {dateFilterType === 'custom' && (
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => {
                      setCustomStartDate(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => {
                      setCustomEndDate(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
                  />
                </div>
              )}

              {/* Reset Filters */}
              {(selectedStatus !== 'All' || dateFilterType !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedStatus('All')
                    setDateFilterType('all')
                    setCustomStartDate('')
                    setCustomEndDate('')
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 font-bold transition cursor-pointer ml-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="font-semibold text-slate-500">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] cursor-pointer"
              >
                <option value="date-desc">Check-In: Newest First</option>
                <option value="date-asc">Check-In: Oldest First</option>
                <option value="nights-desc">Duration: Longest Stay</option>
                <option value="nights-asc">Duration: Shortest Stay</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Historical Reservation Ledger</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredBookings.length} reservations matching your filter parameters
              </p>
            </div>

            <span className="text-xs font-semibold text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1b4332]/5 border-b border-slate-200/70 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Booking Ref</th>
                  <th className="px-5 py-3.5">Guest & Contact</th>
                  <th className="px-5 py-3.5">Room & Type</th>
                  <th className="px-5 py-3.5">Dates & Stay Progress</th>
                  <th className="px-5 py-3.5 text-right">Settled Amount (₹)</th>
                  <th className="px-5 py-3.5 text-center">Booking Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedBookings.length > 0 ? (
                  paginatedBookings.map((b) => {
                    const badge = getStatusBadge(b.status)
                    const StatusIcon = badge.icon
                    const duration = calculateStayDuration(
                      b.checkIn,
                      b.checkOut,
                      b.actualCheckIn,
                      b.actualCheckOut,
                      b.status
                    )

                    return (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition group">
                        
                        {/* 1. Booking Ref */}
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <span className="font-mono font-black text-slate-900 text-xs block">
                              {b.id}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Booked:{' '}
                              {b.createdAt
                                ? new Date(b.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : 'Archived'}
                            </span>
                            {b.keycardNumber && (
                              <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                                {b.keycardNumber}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 2. Guest Info */}
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <p className="font-extrabold text-slate-900 text-xs">{b.guestName}</p>
                            <p className="text-[11px] text-slate-500 truncate max-w-[170px]">{b.guestEmail || 'No email'}</p>
                            <p className="text-[10px] text-slate-400">{b.guestPhone || 'No phone'}</p>
                          </div>
                        </td>

                        {/* 3. Room Details */}
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 text-xs">
                                Room #{b.roomNumber}
                              </span>
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                                ₹{Number(b.pricePerNight).toLocaleString()}/nt
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate max-w-[160px]">
                              {b.roomType}
                            </p>
                          </div>
                        </td>

                        {/* 4. Dates & Duration Progress */}
                        <td className="px-5 py-4">
                          <div className="space-y-1.5 min-w-[160px]">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                              <span>{b.checkIn}</span>
                              <span className="text-slate-400">→</span>
                              <span>{b.checkOut}</span>
                            </div>

                            {/* Duration Indicator */}
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-slate-600">
                                {duration.totalNights} {duration.totalNights === 1 ? 'Night' : 'Nights'}
                              </span>
                              <span className="text-slate-400 font-mono text-[10px]">
                                {duration.badgeText}
                              </span>
                            </div>

                            {/* Mini Progress Bar */}
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  b.status === 'Checked-Out'
                                    ? 'bg-emerald-600'
                                    : b.status === 'Checked-In'
                                    ? duration.isOverstay
                                      ? 'bg-rose-500'
                                      : 'bg-amber-500'
                                    : b.status === 'Cancelled'
                                    ? 'bg-slate-300'
                                    : 'bg-blue-400'
                                }`}
                                style={{ width: `${b.status === 'Cancelled' ? 100 : duration.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 5. Total Billed Amount */}
                        <td className="px-5 py-4 text-right">
                          <div className="space-y-0.5 font-mono">
                            <span className="text-sm font-black text-[#1b4332] block">
                              ₹{Number(b.finalBilledAmount || b.totalAmount).toLocaleString()}
                            </span>
                            {b.extraCharges > 0 && (
                              <span className="text-[10px] text-amber-700 block">
                                +₹{Number(b.extraCharges).toLocaleString()} extras
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 block font-sans">
                              {b.paymentSettled ? 'Settled' : 'Billed'}
                            </span>
                          </div>
                        </td>

                        {/* 6. Booking Status Badge */}
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{badge.label}</span>
                          </span>
                        </td>

                        {/* 7. Action Controls */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Full Dossier */}
                            <button
                              onClick={() => setSelectedBookingForDetails(b)}
                              type="button"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-[#1b4332] transition cursor-pointer"
                              title="View Full Booking Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Cancel Booking Action (if eligible) */}
                            {(b.status === 'Confirmed' || b.status === 'Checked-In') && (
                              <button
                                onClick={() => setBookingToCancel(b)}
                                type="button"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Cancel Reservation & Release Room"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <p className="text-base font-bold text-slate-800">No booking records found</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        No reservations match your search query or selected date/status filters.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedStatus('All')
                          setDateFilterType('all')
                          setCustomStartDate('')
                          setCustomEndDate('')
                          setSearchQuery('')
                        }}
                        className="mt-4 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#1b4332] hover:bg-[#133225] transition cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Showing{' '}
                <strong>
                  {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredBookings.length)} -{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)}
                </strong>{' '}
                of <strong>{filteredBookings.length}</strong> reservations
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#1b4332] text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Booking Detail Dossier Modal */}
      <BookingHistoryDetailModal
        isOpen={Boolean(selectedBookingForDetails)}
        onClose={() => setSelectedBookingForDetails(null)}
        booking={selectedBookingForDetails}
        onOpenCancel={(b) => setBookingToCancel(b)}
      />

      {/* Cancel Reservation Modal */}
      <CancelHistoryModal
        isOpen={Boolean(bookingToCancel)}
        onClose={() => setBookingToCancel(null)}
        onConfirm={handleConfirmCancel}
        booking={bookingToCancel}
      />
    </div>
  )
}
