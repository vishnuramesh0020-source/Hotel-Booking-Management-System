import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, User, Mail, Phone, MapPin, ShieldCheck, Globe, Star, Sparkles } from 'lucide-react'
import { NATIONALITY_OPTIONS, GUEST_TIERS } from '../../services/guestApi'

export default function GuestModal({ isOpen, onClose, onSave, initialData }) {
  const isEditing = Boolean(initialData)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      address: '',
      idProofNumber: '',
      nationality: NATIONALITY_OPTIONS[0],
      vipStatus: GUEST_TIERS[0],
      notes: '',
    },
  })

  // Synchronize form when editing or resetting
  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        mobileNumber: initialData.mobileNumber || '',
        address: initialData.address || '',
        idProofNumber: initialData.idProofNumber || '',
        nationality: initialData.nationality || NATIONALITY_OPTIONS[0],
        vipStatus: initialData.vipStatus || GUEST_TIERS[0],
        notes: initialData.notes || '',
      })
    } else {
      reset({
        fullName: '',
        email: '',
        mobileNumber: '',
        address: '',
        idProofNumber: '',
        nationality: NATIONALITY_OPTIONS[0],
        vipStatus: GUEST_TIERS[0],
        notes: '',
      })
    }
  }, [initialData, reset, isOpen])

  if (!isOpen) return null

  const onSubmit = async (data) => {
    try {
      await onSave(data)
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="flex-shrink-0 bg-[#1b4332] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/20 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {isEditing ? 'Edit Guest Profile' : 'Add New Guest'}
              </h2>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                {isEditing
                  ? `Updating record for ${initialData.fullName}`
                  : 'Register a new guest into the hotel directory'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Emily Johnson"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                  errors.fullName
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-[#1b4332] bg-slate-50 focus:bg-white'
                }`}
                {...register('fullName', {
                  required: 'Full Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  pattern: {
                    value: /^[a-zA-Z\s.'-]+$/,
                    message: 'Name can only contain letters and spaces',
                  },
                })}
              />
              {errors.fullName && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                placeholder="e.g. emily.johnson@hotelook.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-[#1b4332] bg-slate-50 focus:bg-white'
                }`}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Enter a valid email address (e.g. name@domain.com)',
                  },
                })}
              />
              {errors.email && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Mobile Number *</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                  errors.mobileNumber
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-[#1b4332] bg-slate-50 focus:bg-white'
                }`}
                {...register('mobileNumber', {
                  required: 'Mobile Number is required',
                  pattern: {
                    value: /^[+0-9\s()-]{8,20}$/,
                    message: 'Enter a valid mobile phone number (min 8 digits)',
                  },
                })}
              />
              {errors.mobileNumber && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>

            {/* ID Proof Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>ID Proof Number (Passport / Aadhaar / National ID) *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. PASS-9842104 or 4589-3210-9842"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                  errors.idProofNumber
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-[#1b4332] bg-slate-50 focus:bg-white'
                }`}
                {...register('idProofNumber', {
                  required: 'ID Proof Number is required',
                  minLength: { value: 4, message: 'ID Proof Number must be at least 4 characters' },
                })}
              />
              {errors.idProofNumber && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">
                  {errors.idProofNumber.message}
                </p>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Nationality *</span>
              </label>
              <select
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition cursor-pointer"
                {...register('nationality', { required: 'Nationality is required' })}
              >
                {NATIONALITY_OPTIONS.map((nat) => (
                  <option key={nat} value={nat}>
                    {nat}
                  </option>
                ))}
              </select>
            </div>

            {/* VIP Status Tier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-slate-400" />
                <span>Guest Tier / Status</span>
              </label>
              <select
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition cursor-pointer"
                {...register('vipStatus')}
              >
                {GUEST_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Residential Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Residential Address *</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 626 Main Street, Suite 400, Mumbai, Maharashtra"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                errors.address
                  ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30'
                  : 'border-slate-200 focus:ring-[#1b4332] bg-slate-50 focus:bg-white'
              }`}
              {...register('address', {
                required: 'Address is required',
                minLength: { value: 5, message: 'Address must be at least 5 characters' },
              })}
            />
            {errors.address && (
              <p className="text-[11px] font-semibold text-rose-600 mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Optional Guest Notes / Preferences */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>Special Requests or Stay Notes (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Prefers high floor away from elevator, vegetarian breakfast"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
              {...register('notes')}
            />
          </div>
          </div>

          {/* Action Buttons Sticky Footer */}
          <div className="flex-shrink-0 p-4 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#1b4332] hover:bg-[#133225] shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{isEditing ? 'Save Changes' : 'Register Guest'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
