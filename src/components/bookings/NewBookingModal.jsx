import { useState, useMemo } from 'react'
import {
  X,
  Calendar,
  User,
  BedDouble,
  AlertTriangle,
  CheckCircle2,
  Search,
  Sparkles,
} from 'lucide-react'
import { useGuests } from '../../context/GuestContext'
import { useRooms } from '../../context/RoomContext'
import { useBookings } from '../../context/BookingContext'
import { calculateBookingFinancials } from '../../services/bookingApi'
import { toast } from 'react-toastify'

export default function NewBookingModal({ isOpen, onClose }) {
  const { guests } = useGuests()
  const { rooms } = useRooms()
  const { addBooking, checkConflict } = useBookings()

  // Default dates: Today and Tomorrow computed safely
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const tomorrowStr = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }, [])

  // Form State
  const [selectedGuestId, setSelectedGuestId] = useState('')
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [guestSearch, setGuestSearch] = useState('')
  const [checkIn, setCheckIn] = useState(todayStr)
  const [checkOut, setCheckOut] = useState(tomorrowStr)
  const [specialRequests, setSpecialRequests] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derive active selected guest & room IDs (falls back to first available if not manually picked)
  const activeGuestId = selectedGuestId || (guests.length > 0 ? guests[0].id : '')
  const activeRoomId = selectedRoomId || (rooms.length > 0 ? rooms[0].id : '')

  // Selected Guest Object
  const selectedGuest = useMemo(() => {
    return guests.find((g) => String(g.id) === String(activeGuestId)) || null
  }, [guests, activeGuestId])

  // Filtered Guest choices for search
  const filteredGuests = useMemo(() => {
    if (!guestSearch.trim()) return guests
    const q = guestSearch.toLowerCase().trim()
    return guests.filter(
      (g) =>
        g.fullName.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.mobileNumber.toLowerCase().includes(q)
    )
  }, [guests, guestSearch])

  // Selected Room Object
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => String(r.id) === String(activeRoomId)) || null
  }, [rooms, activeRoomId])

  // Auto-calculated Financials
  const financials = useMemo(() => {
    if (!selectedRoom) {
      return { nights: 1, subtotal: 0, tax: 0, totalAmount: 0 }
    }
    return calculateBookingFinancials(selectedRoom.pricePerNight, checkIn, checkOut)
  }, [selectedRoom, checkIn, checkOut])

  // Check Double Booking Conflict in Real-Time
  const doubleBookingConflict = useMemo(() => {
    if (!activeRoomId || !checkIn || !checkOut) return null
    return checkConflict(activeRoomId, checkIn, checkOut)
  }, [activeRoomId, checkIn, checkOut, checkConflict])

  // Handle Check-In date change
  const handleCheckInChange = (newCheckIn) => {
    setCheckIn(newCheckIn)
    // If checkOut is now on or before checkIn, move checkOut to checkIn + 1 day
    if (new Date(checkOut) <= new Date(newCheckIn)) {
      const nextDay = new Date(new Date(newCheckIn).getTime() + 86400000)
      setCheckOut(nextDay.toISOString().split('T')[0])
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedGuest) {
      toast.error('Please select a guest.')
      return
    }

    if (!selectedRoom) {
      toast.error('Please select a room.')
      return
    }

    if (doubleBookingConflict) {
      toast.error('Cannot proceed: Selected room is already booked for these dates.')
      return
    }

    setIsSubmitting(true)
    try {
      const bookingPayload = {
        guestId: selectedGuest.id,
        guestName: selectedGuest.fullName,
        guestEmail: selectedGuest.email,
        guestPhone: selectedGuest.mobileNumber,
        guestIdProof: selectedGuest.idProofNumber,
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.roomNumber,
        roomType: selectedRoom.roomType,
        roomImage: selectedRoom.roomImage,
        pricePerNight: selectedRoom.pricePerNight,
        checkIn,
        checkOut,
        specialRequests,
        status: 'Confirmed',
      }

      const created = await addBooking(bookingPayload)
      toast.success(`Reservation ${created.id} confirmed for Room #${selectedRoom.roomNumber}!`, {
        icon: '🏨',
      })
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to create reservation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex-shrink-0 bg-[#1b4332] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/20 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Create Room Reservation</h2>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Assign guest, select room, calculate nights, and prevent double booking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Guest & Stay Dates Selection */}
            <div className="space-y-6">
              {/* 1. Select Guest */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Select Guest *</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {guests.length} Registered Guests
                  </span>
                </label>

                {/* Quick Search */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={guestSearch}
                    onChange={(e) => setGuestSearch(e.target.value)}
                    placeholder="Search guest by name or email..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                  />
                </div>

                <select
                  value={activeGuestId}
                  onChange={(e) => setSelectedGuestId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition cursor-pointer"
                >
                  {filteredGuests.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.fullName} ({g.nationality}) • {g.email}
                    </option>
                  ))}
                </select>

                {/* Selected Guest Preview Pill */}
                {selectedGuest && (
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={selectedGuest.avatar}
                        alt={selectedGuest.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-white shrink-0"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedGuest.fullName)}`
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {selectedGuest.fullName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {selectedGuest.mobileNumber}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#1b4332] bg-[#1b4332]/10 px-2 py-0.5 rounded-full shrink-0">
                      ID: {selectedGuest.idProofNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* 2. Check-In & Check-Out Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Check-In Date *</span>
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={todayStr}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Check-Out Date *</span>
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              {/* Nights Auto-Calculated Badge */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-900">Duration of Stay:</span>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {financials.nights} {financials.nights === 1 ? 'Night' : 'Nights'}
                </span>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Special Requests / Remarks
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Airport pickup, extra pillows, floral arrangement"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
                />
              </div>
            </div>

            {/* Right Column: Room Selection, Double-Booking Warning & Financials */}
            <div className="space-y-6">
              {/* 3. Select Room */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                    <span>Select Room *</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {rooms.length} Total Inventory
                  </span>
                </label>

                <select
                  value={activeRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition cursor-pointer"
                >
                  {rooms.map((r) => {
                    const conflict = checkConflict(r.id, checkIn, checkOut)
                    return (
                      <option key={r.id} value={r.id}>
                        Room #{r.roomNumber} - {r.roomType} (₹{Number(r.pricePerNight).toLocaleString()}/nt)
                        {conflict ? ' ⚠️ [BOOKED]' : ' ✅ [Available]'}
                      </option>
                    )
                  })}
                </select>

                {/* Selected Room Preview Card */}
                {selectedRoom && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                    <img
                      src={selectedRoom.roomImage}
                      alt={selectedRoom.roomNumber}
                      className="w-16 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          Room #{selectedRoom.roomNumber}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                          Floor {selectedRoom.floorNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-0.5">
                        {selectedRoom.roomType}
                      </p>
                      <p className="text-xs font-bold text-[#1b4332] mt-0.5">
                        ₹{Number(selectedRoom.pricePerNight).toLocaleString()}{' '}
                        <span className="font-normal text-slate-400">/ night</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. PREVENT DOUBLE BOOKING WARNING ALERT */}
              {doubleBookingConflict ? (
                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start gap-3 text-rose-900 animate-in fade-in duration-200">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-rose-950">Double-Booking Conflict Detected!</p>
                    <p className="mt-1 leading-relaxed text-rose-800">
                      Room #{selectedRoom?.roomNumber} is already reserved by{' '}
                      <strong>{doubleBookingConflict.guestName}</strong> from{' '}
                      <strong>{doubleBookingConflict.checkIn}</strong> to{' '}
                      <strong>{doubleBookingConflict.checkOut}</strong> (Ref:{' '}
                      {doubleBookingConflict.id}).
                    </p>
                    <p className="mt-1 font-semibold text-rose-700">
                      Please select another room or adjust your check-in/check-out dates.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">
                    Room #{selectedRoom?.roomNumber} is <strong>Available</strong> for the selected
                    dates. No overlap conflicts.
                  </span>
                </div>
              )}

              {/* 5. Itemized Financial Breakdown (in ₹) */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pricing & Summary Breakdown
                </h4>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Base Room Charges (₹
                    {Number(selectedRoom?.pricePerNight || 0).toLocaleString()} ×{' '}
                    {financials.nights} {financials.nights === 1 ? 'night' : 'nights'})
                  </span>
                  <span className="font-bold text-slate-800 font-mono">
                    ₹{financials.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>GST / Luxury Hotel Tax (12%)</span>
                  </span>
                  <span className="font-bold text-slate-800 font-mono">
                    ₹{financials.tax.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Total Amount</span>
                    <span className="text-[10px] text-slate-400">Inclusive of all taxes</span>
                  </div>
                  <span className="text-xl font-black text-[#1b4332] font-mono">
                    ₹{financials.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Action Buttons Sticky Footer */}
          <div className="flex-shrink-0 p-4 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Boolean(doubleBookingConflict)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#1b4332] hover:bg-[#133225] shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Confirming...' : 'Confirm Reservation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
