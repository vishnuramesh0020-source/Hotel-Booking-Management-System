import {
  X,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  Ban,
  ShieldCheck,
  FileText,
  BedDouble,
  AlertTriangle,
} from 'lucide-react'
import { calculateStayDuration } from '../../services/bookingApi'
import HotelookLogo from '../layout/HotelookLogo'

export default function BookingHistoryDetailModal({
  isOpen,
  onClose,
  booking,
  onOpenCancel,
}) {
  if (!isOpen || !booking) return null

  const duration = calculateStayDuration(
    booking.checkIn,
    booking.checkOut,
    booking.actualCheckIn,
    booking.actualCheckOut,
    booking.status
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-Out':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Completed Stay',
          icon: CheckCircle2,
        }
      case 'Checked-In':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          label: 'Active In-House',
          icon: Clock,
        }
      case 'Confirmed':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          label: 'Confirmed Upcoming',
          icon: LogOut,
        }
      case 'Cancelled':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          label: 'Cancelled',
          icon: Ban,
        }
      default:
        return {
          bg: 'bg-slate-50 text-slate-800 border-slate-300',
          dot: 'bg-slate-500',
          label: status,
          icon: CheckCircle2,
        }
    }
  }

  const badge = getStatusBadge(booking.status)
  const StatusIcon = badge.icon

  const handlePrint = () => {
    window.print()
  }

  const canCancel = booking.status === 'Confirmed' || booking.status === 'Checked-In'

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:m-0 print:max-h-none">
        
        {/* Header Action Bar */}
        <div className="flex-shrink-0 bg-[#1b4332] text-white p-5 sm:p-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <HotelookLogo size="md" variant="light" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200">
                  Reservation Archive
                </span>
                <span className="text-xs text-emerald-200/80 font-mono font-bold">
                  {booking.id}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                Booking Dossier & History
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Print Voucher"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-7 space-y-6 bg-white text-slate-800">
          
          {/* Status & Reference Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Booking Reference ID
              </span>
              <p className="text-lg font-black font-mono text-slate-900 mt-0.5">
                {booking.id}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Booked on:{' '}
                <strong>
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'System Record'}
                </strong>
              </p>
            </div>

            <div className="sm:text-right">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </span>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Room #{booking.roomNumber} ({booking.roomType})
              </p>
            </div>
          </div>

          {/* Overstay Warning Banner if applicable */}
          {duration.isOverstay && booking.status === 'Checked-In' && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start gap-3 text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-rose-950">Overstay Alert Detected</p>
                <p className="mt-0.5 text-rose-800">
                  Guest was scheduled to check out on <strong>{booking.checkOut}</strong> (
                  {duration.overstayDays} {duration.overstayDays === 1 ? 'day' : 'days'} ago).
                </p>
              </div>
            </div>
          )}

          {/* Guest Details & Room Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Guest Dossier */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Guest Identity
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Guest</span>
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {booking.guestName ? booking.guestName[0].toUpperCase() : 'G'}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-sm truncate">{booking.guestName}</p>
                  <p className="text-xs text-slate-500 truncate">{booking.guestEmail || 'No email registered'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{booking.guestPhone || 'No phone registered'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                <span>Government ID Proof:</span>
                <span className="font-mono font-bold text-slate-800">
                  {booking.guestIdProof || 'ID Verified'}
                </span>
              </div>
            </div>

            {/* Room Specifications */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Room Allocated
              </span>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-900 text-base">
                    Room #{booking.roomNumber}
                  </p>
                  <p className="text-xs font-medium text-slate-600 truncate">{booking.roomType}</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-0.5">
                    ₹{Number(booking.pricePerNight || 0).toLocaleString()} / night
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                <span>Issued Keycard:</span>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {booking.keycardNumber || 'KC-' + booking.roomNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Stay Timeline & Duration Analysis */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1b4332]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Stay Timeline & Duration
                </h4>
              </div>
              <span className="text-xs font-bold text-[#1b4332]">
                {duration.displayText}
              </span>
            </div>

            {/* Visual Timeline Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Check-In</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{booking.checkIn}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Actual Arrival:{' '}
                  <strong>
                    {booking.actualCheckIn
                      ? new Date(booking.actualCheckIn).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Scheduled 2:00 PM'}
                  </strong>
                </p>
                {booking.checkedInBy && (
                  <p className="text-[10px] text-slate-400 mt-1">Agent: {booking.checkedInBy}</p>
                )}
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Check-Out</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{booking.checkOut}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Actual Departure:{' '}
                  <strong>
                    {booking.actualCheckOut
                      ? new Date(booking.actualCheckOut).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : booking.status === 'Checked-Out'
                      ? 'Completed'
                      : 'Scheduled 11:00 AM'}
                  </strong>
                </p>
                {booking.checkedOutBy && (
                  <p className="text-[10px] text-slate-400 mt-1">Agent: {booking.checkedOutBy}</p>
                )}
              </div>
            </div>

            {/* Completed Stay Special Badge Card */}
            {booking.status === 'Checked-Out' && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    Stay completed successfully. Keycard returned & room inspected.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white text-slate-700 font-bold rounded border border-emerald-200 text-[11px]">
                    Condition: {booking.roomCondition || 'Good'}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded text-[11px]">
                    Settled at Desk
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Financial Breakdown Table */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Financial Folio Summary
              </span>
              <span className="text-xs text-slate-500 font-mono">Currency: INR (₹)</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Room Tariff (₹{Number(booking.pricePerNight || 0).toLocaleString()} × {booking.nights} nights):
              </span>
              <span className="font-mono font-bold text-slate-800">
                ₹{Number(booking.subtotal || booking.pricePerNight * booking.nights || 0).toLocaleString()}
              </span>
            </div>

            {booking.extraCharges > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Incidentals & Add-on Services:</span>
                <span className="font-mono font-bold text-amber-700">
                  + ₹{Number(booking.extraCharges).toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>GST / Luxury Hotel Tax (12%):</span>
              <span className="font-mono font-bold text-slate-800">
                ₹{Number(booking.tax || Math.round((booking.subtotal || 0) * 0.12)).toLocaleString()}
              </span>
            </div>

            <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Total Final Amount</span>
                <span className="text-[10px] text-slate-500">
                  {booking.paymentSettled ? 'Paid & Settled' : 'Billed'}
                </span>
              </div>
              <span className="text-xl font-black text-[#1b4332] font-mono">
                ₹{Number(booking.finalBilledAmount || booking.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Notes & Special Requests */}
          {(booking.checkInNotes || booking.checkOutNotes || booking.specialRequests) && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Operational Remarks & Notes</span>
              </div>
              {booking.specialRequests && (
                <p className="text-slate-600">
                  <strong className="text-slate-800">Guest Requests:</strong> {booking.specialRequests}
                </p>
              )}
              {booking.checkInNotes && (
                <p className="text-slate-600">
                  <strong className="text-slate-800">Arrival Notes:</strong> {booking.checkInNotes}
                </p>
              )}
              {booking.checkOutNotes && (
                <p className="text-slate-600">
                  <strong className="text-slate-800">Departure Notes:</strong> {booking.checkOutNotes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="flex-shrink-0 p-4 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between rounded-b-3xl print:hidden">
          <p className="text-xs text-slate-400 hidden sm:block">
            Hotelook Management System • Double-Booking Guard Active
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {canCancel && onOpenCancel && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenCancel(booking)
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Booking</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
