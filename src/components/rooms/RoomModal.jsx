import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  X,
  PlusCircle,
  Edit3,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react'
import {
  PRESET_ROOM_IMAGES,
  ALL_AMENITIES,
  ROOM_TYPES,
} from '../../services/roomApi'

export default function RoomModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const isEditing = Boolean(initialData)
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [selectedPresetImage, setSelectedPresetImage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      roomNumber: '',
      roomType: ROOM_TYPES[0],
      pricePerNight: 8500,
      capacity: 2,
      floorNumber: 1,
      availabilityStatus: 'Available',
      roomImage: PRESET_ROOM_IMAGES[0].url,
      description: '',
    },
  })

  // Sync initialData when editing or opening
  useEffect(() => {
    if (initialData) {
      reset({
        roomNumber: initialData.roomNumber || '',
        roomType: initialData.roomType || ROOM_TYPES[0],
        pricePerNight: initialData.pricePerNight || 8500,
        capacity: initialData.capacity || 2,
        floorNumber: initialData.floorNumber || 1,
        availabilityStatus: initialData.availabilityStatus || 'Available',
        roomImage: initialData.roomImage || PRESET_ROOM_IMAGES[0].url,
        description: initialData.description || '',
      })
      setSelectedAmenities(initialData.amenities || [])
      setSelectedPresetImage(initialData.roomImage || PRESET_ROOM_IMAGES[0].url)
    } else {
      reset({
        roomNumber: '',
        roomType: ROOM_TYPES[0],
        pricePerNight: 8500,
        capacity: 2,
        floorNumber: 1,
        availabilityStatus: 'Available',
        roomImage: PRESET_ROOM_IMAGES[0].url,
        description: '',
      })
      setSelectedAmenities(['High-speed Wi-Fi', 'King Size Bed', 'Smart 4K TV'])
      setSelectedPresetImage(PRESET_ROOM_IMAGES[0].url)
    }
  }, [initialData, reset, isOpen])

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  const handleSelectPresetImage = (url) => {
    setSelectedPresetImage(url)
    setValue('roomImage', url, { shouldValidate: true })
  }

  const onFormSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...data,
        amenities: selectedAmenities,
        pricePerNight: Number(data.pricePerNight),
        capacity: Number(data.capacity),
        floorNumber: Number(data.floorNumber),
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center shadow-xs">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {isEditing ? `Edit Room #${initialData.roomNumber}` : 'Add New Room'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Update room specifications, pricing, and availability status.'
                  : 'Register a new luxury suite into the Hotelook system.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
          {/* Row 1: Room Number & Room Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Room Number <span className="text-emerald-700">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 305"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition ${
                  errors.roomNumber
                    ? 'border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#1b4332] focus:ring-[#1b4332]/10'
                }`}
                {...register('roomNumber', {
                  required: 'Room number is required',
                  pattern: {
                    value: /^[0-9A-Za-z-]+$/,
                    message: 'Letters, numbers, and dashes only',
                  },
                })}
              />
              {errors.roomNumber && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.roomNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Room Type <span className="text-emerald-700">*</span>
              </label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/10 cursor-pointer"
                {...register('roomType')}
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Price Per Night, Capacity, Floor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price Per Night (₹) <span className="text-emerald-700">*</span>
              </label>
              <input
                type="number"
                min="500"
                step="100"
                placeholder="8500"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition ${
                  errors.pricePerNight
                    ? 'border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#1b4332] focus:ring-[#1b4332]/10'
                }`}
                {...register('pricePerNight', {
                  required: 'Price per night is required',
                  min: { value: 500, message: 'Minimum ₹500' },
                })}
              />
              {errors.pricePerNight && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.pricePerNight.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Capacity (Guests)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1b4332]"
                {...register('capacity', { required: true, min: 1, max: 10 })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Floor Number
              </label>
              <input
                type="number"
                min="1"
                max="25"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1b4332]"
                {...register('floorNumber', { required: true, min: 1, max: 25 })}
              />
            </div>
          </div>

          {/* Row 3: Availability Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Availability Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Available', 'Occupied', 'Under Maintenance'].map((status) => (
                <label
                  key={status}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer hover:bg-slate-50 has-checked:border-[#1b4332] has-checked:bg-[#1b4332]/10 has-checked:text-[#1b4332] transition"
                >
                  <input
                    type="radio"
                    value={status}
                    className="accent-[#1b4332]"
                    {...register('availabilityStatus')}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preset Photo Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#1b4332]" />
                Room Photography
              </label>
              <span className="text-[11px] text-slate-400">Click photo to select</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESET_ROOM_IMAGES.map((img) => {
                const isSelected = selectedPresetImage === img.url
                return (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => handleSelectPresetImage(img.url)}
                    className={`relative rounded-xl overflow-hidden h-14 border-2 transition cursor-pointer group ${
                      isSelected
                        ? 'border-[#1b4332] ring-2 ring-[#1b4332]/30 scale-102'
                        : 'border-transparent hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#1b4332]/40 flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <input
              type="url"
              placeholder="Or paste custom image URL..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#1b4332]"
              {...register('roomImage')}
            />
          </div>

          {/* Amenities Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Included Amenities ({selectedAmenities.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200/80">
              {ALL_AMENITIES.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity)
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      isChecked
                        ? 'bg-[#1b4332] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                    <span>{amenity}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Room Description
            </label>
            <textarea
              rows={2}
              placeholder="Highlight views, bedding, luxury perks, or unique architecture..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1b4332]"
              {...register('description')}
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#1b4332] hover:bg-[#143729] active:scale-[0.99] shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Room'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
