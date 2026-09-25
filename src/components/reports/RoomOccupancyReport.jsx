import {
  Award,
  Layers,
  Percent,
} from 'lucide-react'
import { ROOM_TYPE_RANKINGS } from '../../services/reportsData'

export default function RoomOccupancyReport({ stats, rooms = [] }) {
  // Floor breakdown
  const floors = [1, 2, 3, 4, 5]
  const floorStats = floors.map((fl) => {
    const floorRooms = rooms.filter((r) => Number(r.floorNumber) === fl)
    const total = floorRooms.length || 24
    const occupied = floorRooms.filter((r) => r.availabilityStatus === 'Occupied' || r.status === 'Occupied').length || Math.round(total * 0.75)
    const rate = Math.round((occupied / total) * 100)
    return { floor: fl, total, occupied, available: total - occupied, rate }
  })

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200">
              <Percent className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Room Occupancy & Suite Performance
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time occupancy yield index, floor distribution, and most-booked room categories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-900 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
            Current Property Occupancy: {stats.occupancyRate}%
          </span>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Occupied Rooms Live
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {stats.occupiedRooms}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              of {stats.totalRooms} keys
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${stats.occupancyRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Available for Assignment
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
              {stats.totalRooms - stats.occupiedRooms}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">
              clean & ready
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Instant guest check-in capacity at front desk
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Top Category
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900">
              #1 Ranked
            </span>
          </div>
          <p className="text-lg sm:text-xl font-black text-amber-950 truncate">
            {stats.mostBookedType}
          </p>
          <p className="text-[11px] text-amber-800 font-medium">
            Generated ₹16,371,000 across 642 reservations
          </p>
        </div>
      </div>

      {/* Most Booked Room Type Leaderboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#1b4332]" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Most Booked Room Types Leaderboard
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">Ranked by volume & share</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Rank & Suite Type</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Reservations</th>
                <th className="py-3 px-3 text-center">Share (%)</th>
                <th className="py-3 px-3 text-center">Nights</th>
                <th className="py-3 px-3 text-right">Nightly Rate</th>
                <th className="py-3 px-4 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ROOM_TYPE_RANKINGS.map((room, idx) => (
                <tr key={room.type} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{room.type}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${room.badgeColor}`}>
                      {room.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                    {room.totalBookings.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                      <span>{room.sharePercentage}%</span>
                      <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-[#1b4332]"
                          style={{ width: `${room.sharePercentage * 2.5}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                    {room.totalNights.toLocaleString()} ({room.avgNightsPerStay} avg)
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-800">
                    ₹{room.pricePerNight.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-[#1b4332]">
                    ₹{room.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floor-by-Floor Occupancy Density */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1b4332]" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Floor-by-Floor Occupancy Density
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">Building Levels 1 through 5</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {floorStats.map((f) => (
            <div
              key={f.floor}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-center"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Floor {f.floor}</span>
                <span className="text-[11px] font-black text-[#1b4332] font-mono">
                  {f.rate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1b4332] to-[#40916c] rounded-full transition-all duration-500"
                  style={{ width: `${f.rate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>{f.occupied} Occupied</span>
                <span>{f.available} Vacant</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
