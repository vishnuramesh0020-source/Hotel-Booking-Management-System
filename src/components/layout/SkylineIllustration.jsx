export default function SkylineIllustration({ className = '' }) {
  return (
    <div className={`w-full overflow-hidden flex items-end justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 540 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-h-[380px]"
        preserveAspectRatio="xMidYMax meet"
      >
        {/* Building 1: Leftmost angled roof with diagonal stripes */}
        <polygon
          points="20,380 20,290 85,250 85,380"
          fill="#eaf2f1"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Diagonal lines inside Building 1 */}
        <line x1="28" y1="365" x2="77" y2="332" stroke="#264b3d" strokeWidth="3" />
        <line x1="28" y1="340" x2="77" y2="307" stroke="#264b3d" strokeWidth="3" />
        <line x1="28" y1="315" x2="77" y2="282" stroke="#264b3d" strokeWidth="3" />
        <line x1="36" y1="290" x2="77" y2="262" stroke="#264b3d" strokeWidth="3" />

        {/* Building 2: Slanted tall building behind building 1 */}
        <polygon
          points="85,380 85,250 145,210 145,380"
          fill="#ffffff"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <line x1="105" y1="240" x2="105" y2="380" stroke="#264b3d" strokeWidth="2.5" />
        <line x1="125" y1="225" x2="125" y2="380" stroke="#264b3d" strokeWidth="2.5" />

        {/* Building 3: Center-left highrise with angle roof */}
        <polygon
          points="145,380 145,210 200,230 200,380"
          fill="#f4f8f7"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <line x1="172" y1="220" x2="172" y2="380" stroke="#264b3d" strokeWidth="2" strokeDasharray="6 8" />

        {/* Building 4: Center tall tower with angled rooftop */}
        <polygon
          points="180,380 180,185 240,150 255,160 255,380"
          fill="#ffffff"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Center line down the middle */}
        <line x1="240" y1="150" x2="240" y2="380" stroke="#264b3d" strokeWidth="3" />
        {/* Window slats in left facade */}
        <line x1="195" y1="195" x2="195" y2="350" stroke="#264b3d" strokeWidth="3" strokeDasharray="14 10" />
        <line x1="210" y1="185" x2="210" y2="350" stroke="#264b3d" strokeWidth="3" strokeDasharray="14 10" />
        <line x1="225" y1="175" x2="225" y2="350" stroke="#264b3d" strokeWidth="3" strokeDasharray="14 10" />

        {/* Building 5: Peach / Terracotta Accent Building */}
        <rect
          x="235"
          y="260"
          width="75"
          height="120"
          fill="#fcd8ce"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Peach building horizontal windows / slats */}
        <line x1="245" y1="275" x2="300" y2="275" stroke="#264b3d" strokeWidth="2.5" />
        <line x1="245" y1="295" x2="300" y2="295" stroke="#264b3d" strokeWidth="2.5" />
        <line x1="245" y1="315" x2="300" y2="315" stroke="#264b3d" strokeWidth="2.5" />
        <line x1="245" y1="335" x2="300" y2="335" stroke="#264b3d" strokeWidth="2.5" />
        <line x1="245" y1="355" x2="300" y2="355" stroke="#264b3d" strokeWidth="2.5" />

        {/* Building 6: Iconic Main Tall Skyscraper */}
        {/* Front facade */}
        <polygon
          points="310,380 310,140 345,115 345,380"
          fill="#fcf8ea"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Side facade */}
        <polygon
          points="345,115 380,135 380,380 345,380"
          fill="#ffffff"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Front windows (slats) */}
        <line x1="322" y1="145" x2="322" y2="360" stroke="#264b3d" strokeWidth="3.5" strokeDasharray="14 9" />
        <line x1="333" y1="140" x2="333" y2="360" stroke="#264b3d" strokeWidth="3.5" strokeDasharray="14 9" />
        {/* Side windows */}
        <line x1="358" y1="145" x2="358" y2="360" stroke="#264b3d" strokeWidth="3" strokeDasharray="12 10" />
        <line x1="370" y1="150" x2="370" y2="360" stroke="#264b3d" strokeWidth="3" strokeDasharray="12 10" />

        {/* Building 7: Far-right angled Skyscraper */}
        <polygon
          points="380,380 380,180 435,215 435,380"
          fill="#ffffff"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <line x1="398" y1="200" x2="398" y2="380" stroke="#264b3d" strokeWidth="2.5" />
        <line x1="416" y1="210" x2="416" y2="380" stroke="#264b3d" strokeWidth="2.5" />

        {/* Building 8: Edge angled background building */}
        <polygon
          points="435,380 435,260 480,290 480,380"
          fill="#edf6f3"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Foreground Tree 1: Left Bush / Tree */}
        <path
          d="M175 380 C155 380 145 365 145 350 C145 330 160 315 178 315 C185 315 192 318 198 322 C204 316 215 318 220 326 C228 335 228 355 222 365 C225 372 220 380 210 380 Z"
          fill="#ffffff"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Tree 1 Trunk / Branch doodle */}
        <line x1="180" y1="380" x2="180" y2="345" stroke="#264b3d" strokeWidth="3" />
        <line x1="180" y1="360" x2="170" y2="350" stroke="#264b3d" strokeWidth="2.5" />
        <line x1="180" y1="355" x2="190" y2="345" stroke="#264b3d" strokeWidth="2.5" />

        {/* Foreground Tree 2: Right Tree */}
        <path
          d="M420 380 C405 380 395 368 395 355 C395 338 410 325 425 325 C432 325 438 328 442 332 C448 328 456 330 460 338 C468 348 465 365 460 372 C462 376 458 380 450 380 Z"
          fill="#ffffff"
          stroke="#264b3d"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Tree 2 Trunk / Branch doodle */}
        <line x1="428" y1="380" x2="428" y2="348" stroke="#264b3d" strokeWidth="3" />
        <line x1="428" y1="365" x2="420" y2="355" stroke="#264b3d" strokeWidth="2.5" />
        <line x1="428" y1="360" x2="436" y2="352" stroke="#264b3d" strokeWidth="2.5" />

        {/* Ground Baseline */}
        <line x1="0" y1="380" x2="540" y2="380" stroke="#264b3d" strokeWidth="4" />
      </svg>
    </div>
  )
}
