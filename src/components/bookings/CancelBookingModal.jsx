import { useState } from 'react'
import { AlertTriangle, Ban, X, Calendar } from 'lucide-react'

export default function CancelBookingModal({ isOpen, onClose, onConfirm, booking }) {
  const [isCancelling, setIsCancelling] = useState(false)

  if (!isOpen || !booking) return null

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      await onConfirm(booking.id)
      onClose()
    } catch (err) {
      console.error('Cancel failed:', err)
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isCancelling}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Cancel Reservation</h3>
            <p className="text-xs text-slate-500 mt-0.5">Release room inventory and update status</p>
          </div>
        </div>

        {/* Booking Info Preview Box */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-xs text-slate-900">{booking.id}</span>
            <span className="text-[11px] font-bold text-[#1b4332] bg-[#1b4332]/10 px-2 py-0.5 rounded-full">
              Room #{booking.roomNumber}
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-800">
            Guest: {booking.guestName}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {booking.checkIn} to {booking.checkOut} ({booking.nights} nights)
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between text-xs">
            <span className="text-slate-500">Total Refundable / Due:</span>
            <span className="font-bold text-slate-900 font-mono">
              ₹{Number(booking.totalAmount).toLocaleString()}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Are you sure you want to cancel reservation{' '}
          <strong className="text-slate-900 font-semibold">{booking.id}</strong>? Room #
          {booking.roomNumber} will become immediately available for new bookings.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            Keep Reservation
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isCancelling ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Ban className="w-4 h-4" />
            )}
            <span>{isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
