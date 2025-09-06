'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft, User, Shield, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formMessage, setFormMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const { login } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
    
    // Clear field error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    setFormMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setFormMessage(null)

    try {
      const result = await login(email, password)

      if (result.success) {
        toast.success('Welcome back!')
        setFormMessage({ type: 'success', text: 'Login successful! Redirecting...' })
        setTimeout(() => router.push('/'), 1000)
      } else {
        // Handle specific error cases
        let errorMessage = 'Login failed'
        
        if (result.error) {
          const error = result.error.toLowerCase()
          
          if (error.includes('password') || error.includes('invalid credentials')) {
            errorMessage = 'Invalid password. Please try again.'
          } else if (error.includes('email') || error.includes('user not found')) {
            errorMessage = 'Email address not found. Please check your email or sign up.'
          } else if (error.includes('account') || error.includes('disabled')) {
            errorMessage = 'Account is disabled. Please contact support.'
          } else if (error.includes('too many attempts')) {
            errorMessage = 'Too many login attempts. Please try again later.'
          } else if (error.includes('network') || error.includes('connection')) {
            errorMessage = 'Network error. Please check your connection and try again.'
          } else {
            errorMessage = result.error
          }
        }
        
        toast.error(errorMessage)
        setFormMessage({ type: 'error', text: errorMessage })
      }
    } catch (error: unknown) {
      console.error('Login error:', error)
      
      // Handle specific error types
      let errorMessage = 'Something went wrong'
      
      if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          const message = error.message.toLowerCase()
          
          if (message.includes('network') || message.includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.'
          } else if (message.includes('timeout')) {
            errorMessage = 'Request timeout. Please try again.'
          } else if (message.includes('unauthorized') || message.includes('401')) {
            errorMessage = 'Invalid email or password. Please try again.'
          } else if (message.includes('not found') || message.includes('404')) {
            errorMessage = 'Email address not found. Please check your email or sign up.'
          } else if (message.includes('server') || message.includes('500')) {
            errorMessage = 'Server error. Please try again later.'
          } else {
            errorMessage = error.message
          }
        } else if ('status' in error && typeof error.status === 'number') {
          if (error.status === 401) {
            errorMessage = 'Invalid email or password. Please try again.'
          } else if (error.status === 404) {
            errorMessage = 'Email address not found. Please check your email or sign up.'
          } else if (error.status >= 500) {
            errorMessage = 'Server error. Please try again later.'
          }
        }
      }
      
      toast.error(errorMessage)
      setFormMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-all duration-300 hover:scale-105 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Home</span>
          </Link>
          
          {/* Enhanced Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-all duration-300">
              <User size={40} className="text-white" />
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles size={14} className="text-yellow-800" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles size={10} className="text-pink-800" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 leading-tight">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Sign in to your Rushk account
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
          {/* Form Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-100 to-blue-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
          
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Global Success / Error Message */}
              {formMessage && (
                <div
                  className={`flex items-center p-5 rounded-2xl text-sm font-semibold shadow-lg border-2 ${
                    formMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-green-50 text-green-700 border-green-200'
                  }`}
                >
                  {formMessage.type === 'error' ? (
                    <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 mr-3 flex-shrink-0" />
                  )}
                  <span className="leading-relaxed">{formMessage.text}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-blue-500 transition-all duration-300" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full p-4 pl-14 border-2 rounded-2xl bg-white/80 backdrop-blur-sm text-gray-900 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg ${
                      errors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center text-sm text-red-600 animate-fadeIn">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-blue-500 transition-all duration-300" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full p-4 pl-14 pr-14 border-2 rounded-2xl bg-white/80 backdrop-blur-sm text-gray-900 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg ${
                      errors.password ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-300 p-1 rounded-lg hover:bg-gray-100"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center text-sm text-red-600 animate-fadeIn">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {isLoading ? (
                  <div className="flex items-center justify-center relative z-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span className="font-semibold">Signing In...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Sign In</span>
                )}
              </button>
            </form>

            {/* Enhanced Links */}
            <div className="mt-10 space-y-6">
              <div className="text-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 hover:scale-105 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              
              {/* Enhanced Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white/90 backdrop-blur-sm text-gray-500 font-bold uppercase tracking-wide">
                    New to Rushk?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-700 font-bold text-lg transition-all duration-300 hover:scale-105 group"
                >
                  <Shield size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  Create your account
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-105 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Rushk
          </Link>
        </div>
      </div>
    </div>
  )
}
