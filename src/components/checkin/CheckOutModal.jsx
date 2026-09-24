import { useState } from 'react'
import {
  X,
  LogOut,
  CheckCircle2,
  Calendar,
  BedDouble,
  AlertTriangle,
  FileText,
  KeyRound,
  ShieldCheck,
  Receipt,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useBookings } from '../../context/BookingContext'
import { useRooms } from '../../context/RoomContext'
import { useAuth } from '../../context/AuthContext'
import { calculateStayDuration } from '../../services/bookingApi'

export default function CheckOutModal({ isOpen, onClose, booking, onSuccess }) {
  const { checkOutGuest } = useBookings()
  const { updateRoomAvailability } = useRooms()
  const { user } = useAuth()

  const [keycardReturned, setKeycardReturned] = useState(true)
  const [roomCondition, setRoomCondition] = useState('Good')
  const [extraCharges, setExtraCharges] = useState(0)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !booking) return null

  // Calculate Stay Duration metrics
  const duration = calculateStayDuration(
    booking.checkIn,
    booking.checkOut,
    booking.actualCheckIn,
    new Date().toISOString(),
    'Checked-In'
  )

  const baseTotal = Number(booking.totalAmount || 0)
  const additionals = Number(extraCharges || 0)
  const grandTotal = baseTotal + additionals

  const handleCheckOut = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Process Check-Out in BookingContext
      await checkOutGuest(booking.id, {
        actualCheckOut: new Date().toISOString(),
        keycardReturned,
        roomCondition,
        extraCharges: additionals,
        notes: notes.trim(),
        checkedOutBy: user?.name || 'Front Desk Staff',
      })

      // 2. Synchronize Room Availability to 'Available'
      if (booking.roomId) {
        await updateRoomAvailability(booking.roomId, 'Available')
      }

      toast.success(
        `Check-out finalized for ${booking.guestName}! Room #${booking.roomNumber} is now Available.`,
        { icon: '🛎️' }
      )

      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to complete check-out.')
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
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/20 shadow-inner">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200">
                  Guest Departure & Billing
                </span>
                <span className="text-xs text-emerald-200/80 font-mono">
                  Ref: {booking.id}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                Front-Desk Check-Out
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
        <form onSubmit={handleCheckOut} className="p-6 sm:p-8 space-y-6">
          {/* Overstay Warning Banner if applicable */}
          {duration.isOverstay && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start gap-3 text-rose-900 animate-in fade-in duration-150">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-rose-950">Overstay Alert Detected</p>
                <p className="mt-0.5 text-rose-800">
                  Guest was scheduled to check out on <strong>{booking.checkOut}</strong> (
                  {duration.overstayDays} {duration.overstayDays === 1 ? 'day' : 'days'} ago). Please review incidental or late checkout fees below.
                </p>
              </div>
            </div>
          )}

          {/* Guest & Room Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guest Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Departing Guest
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
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">Issued Keycard:</span>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {booking.keycardNumber || 'KC-' + booking.roomNumber}
                </span>
              </div>
            </div>

            {/* Room Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Room to Release
              </span>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
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
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Occupied → Available
                </span>
              </div>
            </div>
          </div>

          {/* Stay Duration Metric Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Stay Duration Breakdown</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">
                  {duration.displayText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 sm:border-l sm:border-slate-200 sm:pl-4">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Checked-In At</span>
                <span className="font-semibold text-slate-800">
                  {booking.actualCheckIn
                    ? new Date(booking.actualCheckIn).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : booking.checkIn}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Checkout Today</span>
                <span className="font-semibold text-slate-800">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Check-Out Verifications & Extra Charges */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Keycard Return */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#1b4332]" />
                  <span>Keycard Returned</span>
                </label>
                <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keycardReturned}
                    onChange={(e) => setKeycardReturned(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1b4332] focus:ring-[#1b4332] border-slate-300"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">RFID Keycard Returned</span>
                    <span className="text-[11px] text-slate-500">Handed back to front-desk</span>
                  </div>
                </label>
              </div>

              {/* Room Condition Inspection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Room Inspection State</span>
                </label>
                <select
                  value={roomCondition}
                  onChange={(e) => setRoomCondition(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b4332] transition cursor-pointer"
                >
                  <option value="Good">Good Condition (Standard Turnover)</option>
                  <option value="Requires Deep Cleaning">Requires Deep Cleaning</option>
                  <option value="Minor Damage">Minor Damage / Maintenance Needed</option>
                </select>
              </div>
            </div>

            {/* Incidental / Extra Charges Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-slate-400" />
                  <span>Incidental / Extra Charges (₹)</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Mini-bar, laundry, room service, late fee
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={extraCharges}
                  onChange={(e) => setExtraCharges(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
                />
              </div>
            </div>

            {/* Checkout Settlement Summary Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Final Settlement Billing
              </span>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Room Charges & Taxes (Pre-calculated):</span>
                <span className="font-mono font-bold text-slate-800">
                  ₹{baseTotal.toLocaleString()}
                </span>
              </div>
              {additionals > 0 && (
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Incidentals & Service Additions:</span>
                  <span className="font-mono font-bold text-amber-700">
                    + ₹{additionals.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Total Final Invoice</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Payment Settled at Desk</span>
                </div>
                <span className="text-xl font-black text-[#1b4332] font-mono">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Front-Desk Departure Notes (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Guest settled bill with corporate card; baggage stored in cloakroom until 4 PM..."
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
              <span>Complete Check-Out & Release Room</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
