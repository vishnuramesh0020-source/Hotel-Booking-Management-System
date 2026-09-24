import { Link } from 'react-router-dom'
import {
  Users,
  Layers,
  Sparkles,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Wrench,
} from 'lucide-react'

export default function RoomCard({ room, onEdit, onDelete }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
        }
      case 'Occupied':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Clock,
        }
      case 'Under Maintenance':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: Wrench,
        }
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Sparkles,
        }
    }
  }

  const statusConfig = getStatusBadge(room.availabilityStatus)
  const StatusIcon = statusConfig.icon

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      {/* Top Image & Badge Container */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={room.roomImage}
          alt={`${room.roomType} ${room.roomNumber}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null
            e.target.src =
              'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
          }}
        />

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1b4332]/90 backdrop-blur-sm text-white shadow-sm flex items-center gap-1">
            <span>Room #{room.roomNumber}</span>
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs flex items-center gap-1.5 ${statusConfig.bg}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{room.availabilityStatus}</span>
          </span>
        </div>

        {/* Bottom Image Overlay: Price Tag */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between text-white">
          <div>
            <p className="text-[10px] uppercase font-semibold text-emerald-200 tracking-wider">
              Rate per Night
            </p>
            <p className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-sm">
              ₹{Number(room.pricePerNight).toLocaleString()}
              <span className="text-xs font-normal text-slate-200 ml-1">/ night</span>
            </p>
          </div>

          <span className="text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-200 flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-300" />
            Floor {room.floorNumber}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Room Type & Capacity */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#1b4332] transition-colors leading-snug">
              {room.roomType}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
            </span>
          </div>

          {/* Amenities Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {room.amenities?.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-[11px] font-medium text-slate-600 bg-[#f4f4ec] px-2.5 py-0.5 rounded-md border border-slate-200/60"
              >
                {amenity}
              </span>
            ))}
            {room.amenities?.length > 3 && (
              <span className="text-[11px] font-medium text-[#1b4332] bg-[#1b4332]/10 px-2 py-0.5 rounded-md font-semibold">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* View Details Link */}
          <Link
            to={`/rooms/${room.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b4332] hover:text-[#133225] py-1.5 px-3 rounded-full hover:bg-[#1b4332]/10 transition"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </Link>

          {/* Management Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(room)}
              type="button"
              className="p-2 rounded-full text-slate-600 hover:text-[#1b4332] hover:bg-slate-100 transition cursor-pointer"
              title="Edit Room"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(room)}
              type="button"
              className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Delete Room"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
