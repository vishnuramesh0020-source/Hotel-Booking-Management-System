import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Users,
  Layers,
  Sparkles,
  Maximize2,
  CheckCircle2,
  Clock,
  Wrench,
  Check,
  AlertCircle,
  BedDouble,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useRooms } from '../../context/RoomContext'
import Navbar from '../../components/layout/Navbar'
import RoomModal from '../../components/rooms/RoomModal'
import DeleteConfirmModal from '../../components/rooms/DeleteConfirmModal'

export default function RoomDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getRoom, editRoom, removeRoom } = useRooms()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const fetchRoomData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRoom(id)
      setRoom(data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Room could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [id, getRoom])

  useEffect(() => {
    fetchRoomData()
  }, [fetchRoomData])

  // Handle Quick Status Change
  const handleStatusChange = async (newStatus) => {
    if (!room || room.availabilityStatus === newStatus) return
    setIsUpdatingStatus(true)
    try {
      const updated = await editRoom(room.id, { availabilityStatus: newStatus })
      setRoom(updated)
      toast.success(`Room status changed to ${newStatus}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update status.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Handle Save Edit
  const handleSaveEdit = async (formData) => {
    const updated = await editRoom(room.id, formData)
    setRoom(updated)
    toast.success(`Room #${formData.roomNumber} updated successfully!`)
  }

  // Handle Delete
  const handleConfirmDelete = async (roomId) => {
    try {
      await removeRoom(roomId)
      toast.success(`Room #${room?.roomNumber} has been deleted.`)
      navigate('/rooms')
    } catch (err) {
      toast.error(err.message || 'Failed to delete room.')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
        }
      case 'Occupied':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: Clock,
        }
      case 'Under Maintenance':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          icon: Wrench,
        }
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-500',
          icon: Sparkles,
        }
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 space-y-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Rooms</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-500">
              {room ? `Room #${room.roomNumber}` : 'Room Details'}
            </span>
          </div>

          {room && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#1b4332]" />
                <span>Edit Room</span>
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 animate-pulse space-y-6">
            <div className="h-80 bg-slate-200 rounded-2xl w-full" />
            <div className="space-y-3">
              <div className="h-8 bg-slate-200 rounded-md w-1/3" />
              <div className="h-4 bg-slate-200 rounded-md w-1/2" />
            </div>
          </div>
        )}

        {/* Error / Not Found State */}
        {!loading && (error || !room) && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Room Not Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                {error || `We couldn't locate a room matching the identifier "${id}".`}
              </p>
            </div>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#1b4332] hover:bg-[#133225] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Room List</span>
            </Link>
          </div>
        )}

        {/* Main Room Details Content */}
        {!loading && room && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Media & Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Image Showcase */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm h-72 sm:h-96 w-full">
                <img
                  src={room.roomImage}
                  alt={`${room.roomType} ${room.roomNumber}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src =
                      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Floating Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#1b4332] text-white shadow-md flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>Room #{room.roomNumber}</span>
                  </span>

                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                      getStatusBadge(room.availabilityStatus).bg
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${getStatusBadge(room.availabilityStatus).dot}`}
                    />
                    <span>{room.availabilityStatus}</span>
                  </span>
                </div>

                {/* Bottom Overlay Title on Image */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                    Floor {room.floorNumber} • {room.capacity} Guests
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                    {room.roomType}
                  </h2>
                </div>
              </div>

              {/* Room Overview Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Room Overview</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">{room.description}</p>
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-slate-200 shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Floor Level</p>
                      <p className="text-xs font-extrabold text-slate-800">Floor {room.floorNumber}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-slate-200 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Max Capacity</p>
                      <p className="text-xs font-extrabold text-slate-800">{room.capacity} Guests</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-slate-200 shrink-0">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Bedding</p>
                      <p className="text-xs font-extrabold text-slate-800 truncate max-w-[100px]">
                        {room.bedType || 'King Bed'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-slate-200 shrink-0">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Total Area</p>
                      <p className="text-xs font-extrabold text-slate-800 truncate max-w-[100px]">
                        {room.roomSize || '48 m²'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities Section */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Amenities & Features</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {room.amenities?.length || 0} Included
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {room.amenities?.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f7f7f2] border border-slate-200/60 text-slate-700"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-xs font-semibold">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Quick Controls */}
            <div className="space-y-6">
              {/* Pricing Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Published Rate
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#1b4332]">
                      ₹{Number(room.pricePerNight).toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-slate-500">/ night</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Includes GST, breakfast buffet, and high-speed Wi-Fi access.
                  </p>
                </div>

                {/* Quick Availability Status Changer */}
                <div className="pt-5 border-t border-slate-100 space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Change Availability Status
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { status: 'Available', color: 'emerald', label: 'Mark as Available' },
                      { status: 'Occupied', color: 'amber', label: 'Mark as Occupied' },
                      {
                        status: 'Under Maintenance',
                        color: 'rose',
                        label: 'Mark as Maintenance',
                      },
                    ].map((item) => {
                      const isActive = room.availabilityStatus === item.status
                      return (
                        <button
                          key={item.status}
                          type="button"
                          disabled={isUpdatingStatus || isActive}
                          onClick={() => handleStatusChange(item.status)}
                          className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-between border transition cursor-pointer ${
                            isActive
                              ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.status === 'Available'
                                  ? 'bg-emerald-400'
                                  : item.status === 'Occupied'
                                    ? 'bg-amber-400'
                                    : 'bg-rose-400'
                              }`}
                            />
                            <span>{item.status}</span>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Third-Party API Sync Notice */}
                <div className="pt-4 border-t border-slate-100 bg-[#f4f7f4] -mx-6 -mb-6 p-5 rounded-b-3xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#1b4332] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">DummyJSON API Connected</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      Room status and modifications are mirrored through Axios REST calls and stored
                      locally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Room Modal */}
      {room && (
        <RoomModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          initialData={room}
        />
      )}

      {/* Delete Confirmation Modal */}
      {room && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          room={room}
        />
      )}
    </div>
  )
}
