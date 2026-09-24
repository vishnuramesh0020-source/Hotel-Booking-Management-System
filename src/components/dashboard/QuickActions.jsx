import { useState } from 'react'
import {
  PlusCircle,
  KeyRound,
  FileSpreadsheet,
  Bed,
  Sparkles,
  Check,
  X,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function QuickActions({ onNewBookingCreated }) {
  const [showModal, setShowModal] = useState(false)
  const [newGuestName, setNewGuestName] = useState('')
  const [newRoomType, setNewRoomType] = useState('Deluxe King Balcony')
  const [newRoomNumber, setNewRoomNumber] = useState('205')
  const [newNights, setNewNights] = useState(3)

  const handleExportReport = () => {
    toast.info('Generating financial CSV report...', { autoClose: 1500 })
    setTimeout(() => {
      // Simulate file download
      const csvContent =
        'data:text/csv;charset=utf-8,ID,Guest,Room,CheckIn,CheckOut,Amount,Status\n' +
        'BK-9021,Victoria Stirling,402,2025-05-10,2025-05-15,₹24500,Checked-In\n' +
        'BK-9022,Marcus Brody,215,2025-05-11,2025-05-14,₹8400,Confirmed\n'

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'hotelook_revenue_report_2025.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Report downloaded: hotelook_revenue_report_2025.csv')
    }, 1600)
  }

  const handleCreateReservation = (e) => {
    e.preventDefault()
    if (!newGuestName.trim()) {
      toast.error('Please enter a guest name.')
      return
    }

    const newBooking = {
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      guest: {
        name: newGuestName.trim(),
        email: `${newGuestName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        avatarColor: 'bg-emerald-700',
      },
      roomNumber: newRoomNumber,
      roomType: newRoomType,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + newNights * 86400000).toISOString().split('T')[0],
      amount: `₹${newNights * 8500}`,
      status: 'Confirmed',
      guestsCount: 2,
      nights: Number(newNights),
    }

    if (onNewBookingCreated) {
      onNewBookingCreated(newBooking)
    }

    toast.success(`Reservation confirmed for ${newGuestName}! Room #${newRoomNumber}`)
    setShowModal(false)
    setNewGuestName('')
  }

  return (
    <>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Quick Action Cards
            </h3>
            <p className="text-xs text-slate-500">
              Front-desk operations and service shortcuts
            </p>
          </div>
          <Sparkles className="w-4 h-4 text-[#1b4332]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Action 1: New Reservation */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="p-4 rounded-2xl bg-[#efefe3]/80 hover:bg-[#efefe3] border border-slate-200/70 text-left transition-all hover:scale-[1.01] flex items-start gap-3.5 group cursor-pointer shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">New Reservation</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Book suite, assign room & dates
              </p>
            </div>
          </button>

          {/* Action 2: Express Check-In */}
          <button
            type="button"
            onClick={() =>
              toast.info('Express check-in scanner ready. Select a reservation below.')
            }
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition-all hover:scale-[1.01] flex items-start gap-3.5 group cursor-pointer shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Express Check-In</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Issue keycard & verify guest ID
              </p>
            </div>
          </button>

          {/* Action 3: Room Availability Matrix */}
          <button
            type="button"
            onClick={() =>
              toast.info('Housekeeping status: 38 Clean, 4 Dirty, 0 Out-of-Order.')
            }
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition-all hover:scale-[1.01] flex items-start gap-3.5 group cursor-pointer shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Housekeeping</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                38 Clean • 4 In-Cleaning
              </p>
            </div>
          </button>

          {/* Action 4: Financial Export */}
          <button
            type="button"
            onClick={handleExportReport}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition-all hover:scale-[1.01] flex items-start gap-3.5 group cursor-pointer shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Export Financials</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Download CSV revenue summary
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Modal: New Reservation Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  New Reservation
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Guest Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room Type
                  </label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#1b4332]"
                  >
                    <option value="Deluxe King Balcony">Deluxe King</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Penthouse Ocean Suite">Penthouse Ocean</option>
                    <option value="Standard King">Standard King</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1b4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Length of Stay (Nights)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newNights}
                  onChange={(e) => setNewNights(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#1b4332] hover:bg-[#143729] shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
