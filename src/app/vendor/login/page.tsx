'use client'

import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { motion } from 'framer-motion'
import { LogIn, Store, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function VendorLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email.trim()) newErrors.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      console.log('Attempting login for:', formData.email)
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        console.error('Supabase auth error:', error)
        throw error
      }
      
      console.log('Login successful, user:', data.user?.id)

      // Check if user is vendor (gracefully handle missing tables and RLS issues)
      try {
        // First, try to check if user has a vendor application
        console.log('Checking vendor application for user:', data.user.id)
        const { data: vendorApp, error: vendorAppError } = await supabase
          .from('vendor_applications')
          .select('id, status, salon_name')
          .eq('user_id', data.user.id)
          .single()

        if (vendorApp) {
          // User has a vendor application, allow login
          console.log('✅ Vendor application found:', vendorApp.salon_name, 'Status:', vendorApp.status)
        } else if (vendorAppError && vendorAppError.code === '42P01') {
          // vendor_applications table doesn't exist - check localStorage fallback
          const localApplications = JSON.parse(localStorage.getItem('vendorApplications') || '[]')
          const userApp = localApplications.find((app: any) => app.user_id === data.user.id)
          
          if (userApp) {
            console.log('Found vendor application in localStorage fallback, allowing login')
          } else {
            console.warn('No vendor application found, but allowing login in fallback mode')
          }
        } else if (vendorAppError) {
          // Table exists but no vendor application found - check by email as fallback
          console.log('No vendor app by user_id, checking by email:', data.user.email)
          const { data: vendorAppByEmail, error: emailError } = await supabase
            .from('vendor_applications')
            .select('id, status, salon_name, user_id')
            .eq('email', data.user.email)
            .single()
          
          if (vendorAppByEmail) {
            console.log('✅ Found vendor application by email:', vendorAppByEmail.salon_name)
            // Update the application with the correct user_id if it's missing
            if (!vendorAppByEmail.user_id) {
              await supabase
                .from('vendor_applications')
                .update({ user_id: data.user.id })
                .eq('id', vendorAppByEmail.id)
              console.log('Updated vendor application with user_id')
            }
          } else {
            // No vendor application found at all
            console.warn('No vendor application found, but allowing login in development mode')
          }
        }
      } catch (error) {
        // If database check fails completely, allow login anyway (fallback mode)
        console.warn('Could not verify vendor role, proceeding with login in fallback mode:', error)
      }

      // Check if user is admin by looking at their vendor application
      let isAdmin = false
      try {
        const { data: userApp } = await supabase
          .from('vendor_applications')
          .select('salon_name, status')
          .or(`user_id.eq.${data.user.id},email.eq.${data.user.email}`)
          .single()
        
        if (userApp && userApp.salon_name?.toLowerCase().includes('admin') && userApp.status === 'approved') {
          isAdmin = true
        }
      } catch (error) {
        console.log('Could not check admin status, proceeding as regular user')
      }
      
      if (isAdmin) {
        setSuccessMessage('Admin login successful! Redirecting...')
        window.location.href = '/admin/dashboard'
      } else {
        setSuccessMessage('Login successful! Redirecting...')
        window.location.href = '/vendor/dashboard'
      }
    } catch (error: any) {
      console.error('Login error:', error)
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      })
      
      if (error?.message?.includes('Invalid login credentials')) {
        setErrors({ submit: 'Invalid email or password. If you just registered, please check your email to confirm your account first.' })
      } else if (error?.message?.includes('Email not confirmed')) {
        setErrors({ submit: 'Please check your email and confirm your account before logging in.' })
      } else if (error?.message?.includes('Too many requests')) {
        setErrors({ submit: 'Too many login attempts. Please wait a moment and try again.' })
      } else if (error?.code === 'invalid_credentials') {
        setErrors({ submit: 'Invalid email or password. If you just created an account, please check your email for a confirmation link first.' })
      } else {
        // Show the actual error message for debugging in development
        const errorMessage = error?.message || 'Unknown error'
        setErrors({ submit: `Login failed: ${errorMessage}. Please try again or contact support.` })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <motion.a
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </motion.a>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Login</h1>
              <p className="text-gray-600">Access your salon dashboard</p>
            </div>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6"
              >
                <p className="mb-3">{successMessage}</p>
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-3 text-sm text-green-700">Redirecting to dashboard...</span>
                </div>
              </motion.div>
            )}

            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6"
              >
                {errors.submit}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="your@salon.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>



              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="/vendor/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                <LogIn className="w-5 h-5" />
                <span>{isSubmitting ? 'Signing In...' : 'Login to Dashboard'}</span>
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/vendor/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  List your salon
                </a>
              </p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white rounded-lg p-6 shadow-md"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Vendor Dashboard Features</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>Manage your salon profile and services</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>View and respond to customer reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>Track bookings and analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>Update hours and availability</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}