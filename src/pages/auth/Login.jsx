import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/layout/AuthLayout'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('user')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Quick fill demo account when toggling role
  const handleRoleChange = (role) => {
    setSelectedRole(role)
    if (role === 'user') {
      setValue('email', 'guest@hotel.com', { shouldValidate: true })
      setValue('password', 'Password123!', { shouldValidate: true })
      toast.info('Filled credentials: As a User', { autoClose: 1500 })
    } else {
      setValue('email', 'admin@hotel.com', { shouldValidate: true })
      setValue('password', 'Admin123!', { shouldValidate: true })
      toast.info('Filled credentials: As a Hotel Owner', { autoClose: 1500 })
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const user = await login(data.email, data.password)
      toast.success(`Welcome back, ${user.name}!`)
      const destination = location.state?.from?.pathname || '/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialMock = (provider) => {
    toast.info(`${provider} sign-in simulated. Use credentials below to log in.`, {
      autoClose: 2000,
    })
  }

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Title & Subtitle */}
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Sign In
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-normal">
            Welcome back! Please enter your details to continue
          </p>
        </div>

        {/* Role Radios: As a User / As a Hotel Owner */}
        <div className="flex items-center justify-center gap-7 mb-5">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="roleSelect"
              checked={selectedRole === 'user'}
              onChange={() => handleRoleChange('user')}
              className="w-4 h-4 text-[#1d5635] accent-[#1d5635] focus:ring-[#1d5635] cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-700">As a User</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="roleSelect"
              checked={selectedRole === 'owner'}
              onChange={() => handleRoleChange('owner')}
              className="w-4 h-4 text-[#1d5635] accent-[#1d5635] focus:ring-[#1d5635] cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-700">As a Hotel Owner</span>
          </label>
        </div>

        {/* Social Sign In Buttons */}
        <div className="space-y-2.5 mb-4">
          {/* Sign in with Google */}
          <button
            type="button"
            onClick={() => handleSocialMock('Google')}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] border border-slate-200/90 rounded-full flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-800 shadow-xs transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Sign in with Apple */}
          <button
            type="button"
            onClick={() => handleSocialMock('Apple')}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] border border-slate-200/90 rounded-full flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-800 shadow-xs transition cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.92-.93.04-2.03.63-2.68 1.4-.57.65-1.07 1.74-.93 2.8 1.03.08 2.05-.53 2.67-1.28z" />
            </svg>
            <span>Sign in with Apple</span>
          </button>
        </div>

        {/* OR Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-300"></div>
          <span className="flex-shrink mx-3 text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            OR
          </span>
          <div className="flex-grow border-t border-slate-300"></div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 text-left">
              Email <span className="text-[#1d5635]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="hello@delisas.com"
                className={`w-full pl-11 pr-4 py-2.5 bg-white border rounded-full text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 transition shadow-xs ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#1d5635] focus:ring-[#1d5635]/20'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500 text-left flex items-center gap-1 pl-2">
                <AlertCircle className="w-3 h-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-800">
                Password <span className="text-[#1d5635]">*</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#1d5635] hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                className={`w-full pl-11 pr-11 py-2.5 bg-white border rounded-full text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 transition shadow-xs ${
                  errors.password
                    ? 'border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#1d5635] focus:ring-[#1d5635]/20'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-500 text-left flex items-center gap-1 pl-2">
                <AlertCircle className="w-3 h-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-6 rounded-full font-semibold text-sm text-white bg-[#1d5635] hover:bg-[#16442a] active:scale-[0.99] transition shadow-md shadow-[#1d5635]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sing in</span>
            )}
          </button>

          {/* Sign Up Link */}
          <div className="pt-2 text-center text-xs text-slate-600 font-normal">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#1d5635] underline hover:text-[#16442a] ml-1"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
