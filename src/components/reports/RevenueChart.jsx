import { useState } from 'react'
import {
  IndianRupee,
  BarChart3,
  PieChart,
  TrendingUp,
} from 'lucide-react'
import {
  MONTHLY_REPORT_DATA,
  WEEKLY_REPORT_DATA,
  YEARLY_REPORT_DATA,
  REVENUE_STREAMS_REPORT,
} from '../../services/reportsData'

export default function RevenueChart() {
  const [timeframe, setTimeframe] = useState('monthly') // 'weekly' | 'monthly' | 'yearly'
  const [hoveredItem, setHoveredItem] = useState(null)

  // Dataset based on timeframe
  const chartConfig = {
    weekly: {
      title: 'Weekly Velocity (Past 7 Days)',
      data: WEEKLY_REPORT_DATA.map((d) => ({
        label: d.day,
        fullLabel: d.dayFull,
        revenue: d.revenue,
        bookings: d.bookings,
        occupancy: `${d.occupancy}%`,
      })),
      total: '₹1,642,000',
      periodLabel: 'Last 7 Days',
      trend: '+12.4%',
    },
    monthly: {
      title: 'Monthly Revenue Velocity (Current Year 2026)',
      data: MONTHLY_REPORT_DATA.map((d) => ({
        label: d.month,
        fullLabel: d.monthFull,
        revenue: d.revenue,
        bookings: d.bookings,
        occupancy: `${d.occupancy}%`,
      })),
      total: '₹15,955,000',
      periodLabel: 'Full Year 2026',
      trend: '+18.4%',
    },
    yearly: {
      title: 'Annual Revenue Trajectory (Multi-Year Audit)',
      data: YEARLY_REPORT_DATA.map((d) => ({
        label: d.year,
        fullLabel: `Fiscal Year ${d.year}`,
        revenue: d.revenue,
        bookings: d.bookings,
        occupancy: `${d.occupancy}%`,
      })),
      total: '₹57,355,000',
      periodLabel: '2023 - 2026 (YTD)',
      trend: '+24.5%',
    },
  }

  const activeSet = chartConfig[timeframe]
  const maxRevenue = Math.max(...activeSet.data.map((d) => d.revenue))

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Timeframe Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Revenue Analytics & Charts
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive financial velocity chart, booking volume, and departmental revenue breakdown
          </p>
        </div>

        {/* Timeframe Controls */}
        <div className="inline-flex p-1 bg-slate-100 rounded-full text-xs font-semibold self-start sm:self-auto border border-slate-200/70">
          {[
            { id: 'weekly', label: '7 Days' },
            { id: 'monthly', label: '12 Months' },
            { id: 'yearly', label: 'Multi-Year' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeframe(t.id)}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                timeframe === t.id
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Highlight Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#1b4332] text-white space-y-1">
          <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
            {activeSet.periodLabel} Revenue
          </span>
          <p className="text-xl sm:text-2xl font-black font-mono">{activeSet.total}</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
            <TrendingUp className="w-3 h-3" />
            {activeSet.trend} growth pace
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            GST & Hotel Tax (12%)
          </span>
          <p className="text-xl font-bold font-mono text-slate-900">
            ₹{(Math.round(15955000 * 0.12)).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Compliant fiscal ledger</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Net Folio Settlement
          </span>
          <p className="text-xl font-bold font-mono text-[#1b4332]">
            98.2%
          </p>
          <span className="text-[10px] text-slate-400">Immediate front-desk clearance</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Ancillary Incidental Revenue
          </span>
          <p className="text-xl font-bold font-mono text-amber-900">
            ₹3,480,000
          </p>
          <span className="text-[10px] text-slate-400">F&B, mini-bar & wellness</span>
        </div>
      </div>

      {/* Interactive Bar Chart Visualization */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <BarChart3 className="w-4 h-4 text-[#1b4332]" />
            {activeSet.title}
          </span>
          {hoveredItem ? (
            <span className="font-bold text-[#1b4332] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {hoveredItem.fullLabel}: ₹{hoveredItem.revenue.toLocaleString()} ({hoveredItem.bookings} bookings, {hoveredItem.occupancy} occ)
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">
              Hover over bars to inspect audited metrics
            </span>
          )}
        </div>

        <div className="h-56 sm:h-64 w-full flex items-end gap-2 sm:gap-3 pt-8 pb-3 px-3 sm:px-4 bg-slate-50/70 rounded-2xl border border-slate-200/70 relative">
          {/* Subtle grid lines */}
          <div className="absolute inset-x-4 top-10 border-b border-dashed border-slate-200 pointer-events-none" />
          <div className="absolute inset-x-4 top-28 border-b border-dashed border-slate-200 pointer-events-none" />
          <div className="absolute inset-x-4 top-44 border-b border-dashed border-slate-200 pointer-events-none" />

          {activeSet.data.map((item) => {
            const heightPercent = Math.max(12, Math.round((item.revenue / maxRevenue) * 82))
            const isHighest = item.revenue === maxRevenue

            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative z-10"
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Bar */}
                <div
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative shadow-xs ${
                    isHighest
                      ? 'bg-gradient-to-t from-[#1b4332] via-[#2d6a4f] to-[#40916c] ring-2 ring-emerald-400/40'
                      : 'bg-gradient-to-t from-[#1b4332] to-[#2d6a4f] hover:brightness-110'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Floating Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-30 shadow-lg border border-slate-800">
                    ₹{(item.revenue / 100000).toFixed(2)}L
                  </div>
                </div>

                {/* X-axis Label */}
                <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-2 truncate max-w-full text-center">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Departmental Revenue Distribution Progress */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#1b4332]" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Revenue by Operational Department & Streams
            </h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            100% Invoiced Folio
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {REVENUE_STREAMS_REPORT.map((stream) => (
            <div
              key={stream.name}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">{stream.name}</span>
                <span className="text-slate-900 font-mono">
                  ₹{stream.amount.toLocaleString()} ({stream.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
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
