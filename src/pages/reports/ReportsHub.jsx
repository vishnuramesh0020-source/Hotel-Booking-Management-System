import { useState, useMemo } from 'react'
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  Percent,
  Users,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'react-toastify'
import Navbar from '../../components/layout/Navbar'
import ReportKpiRibbon from '../../components/reports/ReportKpiRibbon'
import RevenueChart from '../../components/reports/RevenueChart'
import BookingTrendsChart from '../../components/reports/BookingTrendsChart'
import RoomOccupancyReport from '../../components/reports/RoomOccupancyReport'
import ActiveGuestsReport from '../../components/reports/ActiveGuestsReport'
import { useBookings } from '../../context/BookingContext'
import { useRooms } from '../../context/RoomContext'
import { useGuests } from '../../context/GuestContext'
import { computeReportStatistics } from '../../services/reportsData'

export default function ReportsHub() {
  const { bookings } = useBookings()
  const { rooms } = useRooms()
  const { guests } = useGuests()

  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'revenue' | 'occupancy' | 'trends'
  const [dateRange, setDateRange] = useState('ytd') // 'week' | 'month' | 'quarter' | 'ytd' | 'all'

  // Computed statistics combining live contexts with historical data
  const stats = useMemo(() => {
    return computeReportStatistics(bookings, rooms, guests)
  }, [bookings, rooms, guests])

  // Handle CSV Export
  const handleExportCSV = () => {
    toast.info('Compiling Hotelook Executive Analytics CSV...', { autoClose: 1500 })

    setTimeout(() => {
      const headers = [
        'Report Field',
        'Metric Value',
        'Unit / Period',
        'Fiscal Year',
        'Audit Status',
      ]

      const rows = [
        ['Total Revenue', `INR ${stats.totalRevenue.toLocaleString()}`, 'INR (Rupees)', '2026', 'Audited'],
        ['Monthly Bookings', stats.monthlyBookings, 'Count / Month', '2026', 'Verified'],
        ['Total Bookings Volume', stats.totalBookings, 'All-Time Reservations', '2023-2026', 'Audited'],
        ['Room Occupancy Rate', `${stats.occupancyRate}%`, 'Percentage (%)', 'Live', 'Active'],
        ['Occupied Rooms Live', `${stats.occupiedRooms} / ${stats.totalRooms}`, 'Rooms Occupied', 'Current Desk', 'Live'],
        ['Most Booked Room Type', stats.mostBookedType, '32.2% Share', 'All-Time', 'Leaderboard #1'],
        ['Active In-House Guests', stats.activeGuests, 'Registered Headcount', 'Live', 'In-House'],
        ['Average Daily Rate (ADR)', `INR ${stats.adr.toLocaleString()}`, 'Per Occupied Room', '2026', 'Yield'],
        ['RevPAR (Yield Index)', `INR ${stats.revPar.toLocaleString()}`, 'Per Available Key', '2026', 'Calculated'],
        ['Completed Stays', stats.completedStays, 'Finished Folios', 'All-Time', 'Reconciled'],
        ['Cancelled Reservations', stats.cancelledStays, 'Inventory Released', 'All-Time', 'Archived'],
      ]

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.map(val => `"${val}"`).join(','))].join('\n')

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute(
        'download',
        `Hotelook_Executive_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Analytics CSV report exported successfully!', { icon: '📊' })
    }, 600)
  }

  // Handle Print Report
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#f4f4ec] text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8 print:p-0 print:m-0 print:space-y-4">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#1b4332] text-white p-6 sm:p-8 shadow-xl print:hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Executive Business Intelligence</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Real-Time Desk Reconciliation</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Reports & Operations Analytics
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                Comprehensive reporting hub for Hotelook leadership. Tracks multi-stream revenue velocity, monthly booking cycles, occupancy yields, and resident guest demographics.
              </p>
            </div>

            {/* Quick Actions & Export */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition cursor-pointer"
                title="Export analytics to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 transition cursor-pointer"
                title="Print report summary"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Brief</span>
              </button>
            </div>
          </div>
        </div>

        {/* Print-only Header */}
        <div className="hidden print:block border-b border-slate-300 pb-4 mb-4">
          <h1 className="text-2xl font-black text-slate-900">HOTELOOK EXECUTIVE ANALYTICS REPORT</h1>
          <p className="text-xs text-slate-600 mt-1">
            Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Property Operations Audit
          </p>
        </div>

        {/* 8-Card Executive KPI Ribbon */}
        <ReportKpiRibbon stats={stats} />

        {/* Interactive Filter Toolbar & View Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs print:hidden">
          {/* View Focus Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60">
            {[
              { id: 'overview', label: 'All Analytics', icon: BarChart3 },
              { id: 'revenue', label: 'Revenue & Finance', icon: TrendingUp },
              { id: 'occupancy', label: 'Occupancy & Rooms', icon: Percent },
              { id: 'trends', label: 'Booking Trends & Guests', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1b4332]" />
              <span>Scope:</span>
            </span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1b4332] cursor-pointer"
            >
              <option value="week">Past 7 Days</option>
              <option value="month">Current Month (September)</option>
              <option value="quarter">Third Quarter (Q3 2026)</option>
              <option value="ytd">Year to Date (2026 YTD)</option>
              <option value="all">All-Time Cumulative</option>
            </select>
          </div>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <RevenueChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RoomOccupancyReport stats={stats} rooms={rooms} />
              <BookingTrendsChart />
            </div>
            <ActiveGuestsReport stats={stats} liveBookings={bookings} />
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-8">
            <RevenueChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RoomOccupancyReport stats={stats} rooms={rooms} />
              <ActiveGuestsReport stats={stats} liveBookings={bookings} />
            </div>
          </div>
        )}

        {activeTab === 'occupancy' && (
          <div className="space-y-8">
            <RoomOccupancyReport stats={stats} rooms={rooms} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BookingTrendsChart />
              <RevenueChart />
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8">
            <BookingTrendsChart />
            <ActiveGuestsReport stats={stats} liveBookings={bookings} />
            <RevenueChart />
          </div>
        )}
      </main>
    </div>
  )
}
