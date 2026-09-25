import { useState, useEffect } from 'react'
import {
  CalendarDays,
  Search,
  CheckCircle2,
  Clock,
  LogOut,
  Filter,
} from 'lucide-react'
import { RECENT_BOOKINGS } from '../../services/dashboardData'
import { toast } from 'react-toastify'
import { useBookings } from '../../context/BookingContext'

export default function RecentBookings({ bookings: propBookings }) {
  const bookingCtx = useBookings()
  const [bookings, setBookings] = useState(propBookings || RECENT_BOOKINGS)
  const [filterTab, setFilterTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (propBookings && propBookings.length > 0) {
      setBookings(propBookings)
    }
  }, [propBookings])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200'
      case 'Confirmed':
        return 'bg-sky-50 text-sky-800 border-sky-200'
      case 'Checked-Out':
        return 'bg-slate-100 text-slate-700 border-slate-200'
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    if (bookingCtx && bookingCtx.updateStatus) {
      try {
        await bookingCtx.updateStatus(id, newStatus)
      } catch (err) {
        console.error('Failed to update status in BookingContext:', err)
      }
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
    toast.success(`Booking ${id} status updated to "${newStatus}"!`)
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesTab = filterTab === 'All' || b.status === filterTab
    const guestName = b.guest?.name || b.guestName || 'Guest'
    const roomNumber = String(b.roomNumber || '')
    const roomType = b.roomType || ''
    const id = String(b.id || '')

    const matchesSearch =
      guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Recent Bookings
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time reservations, guest arrivals, and status logs
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guest or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm focus:outline-none focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/10 transition"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {['All', 'Confirmed', 'Checked-In', 'Pending', 'Checked-Out'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilterTab(tab)}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterTab === tab
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List / Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 pl-2">Guest & ID</th>
              <th className="pb-3">Room</th>
              <th className="pb-3">Stay Dates</th>
              <th className="pb-3">Total Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-2 text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  No reservations found matching "{searchQuery}" in category "{filterTab}".
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => {
                const guestName = b.guest?.name || b.guestName || 'Guest'
                const guestEmail = b.guest?.email || b.guestEmail || ''
                const avatarColor = b.guest?.avatarColor || 'bg-[#1b4332]'
                const displayAmount =
                  b.amount || `₹${Number(b.finalBilledAmount || b.totalAmount || 0).toLocaleString()}`

                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Guest Info */}
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-xs ${avatarColor}`}
                        >
                          {guestName[0]?.toUpperCase() || 'G'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{guestName}</p>
                          <p className="text-[11px] text-slate-400">
                            {b.id} {guestEmail ? `• ${guestEmail}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Room Details */}
                    <td className="py-3.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-xs mr-1.5">
                        #{b.roomNumber}
                      </span>
                      <span className="text-slate-600 font-medium">{b.roomType}</span>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5">
                      <p className="text-slate-900 font-semibold">{b.checkIn}</p>
                      <p className="text-[11px] text-slate-400">
                        to {b.checkOut} ({b.nights || 1} nights)
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5">
                      <span className="font-extrabold text-slate-900 text-sm">{displayAmount}</span>
                    </td>

                  {/* Status Badge */}
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        b.status
                      )}`}
                    >
                      {b.status === 'Checked-In' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {b.status === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                      {b.status === 'Checked-Out' && <LogOut className="w-3 h-3 text-slate-500" />}
                      {b.status}
                    </span>
                  </td>

                  {/* Quick Action Button */}
                  <td className="py-3.5 pr-2 text-right">
                    {b.status === 'Pending' || b.status === 'Confirmed' ? (
                      <button
                        onClick={() => handleStatusChange(b.id, 'Checked-In')}
                        type="button"
                        className="px-3 py-1 rounded-full bg-[#1b4332] hover:bg-[#143729] text-white text-[11px] font-semibold transition cursor-pointer"
                      >
                        Check In
                      </button>
                    ) : b.status === 'Checked-In' ? (
                      <button
                        onClick={() => handleStatusChange(b.id, 'Checked-Out')}
                        type="button"
                        className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold transition cursor-pointer"
                      >
                        Check Out
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              )
            })
          )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
