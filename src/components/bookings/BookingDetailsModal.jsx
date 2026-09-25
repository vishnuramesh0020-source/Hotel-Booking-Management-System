import { useState, useEffect, useMemo } from 'react'
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
  Edit3,
  Save,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useBookings } from '../../context/BookingContext'
import { useRooms } from '../../context/RoomContext'
import { calculateBookingFinancials } from '../../services/bookingApi'
import HotelookLogo from '../layout/HotelookLogo'

export default function BookingDetailsModal({ isOpen, onClose, booking }) {
  const { updateStatus, updateBooking, checkConflict } = useBookings()
  const { updateRoomAvailability } = useRooms()

  const [currentBooking, setCurrentBooking] = useState(booking)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isEditingDates, setIsEditingDates] = useState(false)
  const [editCheckIn, setEditCheckIn] = useState(booking?.checkIn || '')
  const [editCheckOut, setEditCheckOut] = useState(booking?.checkOut || '')
  const [isSavingDates, setIsSavingDates] = useState(false)
  const [dateError, setDateError] = useState('')

  useEffect(() => {
    if (booking) {
      setCurrentBooking(booking)
      setEditCheckIn(booking.checkIn || '')
      setEditCheckOut(booking.checkOut || '')
      setIsEditingDates(false)
      setDateError('')
    }
  }, [booking])

  // Preview financials when adjusting dates
  const previewFinancials = useMemo(() => {
    if (!editCheckIn || !editCheckOut || !currentBooking) return null
    return calculateBookingFinancials(currentBooking.pricePerNight, editCheckIn, editCheckOut)
  }, [currentBooking, editCheckIn, editCheckOut])

  // Conflict validation (Double booking prevention)
  const conflict = useMemo(() => {
    if (!isEditingDates || !editCheckIn || !editCheckOut || !currentBooking) return null
    return checkConflict(currentBooking.roomId, editCheckIn, editCheckOut, currentBooking.id)
  }, [checkConflict, currentBooking, editCheckIn, editCheckOut, isEditingDates])

  if (!isOpen || !currentBooking) return null

  const handleSaveDates = async () => {
    if (!editCheckIn || !editCheckOut) {
      setDateError('Both Check-In and Check-Out dates are required.')
      return
    }
    if (new Date(editCheckOut) <= new Date(editCheckIn)) {
      setDateError('Check-Out date must be strictly after Check-In date.')
      return
    }
    if (conflict) {
      toast.error(`Room #${currentBooking.roomNumber} is already occupied during these dates!`)
      return
    }

    setIsSavingDates(true)
    setDateError('')
    try {
      const updated = await updateBooking(currentBooking.id, {
        checkIn: editCheckIn,
        checkOut: editCheckOut,
      })
      setCurrentBooking(updated)
      setIsEditingDates(false)
      toast.success(
        `Stay dates updated to ${editCheckIn} - ${editCheckOut} (${updated.nights} nights). Invoice recalculated for printing!`,
        { icon: '📅' }
      )
    } catch (err) {
      toast.error(err.message || 'Failed to update stay dates.')
    } finally {
      setIsSavingDates(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    if (currentBooking.status === newStatus) return
    setIsUpdatingStatus(true)
    try {
      await updateStatus(currentBooking.id, newStatus)
      if (currentBooking.roomId && updateRoomAvailability) {
        if (newStatus === 'Checked-In') {
          await updateRoomAvailability(currentBooking.roomId, 'Occupied')
        } else if (newStatus === 'Checked-Out' || newStatus === 'Cancelled') {
          await updateRoomAvailability(currentBooking.roomId, 'Available')
        }
      }
      setCurrentBooking((prev) => ({ ...prev, status: newStatus }))
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

  const statusConfig = getStatusBadge(currentBooking.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:m-0 print:max-h-none">
        {/* Header Action Bar */}
        <div className="flex-shrink-0 bg-[#1b4332] text-white p-5 sm:p-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <HotelookLogo size="md" variant="light" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Reservation Voucher</h2>
              <p className="text-xs text-emerald-200/80 font-mono mt-0.5">
                Ref: {currentBooking.id}
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
            <p className="text-xs text-slate-500 font-mono">Reference: {currentBooking.id}</p>
          </div>
        </div>

        {/* Voucher Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-8 space-y-6">
          {/* Top Status & Reference Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Booking Reference
              </span>
              <p className="text-base sm:text-lg font-black font-mono text-slate-900 mt-0.5">
                {currentBooking.id}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${statusConfig.bg}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{currentBooking.status}</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">
                Booked on {new Date(currentBooking.createdAt).toLocaleDateString()}
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
                  <p className="text-sm font-extrabold text-slate-900">{currentBooking.guestName}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{currentBooking.guestEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{currentBooking.guestPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified ID Proof: {currentBooking.guestIdProof}</span>
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
                  src={currentBooking.roomImage}
                  alt={currentBooking.roomNumber}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">
                      Room #{currentBooking.roomNumber}
                    </span>
                    <span className="text-[10px] font-bold bg-[#1b4332]/10 text-[#1b4332] px-2 py-0.5 rounded-full">
                      Tier 1
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{currentBooking.roomType}</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-0.5">
                    ₹{Number(currentBooking.pricePerNight).toLocaleString()}{' '}
                    <span className="font-normal text-slate-400">/ night</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stay Timeline & Duration (With Interactive Date Modification) */}
          <div className="p-5 rounded-2xl bg-[#f4f7f4] border border-slate-200/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332]">
                  Stay Duration Timeline
                </span>
                <span className="text-xs font-black bg-[#1b4332] text-white px-3 py-1 rounded-full">
                  {currentBooking.nights} {currentBooking.nights === 1 ? 'Night' : 'Nights'}
                </span>
              </div>

              {/* Edit Dates Action Button */}
              <button
                type="button"
                onClick={() => {
                  setIsEditingDates(!isEditingDates)
                  setEditCheckIn(currentBooking.checkIn)
                  setEditCheckOut(currentBooking.checkOut)
                  setDateError('')
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1b4332] bg-white border border-[#1b4332]/30 hover:bg-[#1b4332]/10 transition cursor-pointer print:hidden shadow-2xs"
                title="Edit reservation dates before printing invoice"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingDates ? 'Close Date Editor' : 'Edit Stay Dates'}</span>
              </button>
            </div>

            {/* Current Schedule Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Check-In Date</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{currentBooking.checkIn}</span>
                  <span className="text-xs text-slate-400 font-normal">(From 2:00 PM)</span>
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Check-Out Date</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>{currentBooking.checkOut}</span>
                  <span className="text-xs text-slate-400 font-normal">(Until 11:00 AM)</span>
                </p>
              </div>
            </div>

            {/* Interactive Date Editor Drawer */}
            {isEditingDates && (
              <div className="mt-4 p-4.5 rounded-2xl bg-white border-2 border-[#1b4332]/30 shadow-md space-y-3.5 print:hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#1b4332]" />
                    Adjust Stay Dates for Invoice Printing
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Live Folio Recalculation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Check-In Date *
                    </label>
                    <input
                      type="date"
                      value={editCheckIn}
                      onChange={(e) => {
                        setEditCheckIn(e.target.value)
                        setDateError('')
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Check-Out Date *
                    </label>
                    <input
                      type="date"
                      min={editCheckIn}
                      value={editCheckOut}
                      onChange={(e) => {
                        setEditCheckOut(e.target.value)
                        setDateError('')
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                    />
                  </div>
                </div>

                {/* Conflict Alert (Double Booking Protection) */}
                {conflict && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block">Double-Booking Collision Detected!</strong>
                      <p className="mt-0.5 text-rose-700">
                        Room #{currentBooking.roomNumber} is already reserved by {conflict.guestName} from{' '}
                        <strong>{conflict.checkIn}</strong> to <strong>{conflict.checkOut}</strong>. Please select non-overlapping dates.
                      </p>
                    </div>
                  </div>
                )}

                {/* Validation Error */}
                {dateError && (
                  <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{dateError}</span>
                  </p>
                )}

                {/* Live Financials Preview */}
                {previewFinancials && !conflict && (
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="font-bold text-emerald-900 block">
                        Preview: {previewFinancials.nights} {previewFinancials.nights === 1 ? 'Night' : 'Nights'} (₹{Number(currentBooking.pricePerNight).toLocaleString()} / nt)
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Subtotal: ₹{previewFinancials.subtotal.toLocaleString()} + GST (12%): ₹{previewFinancials.tax.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-600 font-semibold uppercase block">
                        Updated Total
                      </span>
                      <span className="font-mono font-black text-emerald-900 text-base">
                        ₹{previewFinancials.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingDates(false)
                      setEditCheckIn(currentBooking.checkIn)
                      setEditCheckOut(currentBooking.checkOut)
                      setDateError('')
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingDates || Boolean(conflict) || Boolean(dateError)}
                    onClick={handleSaveDates}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#1b4332] hover:bg-[#133225] disabled:opacity-50 transition cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingDates ? 'Recalculating...' : 'Save & Update Invoice'}</span>
                  </button>
                </div>
              </div>
            )}

            {currentBooking.keycardNumber && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Assigned Keycard RFID:</span>
                <span className="font-mono font-bold text-[#1b4332] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {currentBooking.keycardNumber}
                </span>
              </div>
            )}

            {currentBooking.actualCheckIn && (
              <div className="mt-2 text-[11px] text-slate-500">
                <span>Actual Check-In: {new Date(currentBooking.actualCheckIn).toLocaleString()}</span>
                {currentBooking.checkedInBy && <span> (Handled by {currentBooking.checkedInBy})</span>}
              </div>
            )}

            {currentBooking.actualCheckOut && (
              <div className="mt-1 text-[11px] text-slate-500">
                <span>Actual Check-Out: {new Date(currentBooking.actualCheckOut).toLocaleString()}</span>
                {currentBooking.checkedOutBy && <span> (Handled by {currentBooking.checkedOutBy})</span>}
              </div>
            )}

            {currentBooking.specialRequests && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
                <strong className="text-slate-800">Special Notes:</strong> {currentBooking.specialRequests}
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
                Room Charges (₹{Number(currentBooking.pricePerNight).toLocaleString()} × {currentBooking.nights}{' '}
                {currentBooking.nights === 1 ? 'night' : 'nights'})
              </span>
              <span className="font-bold text-slate-800 font-mono">
                ₹{Number(currentBooking.subtotal).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Government Hotel Tax & GST (12%)</span>
              <span className="font-bold text-slate-800 font-mono">
                ₹{Number(currentBooking.tax).toLocaleString()}
              </span>
            </div>

            {Number(currentBooking.extraCharges || 0) > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Incidentals & Service Additions</span>
                <span className="font-bold text-amber-700 font-mono">
                  + ₹{Number(currentBooking.extraCharges).toLocaleString()}
                </span>
              </div>
            )}

            <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 block">Total Amount Paid / Due</span>
                <span className="text-[10px] text-slate-400">All applicable taxes included</span>
              </div>
              <span className="text-2xl font-black text-[#1b4332] font-mono">
                ₹{Number(currentBooking.finalBilledAmount || currentBooking.totalAmount).toLocaleString()}
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
                const isActive = currentBooking.status === btn.status
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
        <div className="flex-shrink-0 p-4 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between rounded-b-3xl print:hidden">
          <p className="text-xs text-slate-400">
            Hotelook Management System • Double Booking Protection Verified
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
