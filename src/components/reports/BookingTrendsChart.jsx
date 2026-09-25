import { useState } from 'react'
import {
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  Ban,
  Activity,
} from 'lucide-react'
import {
  MONTHLY_REPORT_DATA,
  DAY_OF_WEEK_TRENDS,
  STAY_DURATION_DISTRIBUTION,
} from '../../services/reportsData'

export default function BookingTrendsChart() {
  const [hoveredMonth, setHoveredMonth] = useState(null)
  const maxMonthlyBookings = Math.max(...MONTHLY_REPORT_DATA.map((m) => m.bookings))

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Monthly Bookings & Demand Trends
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            12-month volume trajectories, stay length patterns, and day-of-week surge analysis
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>93.8% Completed</span>
          </span>
          <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <Ban className="w-3.5 h-3.5 text-rose-500" />
            <span>4.2% Cancelled</span>
          </span>
        </div>
      </div>

      {/* Monthly Bookings Volume Comparison Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-700" />
            Monthly Reservation Volume (Completed vs Cancelled)
          </span>
          {hoveredMonth ? (
            <span className="font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {hoveredMonth.monthFull}: {hoveredMonth.bookings} Bookings ({hoveredMonth.completed} Completed, {hoveredMonth.cancelled} Cancelled)
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Hover bars to view monthly details</span>
          )}
        </div>

        <div className="h-52 sm:h-56 w-full flex items-end gap-1.5 sm:gap-3 pt-6 pb-2 px-3 bg-slate-50/70 rounded-2xl border border-slate-200/70">
          {MONTHLY_REPORT_DATA.map((item) => {
            const barHeight = Math.max(15, Math.round((item.bookings / maxMonthlyBookings) * 82))
            const completedRatio = Math.round((item.completed / item.bookings) * 100)

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredMonth(item)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Stacked Visual Bar */}
                <div
                  className="w-full max-w-[34px] rounded-t-lg overflow-hidden bg-slate-200 transition-all duration-300 group-hover:scale-y-105 shadow-2xs flex flex-col justify-end"
                  style={{ height: `${barHeight}%` }}
                >
                  {/* Cancelled top cap */}
                  <div
                    className="w-full bg-rose-400"
                    style={{ height: `${100 - completedRatio}%` }}
                    title={`Cancelled: ${item.cancelled}`}
                  />
                  {/* Completed / Active bottom body */}
                  <div
                    className="w-full bg-blue-700 flex-1"
                    title={`Completed: ${item.completed}`}
                  />
                </div>

                {/* Month Label */}
                <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-2 truncate max-w-full">
                  {item.month}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Two Column Grid: Day of Week Surge & Stay Duration Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Day of Week Demand */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1b4332]" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Day-of-Week Demand Surge
              </h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly Share</span>
          </div>

          <div className="space-y-2">
            {DAY_OF_WEEK_TRENDS.map((day) => {
              const isWeekend = day.day === 'Friday' || day.day === 'Saturday'
              return (
                <div key={day.day} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${isWeekend ? 'text-[#1b4332]' : 'text-slate-700'}`}>
                      {day.day}
                    </span>
                    <span className="font-semibold text-slate-500 text-[11px]">
                      {day.share}% share • <span className="text-slate-400">{day.label}</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isWeekend ? 'bg-[#1b4332]' : 'bg-[#2d6a4f]'
                      }`}
                      style={{ width: `${day.share * 3.5}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stay Duration Pattern Distribution */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1b4332]" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Length of Stay Distribution
              </h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">2,000+ Reservations</span>
          </div>

          <div className="space-y-3">
            {STAY_DURATION_DISTRIBUTION.map((item) => (
              <div key={item.range} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.range}</span>
                  <span className="text-slate-900 font-mono">
                    {item.count} stays ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1b4332] transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Quick Metrics Footer */}
            <div className="pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-400 font-bold block">Avg. Stay Length</span>
                <span className="font-black text-slate-900 text-sm">2.9 Nights</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-400 font-bold block">Avg. Lead Time</span>
                <span className="font-black text-[#1b4332] text-sm">11.4 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
