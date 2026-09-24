import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Mail,
  MapPin,
  ShieldCheck,
  Globe,
  Star,
  Copy,
  Check,
  AlertCircle,
  Calendar,
  Sparkles,
  BedDouble,
  Award,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useGuests } from '../../context/GuestContext'
import Navbar from '../../components/layout/Navbar'
import GuestModal from '../../components/guests/GuestModal'
import DeleteGuestModal from '../../components/guests/DeleteGuestModal'

export default function GuestProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getGuest, editGuest, removeGuest } = useGuests()

  const [guest, setGuest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copiedField, setCopiedField] = useState(null)

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const fetchGuestData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getGuest(id)
      setGuest(data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Guest profile could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [id, getGuest])

  useEffect(() => {
    fetchGuestData()
  }, [fetchGuestData])

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    toast.info(`Copied ${fieldName} to clipboard!`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleSaveEdit = async (formData) => {
    const updated = await editGuest(guest.id, formData)
    setGuest(updated)
    toast.success(`Guest profile for ${formData.fullName} updated!`)
  }

  const handleConfirmDelete = async (guestId) => {
    try {
      await removeGuest(guestId)
      toast.success(`Guest ${guest?.fullName} has been removed.`)
      navigate('/guests')
    } catch (err) {
      toast.error(err.message || 'Failed to delete guest.')
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
              to="/guests"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Guest Directory</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-500">
              {guest ? guest.fullName : 'Guest Profile'}
            </span>
          </div>

          {guest && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#1b4332]" />
                <span>Edit Profile</span>
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
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-slate-200" />
              <div className="space-y-3">
                <div className="h-6 bg-slate-200 rounded-md w-48" />
                <div className="h-4 bg-slate-200 rounded-md w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="h-32 bg-slate-200 rounded-2xl" />
              <div className="h-32 bg-slate-200 rounded-2xl" />
              <div className="h-32 bg-slate-200 rounded-2xl" />
            </div>
          </div>
        )}

        {/* Error / Not Found State */}
        {!loading && (error || !guest) && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Guest Profile Not Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                {error || `We could not locate a guest matching identifier "${id}".`}
              </p>
            </div>
            <Link
              to="/guests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#1b4332] hover:bg-[#133225] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Directory</span>
            </Link>
          </div>
        )}

        {/* Main Guest Profile Content */}
        {!loading && guest && (
          <div className="space-y-6">
            {/* Hero Profile Banner Card */}
            <div className="relative overflow-hidden rounded-3xl bg-[#1b4332] text-white p-6 sm:p-8 shadow-xl">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <img
                    src={guest.avatar}
                    alt={guest.fullName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/20 bg-white shadow-lg shrink-0"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guest.fullName)}`
                    }}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        {guest.fullName}
                      </h1>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                          guest.vipStatus === 'VIP'
                            ? 'bg-amber-400 text-amber-950'
                            : guest.vipStatus === 'Corporate'
                              ? 'bg-blue-400 text-blue-950'
                              : 'bg-emerald-400 text-emerald-950'
                        }`}
                      >
                        {guest.vipStatus === 'VIP' && <Star className="w-3.5 h-3.5 fill-current" />}
                        <span>{guest.vipStatus} Guest</span>
                      </span>
                    </div>

                    <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Verified ID: {guest.idProofNumber}</span>
                      <span className="text-emerald-400">•</span>
                      <span>Nationality: {guest.nationality}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/80">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Registered: {new Date(guest.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-300" />
                        <span>{guest.totalStays || 1} Completed Stays</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-emerald-200 border border-white/10">
                    Live API Record #{guest.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Information Grid: Contact, Identification, and Preferences */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Verified Identification & Personal Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Identification</h3>
                    <p className="text-[11px] text-slate-400">Government ID & Citizenship</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-100">
                  {/* Full Name */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Full Legal Name
                    </span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{guest.fullName}</p>
                  </div>

                  {/* ID Proof Number */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      ID Proof Document Number
                    </span>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 mt-1">
                      <span className="font-mono font-bold text-sm text-slate-800">
                        {guest.idProofNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(guest.idProofNumber, 'ID Proof')}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition cursor-pointer"
                        title="Copy ID Proof"
                      >
                        {copiedField === 'ID Proof' ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nationality */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nationality / Citizenship
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe className="w-4 h-4 text-[#1b4332]" />
                      <p className="text-sm font-bold text-slate-800">{guest.nationality}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Contact Channels & Residential Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Contact Channels</h3>
                    <p className="text-[11px] text-slate-400">Communication & Billing Address</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-100">
                  {/* Email */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Email Address
                    </span>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 mt-1">
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {guest.email}
                      </span>
                      <button
                        onClick={() => handleCopy(guest.email, 'Email')}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition cursor-pointer"
                        title="Copy Email"
                      >
                        {copiedField === 'Email' ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Mobile Phone
                    </span>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 mt-1 font-mono">
                      <span className="text-xs font-bold text-slate-800">{guest.mobileNumber}</span>
                      <button
                        onClick={() => handleCopy(guest.mobileNumber, 'Phone')}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition cursor-pointer"
                        title="Copy Phone"
                      >
                        {copiedField === 'Phone' ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Physical Address */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Residential Address
                    </span>
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {guest.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Hospitality Stays & Preferences */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Hospitality Profile</h3>
                    <p className="text-[11px] text-slate-400">Preferences & Guest History</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-100">
                  {/* Preferred Room Type */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Preferred Room Category
                    </span>
                    <div className="flex items-center gap-2 mt-1 p-2.5 rounded-xl bg-[#f4f7f4] text-[#1b4332] font-bold text-xs">
                      <BedDouble className="w-4 h-4" />
                      <span>{guest.preferredRoomType || 'Deluxe King Suite'}</span>
                    </div>
                  </div>

                  {/* Special Notes */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Special Requests & Notes
                    </span>
                    <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                      {guest.notes || 'No special dietary or accessibility requests logged.'}
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      type="button"
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1b4332] hover:bg-[#133225] shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Guest</span>
                    </button>

                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      type="button"
                      className="py-2.5 px-4 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Guest Modal */}
      {guest && (
        <GuestModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          initialData={guest}
        />
      )}

      {/* Delete Confirmation Modal */}
      {guest && (
        <DeleteGuestModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          guest={guest}
        />
      )}
    </div>
  )
}
