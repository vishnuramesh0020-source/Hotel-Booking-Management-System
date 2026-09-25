import { useState } from 'react'
import { AlertTriangle, Ban, X } from 'lucide-react'

const CANCELLATION_REASONS = [
  'Guest Requested (Schedule Change)',
  'Travel / Flight Cancellation',
  'Medical / Personal Emergency',
  'Duplicate Reservation',
  'Guest No-Show',
  'Front-Desk Administrative Adjustment',
]

export default function CancelHistoryModal({
  isOpen,
  onClose,
  onConfirm,
  booking,
}) {
  const [isCancelling, setIsCancelling] = useState(false)
  const [reason, setReason] = useState(CANCELLATION_REASONS[0])
  const [notes, setNotes] = useState('')

  if (!isOpen || !booking) return null

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      await onConfirm(booking.id, `${reason}${notes ? ` - ${notes}` : ''}`)
      onClose()
    } catch (err) {
      console.error('Cancel failed:', err)
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex-shrink-0 bg-rose-600 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100">
                Cancel Reservation
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {booking.id}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isCancelling}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 space-y-4 text-xs">
          {/* Warning Banner */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-950">Release Room Inventory</p>
              <p className="text-[11px] text-rose-800 mt-0.5">
                Cancelling will release Room #{booking.roomNumber} back to Available and archive this record as Cancelled.
              </p>
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-slate-900">{booking.guestName}</span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Room #{booking.roomNumber}
              </span>
            </div>

            <p className="text-slate-500 truncate">{booking.roomType}</p>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-600">
              <span>Dates:</span>
              <span className="font-semibold text-slate-800">
                {booking.checkIn} to {booking.checkOut} ({booking.nights} nights)
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Billed Amount:</span>
              <span className="font-mono font-bold text-slate-900">
                ₹{Number(booking.totalAmount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Cancellation Reason <span className="text-rose-600">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition cursor-pointer"
            >
              {CANCELLATION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Additional Front-Desk Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Guest called desk directly; waived cancellation penalty..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex-shrink-0 p-4 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
          >
            Keep Reservation
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isCancelling ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Ban className="w-3.5 h-3.5" />
            )}
            <span>{isCancelling ? 'Processing...' : 'Confirm Cancellation'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
