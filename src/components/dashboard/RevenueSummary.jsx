import { useState } from 'react'
import {
  IndianRupee,
  PieChart,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react'
import { REVENUE_TIMELINES, REVENUE_STREAMS } from '../../services/dashboardData'

export default function RevenueSummary() {
  const [timeframe, setTimeframe] = useState('monthly')
  const [hoveredBar, setHoveredBar] = useState(null)

  const activeData = REVENUE_TIMELINES[timeframe]
  const maxRevenue = Math.max(...activeData.data.map(d => d.revenue))

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Revenue Summary
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Financial analytics and income breakdown across departments
          </p>
        </div>

        {/* Timeframe Pills */}
        <div className="inline-flex p-1 bg-slate-100 rounded-full text-xs font-semibold self-start sm:self-auto">
          {['weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setTimeframe(period)}
              className={`px-3.5 py-1.5 rounded-full capitalize transition-all cursor-pointer ${
                timeframe === period
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Top Revenue Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#efefe3]/60 border border-slate-200/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total {activeData.label}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">
              {activeData.total}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              {activeData.trend}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Avg. Daily Rate (ADR)
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">
              ₹8,500.00
            </span>
            <span className="text-xs text-slate-500">per room</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            RevPAR
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">
              ₹5,800.00
            </span>
            <span className="text-xs text-slate-500">yield index</span>
          </div>
        </div>
      </div>

      {/* Responsive Bar Visualizer */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 font-medium">
            <BarChart3 className="w-3.5 h-3.5 text-[#1b4332]" />
            Revenue Velocity (₹ INR)
          </span>
          {hoveredBar && (
            <span className="font-semibold text-[#1b4332] bg-[#1b4332]/10 px-2.5 py-0.5 rounded-full">
              {hoveredBar.label}: ₹{hoveredBar.revenue.toLocaleString()} ({hoveredBar.bookings} bookings)
            </span>
          )}
        </div>

        <div className="h-44 sm:h-52 w-full flex items-end gap-1.5 sm:gap-3 pt-6 pb-2 px-2 bg-slate-50/70 rounded-2xl border border-slate-200/60">
          {activeData.data.map((item) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 85) + 12

            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredBar(item)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Bar */}
                <div
                  className="w-full max-w-[36px] bg-gradient-to-t from-[#1b4332] to-[#2d6a4f] rounded-t-lg transition-all duration-300 group-hover:brightness-110 shadow-xs relative"
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none whitespace-nowrap z-20 shadow-md">
                    ₹{(item.revenue / 1000).toFixed(1)}k
                  </div>
                </div>

                {/* X-axis Label */}
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-2 truncate max-w-full">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Revenue Streams Breakdown */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <PieChart className="w-4 h-4 text-[#1b4332]" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Revenue by Department / Stream
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REVENUE_STREAMS.map((stream) => (
            <div
              key={stream.name}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  {stream.name}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {stream.amount} ({stream.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stream.percentage}%`,
                    backgroundColor: stream.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
