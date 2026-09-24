import { useState } from 'react'
import {
  X,
  KeyRound,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  BedDouble,
  UserCheck,
  FileText,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useBookings } from '../../context/BookingContext'
import { useRooms } from '../../context/RoomContext'
import { useAuth } from '../../context/AuthContext'
import { calculateStayDuration } from '../../services/bookingApi'

export default function CheckInModal({ isOpen, onClose, booking, onSuccess }) {
  const { checkInGuest } = useBookings()
  const { updateRoomAvailability } = useRooms()
  const { user } = useAuth()

  const [keycardNumber, setKeycardNumber] = useState('')
  const [idVerified, setIdVerified] = useState(true)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !booking) return null

  // Default keycard if not yet set
  const defaultKeycard = keycardNumber || `KC-${booking.roomNumber || '101'}`

  // Calculate Stay Duration metrics
  const duration = calculateStayDuration(
    booking.checkIn,
    booking.checkOut,
    booking.actualCheckIn,
    booking.actualCheckOut,
    'Confirmed'
  )

  const handleCheckIn = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Process Check-In in BookingContext
      await checkInGuest(booking.id, {
        keycardNumber: defaultKeycard,
        idVerified,
        notes: notes.trim(),
        checkedInBy: user?.name || 'Front Desk Staff',
        actualCheckIn: new Date().toISOString(),
      })

      // 2. Synchronize Room Availability to 'Occupied'
      if (booking.roomId) {
        await updateRoomAvailability(booking.roomId, 'Occupied')
      }

      toast.success(
        `Check-in complete! ${booking.guestName} assigned to Room #${booking.roomNumber} (Key: ${defaultKeycard}).`,
        { icon: '🔑' }
      )

      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to complete check-in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-[#1b4332] text-white p-6 sm:p-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/20 shadow-inner">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200">
                  Guest Arrival
                </span>
                <span className="text-xs text-emerald-200/80 font-mono">
                  Ref: {booking.id}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                Front-Desk Check-In
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleCheckIn} className="p-6 sm:p-8 space-y-6">
          {/* Guest & Room Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guest Profile Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Guest
              </span>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {booking.guestName ? booking.guestName[0].toUpperCase() : 'G'}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-sm truncate">
                    {booking.guestName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{booking.guestEmail}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{booking.guestPhone}</p>
                </div>
              </div>
              {booking.guestIdProof && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Govt ID Proof:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {booking.guestIdProof}
                  </span>
                </div>
              )}
            </div>

            {/* Room Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Assigned Accommodations
              </span>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1b4332] flex items-center justify-center shrink-0">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-900 text-base">
                    Room #{booking.roomNumber}
                  </p>
                  <p className="text-xs font-medium text-slate-600 truncate">
                    {booking.roomType}
                  </p>
                  <p className="text-xs font-bold text-[#1b4332] mt-0.5">
                    ₹{Number(booking.pricePerNight || 0).toLocaleString()} / night
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">Live Status Transition:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Available → Occupied
                </span>
              </div>
            </div>
          </div>

          {/* Stay Duration Metric Banner */}
          <div className="p-4 rounded-2xl bg-[#1b4332]/5 border border-[#1b4332]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Scheduled Duration of Stay</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">
                  {duration.displayText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 sm:border-l sm:border-slate-200 sm:pl-4">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Check-In</span>
                <span className="font-semibold text-slate-800">{booking.checkIn}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Check-Out</span>
                <span className="font-semibold text-slate-800">{booking.checkOut}</span>
              </div>
            </div>
          </div>

          {/* Operational Check-In Controls */}
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Keycard Assignment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#1b4332]" />
                  <span>Issue RFID Keycard *</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={keycardNumber || defaultKeycard}
                    onChange={(e) => setKeycardNumber(e.target.value)}
                    placeholder="e.g. KC-101"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    Active
                  </span>
                </div>
              </div>

              {/* ID Verification Checkbox */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Identity Verification</span>
                </label>
                <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={idVerified}
                    onChange={(e) => setIdVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1b4332] focus:ring-[#1b4332] border-slate-300"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">ID Verified at Counter</span>
                    <span className="text-[11px] text-slate-500">Government ID physically verified</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Check-In Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Front-Desk Check-In Notes (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Guest requested luggage assistance; advised breakfast timings (7 AM - 10:30 AM)..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#1b4332] hover:bg-[#133225] shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Complete Check-In</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
