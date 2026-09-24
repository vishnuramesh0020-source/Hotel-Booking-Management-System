import { useState } from 'react'
import { AlertTriangle, Trash2, X, ShieldCheck } from 'lucide-react'

export default function DeleteGuestModal({ isOpen, onClose, onConfirm, guest }) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !guest) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onConfirm(guest.id)
      onClose()
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Delete Guest Record</h3>
            <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        {/* Guest Info Preview Box */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
          <img
            src={guest.avatar}
            alt={guest.fullName}
            className="w-12 h-12 rounded-full object-cover border border-slate-200 bg-white shrink-0"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guest.fullName)}`
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 truncate">
                {guest.fullName}
              </span>
              <span className="text-[10px] font-bold text-[#1b4332] bg-[#1b4332]/10 px-2 py-0.5 rounded-full shrink-0">
                {guest.vipStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{guest.email}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{guest.idProofNumber}</span>
              <span className="text-slate-300">•</span>
              <span>{guest.nationality}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Are you sure you want to permanently remove{' '}
          <strong className="text-slate-900 font-semibold">{guest.fullName}</strong> from the guest
          roster? All past stay records and identification references will be purged.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>{isDeleting ? 'Deleting...' : 'Delete Guest'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
