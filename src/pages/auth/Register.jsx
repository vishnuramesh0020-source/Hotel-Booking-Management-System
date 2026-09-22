import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/layout/AuthLayout'

export default function Register() {
  const { register: registerAuth } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('user')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: true,
    },
  })

  const passwordVal = watch('password')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await registerAuth({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: selectedRole === 'owner' ? 'Hotel Owner' : 'User',
        password: data.password,
      })
      toast.success('Account created successfully! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header Titles */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Sign Up
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Create an account to start reserving and managing stays
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="registerRole"
              checked={selectedRole === 'user'}
              onChange={() => setSelectedRole('user')}
              className="w-4 h-4 text-[#1b4332] accent-[#1b4332] cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-700">As a User</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="registerRole"
              checked={selectedRole === 'owner'}
              onChange={() => setSelectedRole('owner')}
              className="w-4 h-4 text-[#1b4332] accent-[#1b4332] cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-700">As a Hotel Owner</span>
          </label>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 text-left">
              Full Name <span className="text-emerald-700">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Alex Mitchell"
                className={`w-full pl-11 pr-4 py-2.5 bg-white border rounded-full text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  errors.name
                    ? 'border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#1b4332] focus:ring-[#1b4332]/20'
                }`}
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500 text-left flex items-center gap-1 pl-2">
                <AlertCircle className="w-3 h-3" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 text-left">
              Email <span className="text-emerald-700">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="alex@example.com"
                className={`w-full pl-11 pr-4 py-2.5 bg-white border rounded-full text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#1b4332] focus:ring-[#1b4332]/20'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Enter a valid email address',
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

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 text-left">
              Phone Number <span className="text-emerald-700">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder="+31 20 123 4567"
                className={`w-full pl-11 pr-4 py-2.5 bg-white border rounded-full text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  errors.phone
                    ? 'border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#1b4332] focus:ring-[#1b4332]/20'
                }`}
                {...register('phone', {
                  required: 'Phone number is required',
                  minLength: {
                    value: 7,
                    message: 'Enter valid phone number',
                  },
                })}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-rose-500 text-left flex items-center gap-1 pl-2">
                <AlertCircle className="w-3 h-3" />
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 text-left">
              Password <span className="text-emerald-700">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                className={`w-full pl-11 pr-11 py-2.5 bg-white border rounded-full text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  errors.password
                    ? 'border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#1b4332] focus:ring-[#1b4332]/20'
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
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 text-left">
              Confirm Password <span className="text-emerald-700">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                className={`w-full pl-11 pr-11 py-2.5 bg-white border rounded-full text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  errors.confirmPassword
                    ? 'border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#1b4332] focus:ring-[#1b4332]/20'
                }`}
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (val) => val === passwordVal || 'Passwords do not match',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-500 text-left flex items-center gap-1 pl-2">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-6 rounded-full font-semibold text-sm text-white bg-[#1b4332] hover:bg-[#143729] active:scale-[0.99] transition-all duration-150 shadow-md shadow-[#1b4332]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* Sign In Link */}
          <div className="pt-2 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#1b4332] underline hover:text-[#133225] ml-1"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
