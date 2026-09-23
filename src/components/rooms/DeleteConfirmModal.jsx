import { useState } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, room }) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !room) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onConfirm(room.id)
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
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Delete Room</h3>
            <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        {/* Room Info Preview Box */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
          <img
            src={room.roomImage}
            alt={room.roomNumber}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">Room #{room.roomNumber}</span>
              <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                Floor {room.floorNumber}
              </span>
            </div>
            <p className="text-xs text-slate-600 truncate mt-0.5">{room.roomType}</p>
            <p className="text-xs font-bold text-[#1b4332] mt-0.5">
              ₹{Number(room.pricePerNight).toLocaleString()}{' '}
              <span className="font-normal text-slate-400">/ night</span>
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Are you sure you want to permanently delete{' '}
          <strong className="text-slate-900 font-semibold">Room #{room.roomNumber}</strong>? It will
          be removed from the system and third-party inventory.
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
            <span>{isDeleting ? 'Deleting...' : 'Delete Room'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
