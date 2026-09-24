export default function HotelookLogo({ size = 'md', className = '' }) {
  const isLg = size === 'lg'
  const isSm = size === 'sm'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Hotelook Pin Icon */}
      <svg
        className={isLg ? 'w-9 h-9' : isSm ? 'w-6 h-6' : 'w-8 h-8'}
        viewBox="0 0 40 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Pin Shape */}
        <path
          d="M20 2C10.61 2 3 9.61 3 19C3 29.5 17.5 40.5 19.1 41.7C19.6 42.1 20.4 42.1 20.9 41.7C22.5 40.5 37 29.5 37 19C37 9.61 29.39 2 20 2Z"
          fill="#1b4332"
        />
        {/* House / Building inside Pin */}
        <path
          d="M20 10L11 17.5V27H17V21H23V27H29V17.5L20 10Z"
          fill="#ffffff"
        />
        {/* House Door / Accent */}
        <circle cx="20" cy="15" r="1.5" fill="#1b4332" />
      </svg>

      {/* Brand Text */}
      <span
        className={`font-bold tracking-tight text-[#16382b] ${
          isLg ? 'text-2xl' : isSm ? 'text-lg' : 'text-xl'
        }`}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        Hotelook
      </span>
    </div>
  )
}
