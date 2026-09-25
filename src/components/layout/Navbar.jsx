import { LogOut, LayoutDashboard, BedDouble, Users, Calendar, KeyRound, CreditCard, History, BarChart3 } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import HotelookLogo from './HotelookLogo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info('You have been logged out successfully.', {
      icon: '👋',
    })
    navigate('/login')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Brand Logo & Nav */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity">
            <HotelookLogo size="md" />
          </Link>

          {/* Navigation Links */}
          {user && (
            <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/60 overflow-x-auto">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`
                }
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/rooms"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`
                }
              >
                <BedDouble className="w-3.5 h-3.5" />
                <span>Rooms</span>
              </NavLink>

              <NavLink
                to="/guests"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`
                }
              >
                <Users className="w-3.5 h-3.5" />
                <span>Guests</span>
              </NavLink>

              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`
                }
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Bookings</span>
              </NavLink>

              <NavLink
                to="/checkin-checkout"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`
                }
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Check-In/Out</span>
              </NavLink>

              <NavLink
                to="/payments"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`
                }
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payments</span>
              </NavLink>

              <NavLink
                to="/booking-history"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`
                }
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </NavLink>

              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`
                }
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Reports</span>
              </NavLink>
            </nav>
          )}
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#1b4332] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-900 leading-tight">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1b4332]/10 text-[#1b4332]">
                      {user.role || 'User'}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[130px]">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                title="Log out of system"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
