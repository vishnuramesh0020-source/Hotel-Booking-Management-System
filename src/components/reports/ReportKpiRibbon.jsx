import {
  IndianRupee,
  Calendar,
  BedDouble,
  Award,
  Users,
  TrendingUp,
  Percent,
  Ban,
  ArrowUpRight,
} from 'lucide-react'

export default function ReportKpiRibbon({ stats }) {
  const cards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue).toLocaleString()}`,
      subtext: '+18.4% vs last period',
      icon: IndianRupee,
      trend: 'positive',
      iconBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
      valueColor: 'text-emerald-900',
    },
    {
      id: 'monthly-bookings',
      title: 'Monthly Bookings',
      value: stats.monthlyBookings.toLocaleString(),
      subtext: `${stats.totalBookings.toLocaleString()} all-time volume`,
      icon: Calendar,
      trend: 'positive',
      iconBg: 'bg-blue-50 text-blue-800 border border-blue-200/60',
      valueColor: 'text-blue-900',
    },
    {
      id: 'occupancy',
      title: 'Room Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      subtext: `${stats.occupiedRooms} of ${stats.totalRooms} rooms active`,
      icon: Percent,
      trend: 'positive',
      iconBg: 'bg-teal-50 text-teal-800 border border-teal-200/60',
      valueColor: 'text-teal-900',
    },
    {
      id: 'most-booked',
      title: 'Most Booked Room Type',
      value: stats.mostBookedType,
      subtext: '32.2% of all guest reservations',
      icon: Award,
      trend: 'neutral',
      iconBg: 'bg-amber-50 text-amber-800 border border-amber-200/60',
      valueColor: 'text-amber-950',
    },
    {
      id: 'active-guests',
      title: 'Active In-House Guests',
      value: stats.activeGuests.toLocaleString(),
      subtext: `${stats.inHouseReservations} active keycard folios`,
      icon: Users,
      trend: 'positive',
      iconBg: 'bg-indigo-50 text-indigo-800 border border-indigo-200/60',
      valueColor: 'text-indigo-950',
    },
    {
      id: 'adr',
      title: 'Average Daily Rate (ADR)',
      value: `₹${stats.adr.toLocaleString()}`,
      subtext: 'Revenue per occupied room',
      icon: TrendingUp,
      trend: 'positive',
      iconBg: 'bg-slate-100 text-slate-800 border border-slate-200/60',
      valueColor: 'text-slate-900',
    },
    {
      id: 'revpar',
      title: 'RevPAR (Yield Index)',
      value: `₹${stats.revPar.toLocaleString()}`,
      subtext: 'Per available room capacity',
      icon: BedDouble,
      trend: 'positive',
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      valueColor: 'text-emerald-950',
    },
    {
      id: 'cancellation',
      title: 'Cancellation Ratio',
      value: `${Math.round((stats.cancelledStays / (stats.totalBookings || 1)) * 100)}%`,
      subtext: `${stats.cancelledStays} inventory releases`,
      icon: Ban,
      trend: 'low',
      iconBg: 'bg-rose-50 text-rose-800 border border-rose-200/60',
      valueColor: 'text-rose-900',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div
            key={c.id}
            className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 ${c.iconBg}`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ArrowUpRight className="w-3 h-3" />
                Live
              </span>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {c.title}
              </p>
              <p className={`text-lg sm:text-xl font-black font-mono tracking-tight mt-0.5 truncate ${c.valueColor}`}>
                {c.value}
              </p>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                {c.subtext}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
