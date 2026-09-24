import { useState } from 'react'
import {
  X,
  Printer,
  Calendar,
  User,
  BedDouble,
  ShieldCheck,
  CheckCircle2,
  Clock,
  LogOut,
  Ban,
  Sparkles,
  Mail,
  Phone,
  Check,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useBookings } from '../../context/BookingContext'
import HotelookLogo from '../layout/HotelookLogo'

export default function BookingDetailsModal({ isOpen, onClose, booking }) {
  const { updateStatus } = useBookings()
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  if (!isOpen || !booking) return null

  const handleStatusChange = async (newStatus) => {
    if (booking.status === newStatus) return
    setIsUpdatingStatus(true)
    try {
      await updateStatus(booking.id, newStatus)
      toast.success(`Booking status changed to ${newStatus}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update status.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handlePrint = () => {
    window.print()
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
          icon: Sparkles,
        }
    }
  }

  const statusConfig = getStatusBadge(booking.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8 print:shadow-none print:border-none print:m-0">
        {/* Header Action Bar */}
        <div className="bg-[#1b4332] text-white p-6 sm:p-7 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <HotelookLogo size="md" />
            <div>
              <h2 className="text-xl font-bold tracking-tight">Reservation Voucher</h2>
              <p className="text-xs text-emerald-200/80 font-mono mt-0.5">
                Ref: {booking.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Print voucher slip"
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

        {/* Print-only brand banner */}
        <div className="hidden print:flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <HotelookLogo size="md" />
          </div>
          <div className="text-right">
            <h1 className="text-lg font-bold text-slate-900">HOTELOOK RESERVATION SLIP</h1>
            <p className="text-xs text-slate-500 font-mono">Reference: {booking.id}</p>
          </div>
        </div>

        {/* Voucher Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Status & Reference Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Booking Reference
              </span>
              <p className="text-base sm:text-lg font-black font-mono text-slate-900 mt-0.5">
                {booking.id}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${statusConfig.bg}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{booking.status}</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">
                Booked on {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Guest & Room Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guest Information Card */}
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <User className="w-4 h-4 text-[#1b4332]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Guest Particulars
                </h3>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Primary Guest Name</span>
                  <p className="text-sm font-extrabold text-slate-900">{booking.guestName}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{booking.guestEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{booking.guestPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified ID Proof: {booking.guestIdProof}</span>
                </div>
              </div>
            </div>

            {/* Room Information Card */}
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <BedDouble className="w-4 h-4 text-[#1b4332]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Assigned Accommodation
                </h3>
              </div>
              <div className="flex items-center gap-3.5">
                <img
                  src={booking.roomImage}
                  alt={booking.roomNumber}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">
                      Room #{booking.roomNumber}
                    </span>
                    <span className="text-[10px] font-bold bg-[#1b4332]/10 text-[#1b4332] px-2 py-0.5 rounded-full">
                      Tier 1
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{booking.roomType}</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-0.5">
                    ₹{Number(booking.pricePerNight).toLocaleString()}{' '}
                    <span className="font-normal text-slate-400">/ night</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stay Timeline & Duration */}
          <div className="p-5 rounded-2xl bg-[#f4f7f4] border border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332]">
                Stay Duration Timeline
              </span>
              <span className="text-xs font-black bg-[#1b4332] text-white px-3 py-1 rounded-full">
                {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Check-In Date</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{booking.checkIn}</span>
                  <span className="text-xs text-slate-400 font-normal">(From 2:00 PM)</span>
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Check-Out Date</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>{booking.checkOut}</span>
                  <span className="text-xs text-slate-400 font-normal">(Until 11:00 AM)</span>
                </p>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
                <strong className="text-slate-800">Special Notes:</strong> {booking.specialRequests}
              </div>
            )}
          </div>

          {/* Itemized Financial Bill */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Itemized Financial Charges
            </h4>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Room Charges (₹{Number(booking.pricePerNight).toLocaleString()} × {booking.nights}{' '}
                {booking.nights === 1 ? 'night' : 'nights'})
              </span>
              <span className="font-bold text-slate-800 font-mono">
                ₹{Number(booking.subtotal).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Government Hotel Tax & GST (12%)</span>
              <span className="font-bold text-slate-800 font-mono">
                ₹{Number(booking.tax).toLocaleString()}
              </span>
            </div>

            <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 block">Total Amount Paid / Due</span>
                <span className="text-[10px] text-slate-400">All applicable taxes included</span>
              </div>
              <span className="text-2xl font-black text-[#1b4332] font-mono">
                ₹{Number(booking.totalAmount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Status Switcher (Interactive Front-Desk Control) */}
          <div className="pt-2 print:hidden space-y-3">
            <label className="text-xs font-bold text-slate-700 block">
              Manage Booking Lifecycle Status:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { status: 'Confirmed', label: 'Confirmed' },
                { status: 'Checked-In', label: 'Checked-In' },
                { status: 'Checked-Out', label: 'Checked-Out' },
                { status: 'Cancelled', label: 'Cancel' },
              ].map((btn) => {
                const isActive = booking.status === btn.status
                return (
                  <button
                    key={btn.status}
                    type="button"
                    disabled={isUpdatingStatus || isActive}
                    onClick={() => handleStatusChange(btn.status)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#1b4332] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{btn.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between print:hidden">
          <p className="text-xs text-slate-400">
            Hotelook Management System • Double Booking Protection Verified
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
