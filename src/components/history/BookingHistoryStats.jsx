import {
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  Ban,
  TrendingUp,
} from 'lucide-react'

export default function BookingHistoryStats({ bookings = [] }) {
  const stats = {
    total: bookings.length,
    completed: bookings.filter((b) => b.status === 'Checked-Out').length,
    active: bookings.filter((b) => b.status === 'Checked-In').length,
    confirmed: bookings.filter((b) => b.status === 'Confirmed').length,
    cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
    totalRevenue: bookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + Number(b.finalBilledAmount || b.totalAmount || 0), 0),
  }

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / (stats.total - stats.cancelled || 1)) * 100)
    : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Total Historical Bookings */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2">
          <Calendar className="w-4 h-4" />
        </div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Total Bookings
        </p>
        <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
          {stats.total}
        </p>
        <p className="text-[10px] text-slate-400">All recorded reservations</p>
      </div>

      {/* 2. Completed Stays */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 border border-emerald-200/60">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Completed Stays
        </p>
        <p className="text-xl sm:text-2xl font-black text-emerald-800 font-mono">
          {stats.completed}
        </p>
        <p className="text-[10px] text-emerald-700 font-semibold">
          {completionRate}% success rate
        </p>
      </div>

      {/* 3. Active / In-House Stays */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 border border-amber-200/60">
          <Clock className="w-4 h-4" />
        </div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Active In-House
        </p>
        <p className="text-xl sm:text-2xl font-black text-amber-800 font-mono">
          {stats.active}
        </p>
        <p className="text-[10px] text-amber-700 font-medium">Currently occupied</p>
      </div>

      {/* 4. Confirmed Upcoming */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 border border-blue-200/60">
          <LogOut className="w-4 h-4 rotate-180" />
        </div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Upcoming
        </p>
        <p className="text-xl sm:text-2xl font-black text-blue-800 font-mono">
          {stats.confirmed}
        </p>
        <p className="text-[10px] text-blue-700 font-medium">Pending arrivals</p>
      </div>

      {/* 5. Cancelled */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-2 border border-rose-200/60">
          <Ban className="w-4 h-4" />
        </div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Cancelled
        </p>
        <p className="text-xl sm:text-2xl font-black text-rose-800 font-mono">
          {stats.cancelled}
        </p>
        <p className="text-[10px] text-rose-700 font-medium">Inventory released</p>
      </div>

      {/* 6. Total Net Revenue */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1 col-span-2 sm:col-span-1">
        <div className="w-9 h-9 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center mb-2 border border-[#1b4332]/20">
          <TrendingUp className="w-4 h-4" />
        </div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Total Invoiced
        </p>
        <p className="text-lg sm:text-xl font-black text-[#1b4332] font-mono truncate">
          ₹{stats.totalRevenue.toLocaleString()}
        </p>
        <p className="text-[10px] text-slate-400">Exclusive of cancelled</p>
      </div>
    </div>
  )
}
