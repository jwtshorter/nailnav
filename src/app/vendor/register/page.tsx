'use client'

import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { motion } from 'framer-motion'
import { Store, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function VendorRegisterPage() {
  const [formData, setFormData] = useState({
    salonName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    termsAccepted: false
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
    
    if (!formData.salonName.trim()) newErrors.salonName = 'Salon name is required'
    if (!formData.address.trim()) newErrors.address = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required'
    if (!formData.country) newErrors.country = 'Country is required'
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner/Manager name is required'
    if (!formData.email.trim()) newErrors.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character'
    }
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const normalizeWebsiteUrl = (url: string) => {
    if (!url || !url.trim()) return ''
    
    const cleanUrl = url.trim()
    
    // If URL already has protocol, return as-is
    if (cleanUrl.match(/^https?:\/\//)) {
      return cleanUrl
    }
    
    // Just add https:// to whatever the user entered
    // No assumptions about www or domain format
    return `https://${cleanUrl}`
  }

  const createVendorAccount = async (formData: any) => {
    try {
      console.log('Starting vendor registration process...')
      
      // 1. Create Supabase auth user with email/password
      console.log('Creating auth user for:', formData.email)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.ownerName.split(' ')[0],
            last_name: formData.ownerName.split(' ').slice(1).join(' '),
            role: 'vendor'
          }
        }
      })

      if (signUpError) {
        console.error('Auth signup error:', signUpError)
        throw signUpError
      }
      if (!authData.user) {
        console.error('No user returned from signup')
        throw new Error('Failed to create user account')
      }
      
      console.log('Auth user created successfully:', authData.user.id)

      // 2. Try to create vendor application (check if tables exist)
      try {
        const vendorApplication = {
          user_id: authData.user.id,
          salon_name: formData.salonName,
          business_address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postal_code: formData.zip,
          owner_name: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          website: normalizeWebsiteUrl(formData.website),
          status: 'draft',
          draft_data: {
            description: `Welcome to ${formData.salonName}! We provide professional nail services in ${formData.city}, ${formData.state}.`,
            services_offered: ['manicures', 'pedicures', 'gel-polish', 'nail-art'],
            specialties: ['nail-care', 'gel-polish'],
            price_range: 'mid-range',
            price_from: 35.00,
            accepts_walk_ins: true,
            parking_available: false,
            operating_hours: {
              monday: { open: '09:00', close: '19:00' },
              tuesday: { open: '09:00', close: '19:00' },
              wednesday: { open: '09:00', close: '19:00' },
              thursday: { open: '09:00', close: '19:00' },
              friday: { open: '09:00', close: '20:00' },
              saturday: { open: '09:00', close: '18:00' },
              sunday: { open: '10:00', close: '17:00' }
            }
          }
        }

        console.log('Inserting vendor application:', vendorApplication)
        const { data: applicationData, error: applicationError } = await supabase
          .from('vendor_applications')
          .insert(vendorApplication)
          .select()
          .single()

        if (applicationError) {
          console.error('Database insertion error:', applicationError)
          throw applicationError
        }
        
        console.log('Vendor application created successfully:', applicationData)

        return {
          user: authData.user,
          application: applicationData
        }
        
      } catch (dbError: any) {
        console.warn('Database tables not set up yet:', dbError.message)
        
        // If database tables don't exist, still create the auth account
        // and store application data in localStorage as fallback
        const applicationData = {
          id: `temp-${Date.now()}`,
          user_id: authData.user.id,
          salon_name: formData.salonName,
          business_address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postal_code: formData.zip,
          owner_name: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          website: normalizeWebsiteUrl(formData.website),
          status: 'draft',
          created_at: new Date().toISOString()
        }
        
        // Store in localStorage as temporary fallback
        const existingApplications = JSON.parse(localStorage.getItem('vendorApplications') || '[]')
        existingApplications.push(applicationData)
        localStorage.setItem('vendorApplications', JSON.stringify(existingApplications))
        
        return {
          user: authData.user,
          application: applicationData,
          fallbackMode: true
        }
      }
      
    } catch (error) {
      console.error('Error creating vendor account:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Create vendor account and application
      const result = await createVendorAccount(formData)
      
      setSuccessMessage(`🎉 Welcome to NailNav! Your account for "${formData.salonName}" has been created successfully. 

Next steps:
1. Login to your vendor dashboard to complete your salon profile
2. Add photos, services, and business details  
3. Submit for admin review when ready
4. Go live once approved!`)
      
      // Clear form
      setFormData({
        salonName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        ownerName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        website: '',
        termsAccepted: false
      })

      // Auto-redirect to dashboard after 3 seconds to skip login step
      setTimeout(() => {
        window.location.href = '/vendor/dashboard'
      }, 3000)
      
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // More detailed error handling
      if (error?.message?.includes('User already registered') || error?.message?.includes('already exists')) {
        setErrors({ submit: 'An account with this email already exists. Please try logging in instead.' })
      } else if (error?.message?.includes('Password')) {
        setErrors({ password: error.message })
      } else if (error?.message?.includes('Email')) {
        setErrors({ email: error.message })
      } else if (error?.message?.includes('weak password') || error?.message?.includes('Password should contain')) {
        setErrors({ password: 'Password must contain uppercase, lowercase, number, and special character (!@#$%^&*etc.)' })
      } else if (error?.message?.includes('Database error saving new user')) {
        setErrors({ submit: 'Database configuration issue. Please contact support or check that database migrations have been run.' })
      } else if (error?.message?.includes('rate limit')) {
        setErrors({ submit: 'Too many attempts. Please wait a moment and try again.' })
      } else {
        // Show the actual error message for debugging
        const errorMsg = error?.message || 'An unknown error occurred'
        setErrors({ submit: `Registration failed: ${errorMsg}. Please try again or contact support if the issue persists.` })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <motion.a
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </motion.a>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">List Your Nail Salon</h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
              Create your vendor account and submit your salon for listing. Update details and photos before going live!
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Join Nail Nav?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Create secure vendor account with dashboard access',
                'Update salon details, photos, and hours before going live',
                'Professional listing reviewed by our team',  
                'Get discovered by local customers when approved',
                'Mobile-optimized business profile included',
                'Full control over your salon information'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Get Started Today</h2>
            
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 mb-2">Account Created Successfully! 🎉</p>
                    <div className="text-green-700 leading-relaxed whitespace-pre-line mb-4">{successMessage}</div>
                    <div className="mt-4 space-y-3">
                      <a
                        href="/vendor/dashboard"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Access Dashboard Now →
                      </a>
                      <p className="text-green-600 text-xs">
                        Redirecting automatically in 3 seconds... Or click above to go now.
                      </p>
                    </div>
                  </div>
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
              {/* Business Information */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Business Information</h3>
                <div>
                  <label htmlFor="salonName" className="block text-sm font-medium text-gray-700 mb-2">
                    Salon Name *
                  </label>
                  <input
                    type="text"
                    id="salonName"
                    value={formData.salonName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.salonName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Beautiful Nails Spa"
                  />
                  {errors.salonName && (
                    <p className="mt-1 text-sm text-red-600">{errors.salonName}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Location</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Los Angeles"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="CA"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.zip ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="90210"
                      />
                      {errors.zip && (
                        <p className="mt-1 text-sm text-red-600">{errors.zip}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.country ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                      <option value="NL">Netherlands</option>
                      <option value="BE">Belgium</option>
                      <option value="CH">Switzerland</option>
                      <option value="AT">Austria</option>
                      <option value="SE">Sweden</option>
                      <option value="NO">Norway</option>
                      <option value="DK">Denmark</option>
                      <option value="FI">Finland</option>
                      <option value="JP">Japan</option>
                      <option value="KR">South Korea</option>
                      <option value="SG">Singapore</option>
                      <option value="HK">Hong Kong</option>
                      <option value="NZ">New Zealand</option>
                      <option value="IE">Ireland</option>
                      <option value="PT">Portugal</option>
                      <option value="GR">Greece</option>
                      <option value="PL">Poland</option>
                      <option value="CZ">Czech Republic</option>
                      <option value="HU">Hungary</option>
                      <option value="RO">Romania</option>
                      <option value="BG">Bulgaria</option>
                      <option value="HR">Croatia</option>
                      <option value="SI">Slovenia</option>
                      <option value="SK">Slovakia</option>
                      <option value="LT">Lithuania</option>
                      <option value="LV">Latvia</option>
                      <option value="EE">Estonia</option>
                      <option value="MT">Malta</option>
                      <option value="CY">Cyprus</option>
                      <option value="LU">Luxembourg</option>
                      <option value="IS">Iceland</option>
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                        Owner/Manager Name *
                      </label>
                      <input
                        type="text"
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.ownerName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Your Full Name"
                      />
                      {errors.ownerName && (
                        <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="owner@beautifulnails.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                        Website (Optional)
                      </label>
                      <input
                        type="text"
                        id="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="yoursalon.com"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter your domain name (we'll add https:// automatically)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Account Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Choose a secure password"
                    />
                    {!errors.password && (
                      <p className="mt-1 text-xs text-gray-500">Must include: uppercase, lowercase, number, and special character</p>
                    )}
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Your password must be at least 6 characters long.
                </p>
              </div>

              {/* Terms */}
              <div className={`bg-gray-50 p-4 rounded-lg ${errors.termsAccepted ? 'border border-red-300' : ''}`}>
                <label className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>.
                    I confirm that I have the authority to list this business on Nail Nav.
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="mt-2 text-sm text-red-600">{errors.termsAccepted}</p>
                )}
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
                <Store className="w-5 h-5" />
                <span>{isSubmitting ? 'Creating Account...' : 'Submit Application'}</span>
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                Already have an account?{' '}
                <a href="/vendor/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Login here
                </a>
              </p>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Need help?{' '}
              <a href="/contact" className="text-primary-600 hover:text-primary-700">
                Contact our support team
              </a>
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}