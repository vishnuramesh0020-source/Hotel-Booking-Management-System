import {
  User,
  Shield,
  Calendar,
  BedDouble,
  Sparkles,
  LogOut,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/layout/Navbar'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.info('You have been logged out.')
  }

  return (
    <div className="min-h-screen bg-[#f4f4ec] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#1b4332] text-white p-6 sm:p-10 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authenticated Session Active</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="mt-2 text-sm sm:text-base text-emerald-100/90 max-w-2xl">
                You are currently signed in to <span className="font-bold text-white">Hotelook</span> as{' '}
                <span className="font-semibold underline decoration-amber-400">{user?.role}</span>.
                Your profile and active credentials are saved in browser Local Storage.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleLogout}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Details & Session Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information Card */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Stored User Profile</h2>
                  <p className="text-xs text-slate-500">
                    Values pulled directly from Local Storage (`hbms_auth_user`)
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </span>
                <p className="text-sm font-bold text-slate-900">{user?.name || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </span>
                <p className="text-sm font-bold text-slate-900">{user?.email || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Contact Phone
                </span>
                <p className="text-sm font-bold text-slate-900">{user?.phone || 'Not provided'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Account Role
                </span>
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#1b4332]/10 text-[#1b4332]">
                  {user?.role || 'User'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f8f2] border border-slate-200/60 sm:col-span-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Session Token
                </span>
                <p className="text-xs font-mono text-slate-700 break-all bg-white p-2.5 rounded-xl border border-slate-200">
                  {user?.token || 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* Hotel Management Quick Stats Overview */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-[#1b4332]" />
                <span>Hotelook Services</span>
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Booking Mode</p>
                    <p className="text-sm font-bold text-[#1b4332]">{user?.role || 'User'}</p>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#1b4332]" />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Reservations</p>
                    <p className="text-sm font-bold text-slate-900">0 Active</p>
                  </div>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8f8f2] border border-slate-200/60">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Protected State</p>
                    <p className="text-sm font-bold text-emerald-700">Authenticated</p>
                  </div>
                  <Shield className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
