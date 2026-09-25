import {
  Users,
  Briefcase,
  Heart,
  Smile,
  Crown,
  UserCheck,
} from 'lucide-react'
import { ACTIVE_GUEST_SEGMENTS } from '../../services/reportsData'

export default function ActiveGuestsReport({ stats, liveBookings = [] }) {
  const inHouseBookings = liveBookings.filter((b) => b.status === 'Checked-In')

  const segmentIcons = {
    'Corporate & Business': Briefcase,
    'Couples & Leisure': Heart,
    'Family Vacationers': Smile,
    'VIP & High Net Worth': Crown,
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center border border-indigo-200">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Active In-House Guests & Demographics
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time resident headcount, profile categories, and guest loyalty velocity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-900 rounded-full border border-indigo-200">
            {stats.activeGuests} Total In-House Residents
          </span>
        </div>
      </div>

      {/* Guest Demographic Segments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {ACTIVE_GUEST_SEGMENTS.map((seg) => {
          const Icon = segmentIcons[seg.segment] || Users
          return (
            <div
              key={seg.segment}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs">
                  <Icon className="w-4 h-4 text-[#1b4332]" />
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {seg.percentage}% Share
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {seg.segment}
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {seg.count}
                  </span>
                  <span className="text-[11px] text-slate-500">guests active</span>
                </div>
              </div>

              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${seg.percentage * 2}%`,
                    backgroundColor: seg.color,
                  }}
                />
              </div>

              <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-200/60">
                Avg. Stay: <strong>{seg.avgNights} Nights</strong>
              </span>
            </div>
          )
        })}
      </div>

      {/* In-House Guest Audit Roster Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#1b4332]" />
            Live In-House Guest Folio Sample
          </h4>
          <span className="text-[11px] text-slate-400">
            {inHouseBookings.length} Active Keycards Issued
          </span>
        </div>

        {inHouseBookings.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/70">
            No live checked-in reservations currently in-house. Check in guests from Check-In/Out Hub to view here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-4">Guest Name</th>
                  <th className="py-2.5 px-3">Room Assigned</th>
                  <th className="py-2.5 px-3">Keycard</th>
                  <th className="py-2.5 px-3">Check-In Time</th>
                  <th className="py-2.5 px-3">Stay Duration</th>
                  <th className="py-2.5 px-4 text-right">Folio Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inHouseBookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {b.guestName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">Room #{b.roomNumber}</span>
                      <span className="block text-[10px] text-slate-500">{b.roomType}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        {b.keycardNumber || 'KC-' + b.roomNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {b.actualCheckIn ? new Date(b.actualCheckIn).toLocaleDateString() : b.checkIn}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#1b4332]">
                      ₹{Number(b.finalBilledAmount || b.totalAmount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Guest Loyalty & Retention Insights */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Repeat Guest Ratio</span>
          <span className="font-black text-slate-900 text-base">38.4%</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">+4.2% quarterly loyalty</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">ID Verification Rate</span>
          <span className="font-black text-emerald-800 text-base">99.8%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Government ID audited</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Guest Satisfaction (CSAT)</span>
          <span className="font-black text-amber-900 text-base">4.9 / 5.0</span>
          <span className="text-[10px] text-amber-700 block mt-0.5">Based on 1,420 reviews</span>
        </div>
      </div>
    </div>
  )
}
