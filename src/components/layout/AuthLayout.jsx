import logoImg from '../../assets/hotelook_logo_transparent.png'
import avatarImg from '../../assets/alex_avatar_clean.png'
import skylineImg from '../../assets/skyline_clean_trimmed.png'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#1b4332]/10 p-2 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans">
      {/* Main Card Frame matching First Image */}
      <div className="w-full max-w-[1024px] bg-[#efefe3] rounded-[24px] lg:rounded-[36px] overflow-hidden shadow-2xl border border-slate-300/70 flex flex-col lg:flex-row min-h-[680px] lg:h-[720px] relative">
        {/* Left Side: Soft Cream (#efefe3) with Brand Logo & Form */}
        <div className="w-full lg:w-1/2 bg-[#efefe3] flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative z-10">
          {/* Top Hotelook Brand Logo */}
          <div className="flex items-center">
            <img
              src={logoImg}
              alt="Hotelook"
              className="h-8 sm:h-9 object-contain select-none"
            />
          </div>

          {/* Form Content (Centered) */}
          <div className="w-full max-w-[370px] mx-auto my-auto py-2">
            {children}
          </div>

          {/* Bottom spacing helper */}
          <div className="h-1 sm:h-2" />
        </div>

        {/* Right Side: Clean White Background with Testimonial & Full-Color Skyline */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-between relative border-t lg:border-t-0 lg:border-l border-slate-200/50 overflow-hidden">
          {/* Top Testimonial Section */}
          <div className="w-full max-w-[440px] px-6 sm:px-10 lg:px-12 pt-6 sm:pt-8 lg:pt-10 z-10 relative">
            {/* Orange Opening Quote Mark */}
            <div
              className="text-[#f07f2e] text-3xl sm:text-4xl font-black font-serif leading-none mb-2 select-none"
              aria-hidden="true"
            >
              “
            </div>

            {/* Testimonial Text */}
            <p className="text-slate-800 text-sm sm:text-[15px] lg:text-[16px] font-medium leading-relaxed tracking-tight mb-2">
              Seamless booking experience! The app makes finding and reserving rooms so easy.
              I loved the instant confirmation and personalized recommendations. Definitely my
              go-to for all future stays.
            </p>

            {/* Orange Closing Quote Mark */}
            <div
              className="text-[#f07f2e] text-3xl sm:text-4xl font-black font-serif leading-none text-right -mt-2 mb-3 select-none"
              aria-hidden="true"
            >
              ”
            </div>

            {/* Author Profile */}
            <div className="flex items-center gap-3">
              <img
                src={avatarImg}
                alt="Alex Mitchell"
                className="w-9 h-9 rounded-full object-cover shadow-xs border border-slate-200"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Alex Mitchell
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-normal">
                  Amsterdam
                </span>
              </div>
            </div>
          </div>

          {/* Bottom City Skyline Illustration: Full Width & Full Solid Color */}
          <div className="w-full relative flex items-end justify-center lg:justify-end mt-auto pointer-events-none select-none overflow-hidden">
            <img
              src={skylineImg}
              alt="City skyline illustration"
              className="w-full min-w-[500px] sm:min-w-[560px] lg:min-w-[620px] max-w-none lg:-mr-6 h-auto object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
