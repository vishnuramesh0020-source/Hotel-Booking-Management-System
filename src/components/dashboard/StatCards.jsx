import {
  BedDouble,
  DoorOpen,
  DoorClosed,
  Users,
  LogIn,
  LogOut,
  CalendarCheck,
  TrendingUp,
} from 'lucide-react'

export default function StatCards({ stats }) {
  const cards = [
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      subtitle: `${stats.occupancyRate}% current occupancy`,
      icon: BedDouble,
      iconBg: 'bg-[#1b4332]/10 text-[#1b4332]',
      trend: '+4 new suites',
      badgeColor: 'bg-emerald-50 text-emerald-700',
      showProgress: true,
      progressValue: stats.occupancyRate,
    },
    {
      title: 'Available Rooms',
      value: stats.availableRooms,
      subtitle: `${stats.cleanRooms} ready for check-in`,
      icon: DoorOpen,
      iconBg: 'bg-emerald-50 text-emerald-700',
      trend: '32.8% capacity',
      badgeColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Occupied Rooms',
      value: stats.occupiedRooms,
      subtitle: `${stats.occupiedRooms} of ${stats.totalRooms} rooms occupied`,
      icon: DoorClosed,
      iconBg: 'bg-amber-50 text-amber-700',
      trend: '+12% this week',
      badgeColor: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Total Guests',
      value: stats.totalGuests,
      subtitle: 'In-house guests across all floors',
      icon: Users,
      iconBg: 'bg-sky-50 text-sky-700',
      trend: '+18 today',
      badgeColor: 'bg-sky-50 text-sky-700',
    },
    {
      title: "Today's Check-Ins",
      value: stats.todaysCheckIns,
      subtitle: `${stats.pendingArrivals} arrivals remaining`,
      icon: LogIn,
      iconBg: 'bg-emerald-50 text-emerald-800',
      trend: 'Peak 2 PM - 5 PM',
      badgeColor: 'bg-emerald-50 text-emerald-800',
    },
    {
      title: "Today's Check-Outs",
      value: stats.todaysCheckOuts,
      subtitle: '12 completed, 2 pending',
      icon: LogOut,
      iconBg: 'bg-orange-50 text-orange-700',
      trend: 'Target 11 AM',
      badgeColor: 'bg-orange-50 text-orange-700',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      subtitle: 'Reservations logged this period',
      icon: CalendarCheck,
      iconBg: 'bg-[#1b4332] text-white',
      trend: '+24.5% MoM',
      badgeColor: 'bg-[#1b4332]/10 text-[#1b4332]',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Key Performance Indicators
          </h2>
          <p className="text-xs text-slate-500">
            Real-time occupancy, guest count, and front-desk operational metrics
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#1b4332] bg-[#1b4332]/10 px-3 py-1.5 rounded-full">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>High Occupancy Period</span>
        </div>
      </div>

      {/* Grid displaying all 7 stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon
          const isHighlight = idx === 0 // Total Rooms card gets special prominence or span

          return (
            <div
              key={card.title}
              className={`bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                isHighlight ? 'sm:col-span-2 lg:col-span-1 border-[#1b4332]/20' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                    {card.trend}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {card.value}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 truncate">{card.subtitle}</p>

                {card.showProgress && (
                  <div className="mt-2">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1b4332] h-full rounded-full transition-all duration-500"
                        style={{ width: `${card.progressValue}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
