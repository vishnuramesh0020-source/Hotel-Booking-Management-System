import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { findUserByEmail } from '../../services/authStorage'
import AuthLayout from '../../components/layout/AuthLayout'

export default function ForgotPassword() {
  const { resetUserPassword } = useAuth()

  const [step, setStep] = useState(1)
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1 Form
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  })

  // Step 2 Form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch: watchReset,
    formState: { errors: resetErrors },
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const newPasswordVal = watchReset('newPassword')

  // Handler for Step 1: Verify Email
  const onCheckEmail = async (data) => {
    setIsSubmitting(true)
    try {
      const user = findUserByEmail(data.email)
      if (!user) {
        throw new Error('No registered account found with this email address.')
      }
      setVerifiedEmail(data.email)
      toast.success('Account verified! Please set your new password.')
      setStep(2)
    } catch (err) {
      toast.error(err.message || 'Verification failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler for Step 2: Reset Password
  const onResetPassword = async (data) => {
    setIsSubmitting(true)
    try {
      await resetUserPassword(verifiedEmail, data.newPassword)
      toast.success('Password updated successfully! You can now sign in.')
      setStep(3)
    } catch (err) {
      toast.error(err.message || 'Failed to update password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {step === 1
              ? 'Reset Password'
              : step === 2
              ? 'Create New Password'
              : 'Password Updated'}
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-normal">
            {step === 1
              ? 'Enter your registered email to receive recovery instructions'
              : step === 2
              ? `Enter a new secure password for ${verifiedEmail}`
              : 'Your password has been changed successfully!'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-[#1b4332] text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            1
          </span>
          <div className="w-8 h-0.5 bg-slate-200" />
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-[#1b4332] text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            2
          </span>
          <div className="w-8 h-0.5 bg-slate-200" />
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            3
          </span>
        </div>

        {/* STEP 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSubmitEmail(onCheckEmail)} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1 text-left">
                Account Email <span className="text-emerald-700">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="hello@delisas.com"
                  className={`w-full pl-11 pr-4 py-2.5 bg-white border rounded-full text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${
                    emailErrors.email
                      ? 'border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#1b4332] focus:ring-[#1b4332]/20'
                  }`}
                  {...registerEmail('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                />
              </div>
              {emailErrors.email && (
                <p className="mt-1 text-xs text-rose-500 text-left flex items-center gap-1 pl-2">
                  <AlertCircle className="w-3 h-3" />
                  {emailErrors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-6 rounded-full font-semibold text-sm text-white bg-[#1b4332] hover:bg-[#143729] active:scale-[0.99] transition-all duration-150 shadow-md shadow-[#1b4332]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Email...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Password Reset Form */}
        {step === 2 && (
          <form onSubmit={handleSubmitReset(onResetPassword)} className="space-y-3.5" noValidate>
            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1 text-left">
                New Password <span className="text-emerald-700">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  className={`w-full pl-11 pr-11 py-2.5 bg-white border rounded-full text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${
                    resetErrors.newPassword
                      ? 'border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#1b4332] focus:ring-[#1b4332]/20'
                  }`}
                  {...registerReset('newPassword', {
                    required: 'New password is required',
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
              {resetErrors.newPassword && (
                <p className="mt-1 text-xs text-rose-500 text-left flex items-center gap-1 pl-2">
                  <AlertCircle className="w-3 h-3" />
                  {resetErrors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1 text-left">
                Confirm New Password <span className="text-emerald-700">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  className={`w-full pl-11 pr-11 py-2.5 bg-white border rounded-full text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${
                    resetErrors.confirmPassword
                      ? 'border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#1b4332] focus:ring-[#1b4332]/20'
                  }`}
                  {...registerReset('confirmPassword', {
                    required: 'Please confirm new password',
                    validate: (val) => val === newPasswordVal || 'Passwords do not match',
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
              {resetErrors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-500 text-left flex items-center gap-1 pl-2">
                  <AlertCircle className="w-3 h-3" />
                  {resetErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-6 rounded-full font-semibold text-sm text-white bg-[#1b4332] hover:bg-[#143729] active:scale-[0.99] transition-all duration-150 shadow-md shadow-[#1b4332]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save New Password</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Done */}
        {step === 3 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-xs text-slate-600">
              Your password has been securely updated. You can now sign in to your account.
            </p>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center py-3 px-6 rounded-full font-semibold text-sm text-white bg-[#1b4332] hover:bg-[#143729] transition-colors shadow-md shadow-[#1b4332]/20"
            >
              Back to Sign In
            </Link>
          </div>
        )}

        {/* Back Link */}
        <div className="pt-4 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1b4332] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
