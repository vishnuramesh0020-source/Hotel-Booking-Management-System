import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  ArrowUpDown,
  RotateCcw,
  AlertCircle,
  Users,
  Star,
  Globe,
  ShieldCheck,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useGuests } from '../../context/GuestContext'
import { NATIONALITY_OPTIONS, GUEST_TIERS } from '../../services/guestApi'
import Navbar from '../../components/layout/Navbar'
import GuestModal from '../../components/guests/GuestModal'
import DeleteGuestModal from '../../components/guests/DeleteGuestModal'

const ITEMS_PER_PAGE = 8

export default function GuestList() {
  const { guests, isLoading, error, loadGuests, addGuest, editGuest, removeGuest } = useGuests()

  // State for filters & search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState('All')
  const [selectedNationality, setSelectedNationality] = useState('All')
  const [sortBy, setSortBy] = useState('name-asc')
  const [currentPage, setCurrentPage] = useState(1)

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingGuest, setDeletingGuest] = useState(null)

  // Summary Metrics
  const stats = useMemo(() => {
    return {
      total: guests.length,
      vip: guests.filter((g) => g.vipStatus === 'VIP').length,
      regular: guests.filter((g) => g.vipStatus === 'Regular').length,
      corporate: guests.filter((g) => g.vipStatus === 'Corporate').length,
    }
  }, [guests])

  // Filtered and sorted guests
  const filteredGuests = useMemo(() => {
    let result = [...guests]

    // 1. Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (g) =>
          g.fullName.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          g.mobileNumber.toLowerCase().includes(q) ||
          g.idProofNumber.toLowerCase().includes(q) ||
          g.nationality.toLowerCase().includes(q) ||
          g.address.toLowerCase().includes(q)
      )
    }

    // 2. Guest Tier filter
    if (selectedTier !== 'All') {
      result = result.filter((g) => g.vipStatus === selectedTier)
    }

    // 3. Nationality filter
    if (selectedNationality !== 'All') {
      result = result.filter((g) => g.nationality === selectedNationality)
    }

    // 4. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-desc':
          return b.fullName.localeCompare(a.fullName)
        case 'stays-desc':
          return Number(b.totalStays || 0) - Number(a.totalStays || 0)
        case 'recent':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        case 'name-asc':
        default:
          return a.fullName.localeCompare(b.fullName)
      }
    })

    return result
  }, [guests, searchQuery, selectedTier, selectedNationality, sortBy])

  // Pagination calculation
  const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE) || 1
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredGuests.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredGuests, currentPage])

  // Handlers for filter reset
  const handleFilterChange = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedTier('All')
    setSelectedNationality('All')
    setSortBy('name-asc')
    setCurrentPage(1)
  }

  const isFilterActive =
    searchQuery.trim() !== '' ||
    selectedTier !== 'All' ||
    selectedNationality !== 'All' ||
    sortBy !== 'name-asc'

  // Modal Handlers
  const handleOpenAdd = () => {
    setEditingGuest(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (guest) => {
    setEditingGuest(guest)
    setIsModalOpen(true)
  }

  const handleSaveGuest = async (formData) => {
    if (editingGuest) {
      await editGuest(editingGuest.id, formData)
      toast.success(`Guest profile for ${formData.fullName} updated!`)
    } else {
      await addGuest(formData)
      toast.success(`New guest ${formData.fullName} successfully registered!`)
    }
  }

  const handleOpenDelete = (guest) => {
    setDeletingGuest(guest)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async (id) => {
    try {
      await removeGuest(id)
      toast.success(`Guest ${deletingGuest?.fullName} removed from roster.`)
    } catch (err) {
      toast.error(err.message || 'Failed to delete guest.')
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
                Guest Management
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Live Third-Party API (DummyJSON Users)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Guest Profiles & Directory
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Maintain guest contact records, ID proof verification, nationality details, and stay histories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#1b4332] hover:bg-[#133225] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Guest</span>
            </button>
          </div>
        </div>

        {/* Guest Summary KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Registered</p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">VIP Guests</p>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-600">{stats.vip}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Corporate Clients</p>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-600">{stats.corporate}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Regular Patrons</p>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">{stats.regular}</p>
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
                placeholder="Search by Name, Email, Phone, Nationality, or ID Proof..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => handleFilterChange(setSearchQuery, '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Tier Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Tier:</span>
                <select
                  value={selectedTier}
                  onChange={(e) => handleFilterChange(setSelectedTier, e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 border-none outline-none cursor-pointer focus:ring-0 pr-2"
                >
                  <option value="All">All Tiers</option>
                  {GUEST_TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nationality Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Country:</span>
                <select
                  value={selectedNationality}
                  onChange={(e) => handleFilterChange(setSelectedNationality, e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 border-none outline-none cursor-pointer focus:ring-0 pr-2"
                >
                  <option value="All">All Nationalities</option>
                  {NATIONALITY_OPTIONS.map((nat) => (
                    <option key={nat} value={nat}>
                      {nat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 border-none outline-none cursor-pointer focus:ring-0 pr-2"
                >
                  <option value="name-asc">Name (A to Z)</option>
                  <option value="name-desc">Name (Z to A)</option>
                  <option value="stays-desc">Stays (High to Low)</option>
                  <option value="recent">Recently Added</option>
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
              Showing <strong className="text-slate-800">{filteredGuests.length}</strong> of{' '}
              {guests.length} total guests
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
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-48" />
                    <div className="h-3 bg-slate-200 rounded w-32" />
                  </div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-24 hidden sm:block" />
                <div className="h-8 bg-slate-200 rounded-full w-20" />
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
              <h3 className="text-base font-bold text-rose-900">Failed to Connect to Guest Service</h3>
              <p className="text-xs text-rose-600 mt-1">{error}</p>
            </div>
            <button
              onClick={loadGuests}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredGuests.length === 0 && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-800">No guests found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No guest records matched your search query or filter parameters. Try clearing your filters.
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

        {/* Guest List Directory: Responsive Table & Mobile Cards */}
        {!isLoading && !error && filteredGuests.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#f7f7f2] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Guest Profile</th>
                      <th className="py-4 px-6">Contact Details</th>
                      <th className="py-4 px-6">ID Proof Number</th>
                      <th className="py-4 px-6">Nationality & Address</th>
                      <th className="py-4 px-6 text-center">Tier</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {paginatedGuests.map((guest) => (
                      <tr
                        key={guest.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Guest Profile & Avatar */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={guest.avatar}
                              alt={guest.fullName}
                              className="w-11 h-11 rounded-full object-cover border border-slate-200 bg-slate-50 shrink-0"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guest.fullName)}`
                              }}
                            />
                            <div>
                              <Link
                                to={`/guests/${guest.id}`}
                                className="font-extrabold text-slate-900 group-hover:text-[#1b4332] transition-colors leading-snug hover:underline block"
                              >
                                {guest.fullName}
                              </Link>
                              <span className="text-[11px] text-slate-400 font-medium">
                                Stays: {guest.totalStays || 1} • {guest.preferredRoomType || 'Suite'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact Details */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-slate-700">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[190px]">{guest.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{guest.mobileNumber}</span>
                            </div>
                          </div>
                        </td>

                        {/* ID Proof Number */}
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-100 border border-slate-200 text-slate-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{guest.idProofNumber}</span>
                          </div>
                        </td>

                        {/* Nationality & Address */}
                        <td className="py-4 px-6">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                              <Globe className="w-3.5 h-3.5 text-slate-400" />
                              <span>{guest.nationality}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate max-w-[220px] mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{guest.address}</span>
                            </p>
                          </div>
                        </td>

                        {/* Guest Tier */}
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              guest.vipStatus === 'VIP'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : guest.vipStatus === 'Corporate'
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {guest.vipStatus === 'VIP' && <Star className="w-3 h-3 fill-amber-500 text-amber-500" />}
                            <span>{guest.vipStatus}</span>
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/guests/${guest.id}`}
                              className="p-2 rounded-full text-slate-600 hover:text-[#1b4332] hover:bg-slate-100 transition cursor-pointer"
                              title="View Guest Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleOpenEdit(guest)}
                              type="button"
                              className="p-2 rounded-full text-slate-600 hover:text-[#1b4332] hover:bg-slate-100 transition cursor-pointer"
                              title="Edit Guest Profile"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenDelete(guest)}
                              type="button"
                              className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Guest Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
                  <strong className="text-slate-800">{totalPages}</strong> (
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredGuests.length)} of{' '}
                  {filteredGuests.length} guests)
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

      {/* Add / Edit Guest Modal */}
      <GuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGuest}
        initialData={editingGuest}
      />

      {/* Delete Confirmation Modal */}
      <DeleteGuestModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        guest={deletingGuest}
      />
    </div>
  )
}
