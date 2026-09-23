import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  AlertCircle,
  BedDouble,
  CheckCircle2,
  Clock,
  Wrench,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useRooms } from '../../context/RoomContext'
import { ROOM_TYPES } from '../../services/roomApi'
import Navbar from '../../components/layout/Navbar'
import RoomCard from '../../components/rooms/RoomCard'
import RoomModal from '../../components/rooms/RoomModal'
import DeleteConfirmModal from '../../components/rooms/DeleteConfirmModal'

const ITEMS_PER_PAGE = 8

export default function RoomList() {
  const { rooms, isLoading, error, loadRooms, addRoom, editRoom, removeRoom } = useRooms()

  // State for filters & search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortBy, setSortBy] = useState('roomNumber-asc')
  const [currentPage, setCurrentPage] = useState(1)

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingRoom, setDeletingRoom] = useState(null)

  // Room status counts
  const stats = useMemo(() => {
    return {
      total: rooms.length,
      available: rooms.filter((r) => r.availabilityStatus === 'Available').length,
      occupied: rooms.filter((r) => r.availabilityStatus === 'Occupied').length,
      maintenance: rooms.filter((r) => r.availabilityStatus === 'Under Maintenance').length,
    }
  }, [rooms])

  // Filtered and sorted rooms
  const filteredRooms = useMemo(() => {
    let result = [...rooms]

    // 1. Search Query filter (roomNumber, roomType, or amenities)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (r) =>
          r.roomNumber.toLowerCase().includes(q) ||
          r.roomType.toLowerCase().includes(q) ||
          r.amenities?.some((a) => a.toLowerCase().includes(q))
      )
    }

    // 2. Room Type filter
    if (selectedType !== 'All') {
      result = result.filter((r) => r.roomType === selectedType)
    }

    // 3. Availability filter
    if (selectedStatus !== 'All') {
      result = result.filter((r) => r.availabilityStatus === selectedStatus)
    }

    // 4. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return Number(a.pricePerNight) - Number(b.pricePerNight)
        case 'price-desc':
          return Number(b.pricePerNight) - Number(a.pricePerNight)
        case 'roomNumber-desc':
          return String(b.roomNumber).localeCompare(String(a.roomNumber), undefined, {
            numeric: true,
          })
        case 'roomNumber-asc':
        default:
          return String(a.roomNumber).localeCompare(String(b.roomNumber), undefined, {
            numeric: true,
          })
      }
    })

    return result
  }, [rooms, searchQuery, selectedType, selectedStatus, sortBy])

  // Pagination calculation
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE) || 1
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredRooms.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredRooms, currentPage])

  // Handle page reset on filter changes
  const handleFilterChange = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedType('All')
    setSelectedStatus('All')
    setSortBy('roomNumber-asc')
    setCurrentPage(1)
  }

  const isFilterActive =
    searchQuery.trim() !== '' ||
    selectedType !== 'All' ||
    selectedStatus !== 'All' ||
    sortBy !== 'roomNumber-asc'

  // Modal Handlers
  const handleOpenAdd = () => {
    setEditingRoom(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (room) => {
    setEditingRoom(room)
    setIsModalOpen(true)
  }

  const handleSaveRoom = async (formData) => {
    if (editingRoom) {
      await editRoom(editingRoom.id, formData)
      toast.success(`Room #${formData.roomNumber} updated successfully!`)
    } else {
      await addRoom(formData)
      toast.success(`New Room #${formData.roomNumber} created successfully!`)
    }
  }

  const handleOpenDelete = (room) => {
    setDeletingRoom(room)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async (id) => {
    try {
      await removeRoom(id)
      toast.success(`Room #${deletingRoom?.roomNumber} deleted successfully.`)
    } catch (err) {
      toast.error(err.message || 'Failed to delete room.')
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Top Header & Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1b4332]/10 text-[#1b4332]">
                Room Management
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Live Third-Party API (DummyJSON)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Hotel Rooms & Suites
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Monitor, configure, and manage guest rooms, pricing in ₹, and real-time occupancy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#1b4332] hover:bg-[#133225] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Room</span>
            </button>
          </div>
        </div>

        {/* Quick Inventory Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Rooms</p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Available</p>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">{stats.available}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Occupied</p>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-600">{stats.occupied}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Maintenance</p>
              <p className="text-xl sm:text-2xl font-extrabold text-rose-600">{stats.maintenance}</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                placeholder="Search by Room Number, Type, or Amenity..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => handleFilterChange(setSearchQuery, '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Room Type Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => handleFilterChange(setSelectedType, e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 border-none outline-none cursor-pointer focus:ring-0 pr-2"
                >
                  <option value="All">All Types</option>
                  {ROOM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleFilterChange(setSelectedStatus, e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 border-none outline-none cursor-pointer focus:ring-0 pr-2"
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>

              {/* Price & Number Sorting */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 border-none outline-none cursor-pointer focus:ring-0 pr-2"
                >
                  <option value="roomNumber-asc">Room # (Low to High)</option>
                  <option value="roomNumber-desc">Room # (High to Low)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              {isFilterActive && (
                <button
                  onClick={handleResetFilters}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Indicators */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredRooms.length}</strong> of{' '}
              {rooms.length} total rooms
            </span>
            {isFilterActive && (
              <span className="text-[#1b4332] font-semibold bg-[#1b4332]/5 px-2 py-0.5 rounded-full">
                Filters applied
              </span>
            )}
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 animate-pulse space-y-4 p-4"
              >
                <div className="h-48 bg-slate-200 rounded-2xl w-full" />
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded-md w-16" />
                  <div className="h-6 bg-slate-200 rounded-md w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-900">Failed to Connect to Room Service</h3>
              <p className="text-xs text-rose-600 mt-1">{error}</p>
            </div>
            <button
              onClick={loadRooms}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredRooms.length === 0 && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <BedDouble className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-800">No rooms found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No hotel rooms matched your search keywords or filter criteria. Try adjusting your
                filters or search terms.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-[#1b4332] bg-[#1b4332]/10 hover:bg-[#1b4332]/20 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Room Grid */}
        {!isLoading && !error && filteredRooms.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
                  <strong className="text-slate-800">{totalPages}</strong> (
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredRooms.length)} of{' '}
                  {filteredRooms.length} rooms)
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-[#1b4332] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Room Modal */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoom}
        initialData={editingRoom}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        room={deletingRoom}
      />
    </div>
  )
}
