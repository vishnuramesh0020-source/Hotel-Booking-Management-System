import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  ArrowUpDown,
  RotateCcw,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  Ban,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useBookings } from '../../context/BookingContext'
import Navbar from '../../components/layout/Navbar'
import NewBookingModal from '../../components/bookings/NewBookingModal'
import BookingDetailsModal from '../../components/bookings/BookingDetailsModal'
import CancelBookingModal from '../../components/bookings/CancelBookingModal'

const ITEMS_PER_PAGE = 8

export default function BookingList() {
  const { bookings, isLoading, error, loadBookings, cancel } = useBookings()

  // State for filters & search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortBy, setSortBy] = useState('recent')
  const [currentPage, setCurrentPage] = useState(1)

  // State for modals
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false)
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null)
  const [bookingToCancel, setBookingToCancel] = useState(null)

  // Summary Metrics
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === 'Confirmed').length,
      checkedIn: bookings.filter((b) => b.status === 'Checked-In').length,
      checkedOut: bookings.filter((b) => b.status === 'Checked-Out').length,
      cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
    }
  }, [bookings])

  // Filtered and sorted bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings]

    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.guestName.toLowerCase().includes(q) ||
          b.guestEmail.toLowerCase().includes(q) ||
          String(b.roomNumber).toLowerCase().includes(q) ||
          b.roomType.toLowerCase().includes(q)
      )
    }

    // 2. Status filter
    if (selectedStatus !== 'All') {
      result = result.filter((b) => b.status === selectedStatus)
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'checkIn-asc':
          return new Date(a.checkIn) - new Date(b.checkIn)
        case 'checkIn-desc':
          return new Date(b.checkIn) - new Date(a.checkIn)
        case 'amount-desc':
          return Number(b.totalAmount || 0) - Number(a.totalAmount || 0)
        case 'amount-asc':
          return Number(a.totalAmount || 0) - Number(b.totalAmount || 0)
        case 'recent':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }
    })

    return result
  }, [bookings, searchQuery, selectedStatus, sortBy])

  // Pagination calculation
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredBookings, currentPage])

  // Filter helpers
  const handleFilterChange = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedStatus('All')
    setSortBy('recent')
    setCurrentPage(1)
  }

  const isFilterActive =
    searchQuery.trim() !== '' || selectedStatus !== 'All' || sortBy !== 'recent'

  const handleConfirmCancel = async (id) => {
    try {
      await cancel(id)
      toast.success(`Booking ${id} has been cancelled and room inventory released.`)
    } catch (err) {
      toast.error(err.message || 'Failed to cancel reservation.')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
        }
      case 'Checked-In':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          icon: Clock,
        }
      case 'Checked-Out':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
          icon: LogOut,
        }
      case 'Cancelled':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          icon: Ban,
        }
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: CheckCircle2,
        }
    }
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
                Room Booking Engine
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Double-Booking Guard Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Reservations & Front Desk
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Book guest rooms, view itemized invoices in ₹, manage check-in/out, and prevent room overlap.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewBookingOpen(true)}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#1b4332] hover:bg-[#133225] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Reservation</span>
            </button>
          </div>
        </div>

        {/* Booking Summary KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Bookings</p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">In-House Stays</p>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-600">{stats.checkedIn}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Upcoming Confirmed</p>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">{stats.confirmed}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Cancelled</p>
              <p className="text-xl sm:text-2xl font-extrabold text-rose-600">{stats.cancelled}</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                placeholder="Search by Reference ID, Guest Name, Room #, or Email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => handleFilterChange(setSearchQuery, '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleFilterChange(setSelectedStatus, e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 border-none outline-none cursor-pointer focus:ring-0 pr-2"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="Checked-Out">Checked-Out</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Sort By Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 border-none outline-none cursor-pointer focus:ring-0 pr-2"
                >
                  <option value="recent">Recently Booked</option>
                  <option value="checkIn-asc">Check-In (Earliest First)</option>
                  <option value="checkIn-desc">Check-In (Latest First)</option>
                  <option value="amount-desc">Total Amount (High to Low)</option>
                  <option value="amount-asc">Total Amount (Low to High)</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              {isFilterActive && (
                <button
                  onClick={handleResetFilters}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Indicators */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredBookings.length}</strong> of{' '}
              {bookings.length} total reservations
            </span>
            {isFilterActive && (
              <span className="text-[#1b4332] font-semibold bg-[#1b4332]/5 px-2 py-0.5 rounded-full">
                Filters applied
              </span>
            )}
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-48" />
                    <div className="h-3 bg-slate-200 rounded w-32" />
                  </div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-24 hidden sm:block" />
                <div className="h-8 bg-slate-200 rounded-full w-20" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-900">Failed to Load Reservations</h3>
              <p className="text-xs text-rose-600 mt-1">{error}</p>
            </div>
            <button
              onClick={loadBookings}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredBookings.length === 0 && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-800">No reservations found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No bookings matched your search query or filter parameters. Try adjusting your filters.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-[#1b4332] bg-[#1b4332]/10 hover:bg-[#1b4332]/20 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Bookings Directory Table */}
        {!isLoading && !error && filteredBookings.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#f7f7f2] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Booking Ref</th>
                      <th className="py-4 px-6">Guest Details</th>
                      <th className="py-4 px-6">Room</th>
                      <th className="py-4 px-6">Stay Dates</th>
                      <th className="py-4 px-6">Total Amount</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {paginatedBookings.map((b) => {
                      const statusBadge = getStatusBadge(b.status)
                      const StatusIcon = statusBadge.icon

                      return (
                        <tr key={b.id} className="hover:bg-slate-50/80 transition-colors group">
                          {/* Booking Ref */}
                          <td className="py-4 px-6 font-mono font-bold text-xs text-slate-800">
                            {b.id}
                          </td>

                          {/* Guest */}
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-extrabold text-slate-900 group-hover:text-[#1b4332] transition-colors leading-snug">
                                {b.guestName}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                                {b.guestEmail}
                              </p>
                            </div>
                          </td>

                          {/* Room */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={b.roomImage}
                                alt={b.roomNumber}
                                className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <span className="font-extrabold text-slate-900 text-xs block">
                                  Room #{b.roomNumber}
                                </span>
                                <span className="text-[11px] text-slate-500 truncate block max-w-[130px]">
                                  {b.roomType}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Dates & Nights */}
                          <td className="py-4 px-6">
                            <div className="space-y-0.5">
                              <p className="text-xs font-semibold text-slate-800">
                                {b.checkIn} → {b.checkOut}
                              </p>
                              <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                              </span>
                            </div>
                          </td>

                          {/* Total Amount in ₹ */}
                          <td className="py-4 px-6">
                            <p className="font-extrabold text-sm text-[#1b4332] font-mono">
                              ₹{Number(b.totalAmount).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">Incl. 12% GST</p>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              <span>{b.status}</span>
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedBookingForDetails(b)}
                                type="button"
                                className="p-2 rounded-full text-slate-600 hover:text-[#1b4332] hover:bg-slate-100 transition cursor-pointer"
                                title="View Reservation Voucher"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {b.status !== 'Cancelled' && (
                                <button
                                  onClick={() => setBookingToCancel(b)}
                                  type="button"
                                  className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  title="Cancel Reservation"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
                  <strong className="text-slate-800">{totalPages}</strong> (
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} of{' '}
                  {filteredBookings.length} bookings)
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-[#1b4332] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* New Booking Modal */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
      />

      {/* Booking Details / Voucher Modal */}
      <BookingDetailsModal
        isOpen={Boolean(selectedBookingForDetails)}
        onClose={() => setSelectedBookingForDetails(null)}
        booking={selectedBookingForDetails}
      />

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={Boolean(bookingToCancel)}
        onClose={() => setBookingToCancel(null)}
        onConfirm={handleConfirmCancel}
        booking={bookingToCancel}
      />
    </div>
  )
}
