'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Edit, 
  Save, 
  Camera, 
  Upload, 
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Heart,
  Wifi,
  Car,

  Coffee,
  Scissors,
  Baby,
  Users,
  Shield,
  Leaf,
  Sparkles,
  Calendar,
  DollarSign,
  CreditCard,
  Crown,
  Palette,
  Eye,
  Plus,
  Trash2
} from 'lucide-react'

interface VendorApplication {
  id: string
  salon_name: string
  business_address: string
  city: string
  state: string
  country: string
  postal_code: string
  owner_name: string
  email: string
  phone?: string
  website?: string
  status: string
  created_at: string
  admin_notes?: string
  draft_data?: any
}

interface SalonFilters {
  masterNailArtist: boolean
  bridalNails: boolean
  kidFriendly: boolean
  childPlayArea: boolean
  adultOnly: boolean
  petFriendly: boolean
  lgbtqiFriendly: boolean
  freeWifi: boolean
  parkingAvailable: boolean
  wheelchairAccessible: boolean
  complimentaryBeverage: boolean
  heatedMassageChairs: boolean
  footSpas: boolean
  womanOwned: boolean
  minorityOwned: boolean
  nonToxicTreatments: boolean
  veganPolish: boolean
  equipmentSterilisation: boolean
  organicProducts: boolean
  ledCuring: boolean
  openLate: boolean
  openSunday: boolean
  openSaturday: boolean
  mobileNails: boolean
  walkInsWelcome: boolean
  appointmentOnly: boolean
  groupBookings: boolean
  flexibleCancellation: boolean
  fixedPricing: boolean
  depositRequired: boolean
  loyaltyDiscounts: boolean
}

interface MenuItem {
  id: string
  category: string
  service: string
  duration: number
  price: number
  description?: string
  isActive: boolean
}

export default function NewVendorDashboard() {
  const [application, setApplication] = useState<VendorApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [salonData, setSalonData] = useState({
    description: '',
    services: ['manicures', 'pedicures'],
    specialties: ['nail-care'],
    priceRange: 'mid-range',
    priceFrom: 35,
    acceptsWalkIns: true,
    parkingAvailable: false,
    hours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '17:00' }
    }
  })

  const [filters, setFilters] = useState<SalonFilters>({
    masterNailArtist: false,
    bridalNails: false,
    kidFriendly: false,
    childPlayArea: false,
    adultOnly: false,
    petFriendly: false,
    lgbtqiFriendly: false,
    freeWifi: false,
    parkingAvailable: false,
    wheelchairAccessible: false,
    complimentaryBeverage: false,
    heatedMassageChairs: false,
    footSpas: false,
    womanOwned: false,
    minorityOwned: false,
    nonToxicTreatments: false,
    veganPolish: false,
    equipmentSterilisation: false,
    organicProducts: false,
    ledCuring: false,
    openLate: false,
    openSunday: false,
    openSaturday: false,
    mobileNails: false,
    walkInsWelcome: false,
    appointmentOnly: false,
    groupBookings: false,
    flexibleCancellation: false,
    fixedPricing: false,
    depositRequired: false,
    loyaltyDiscounts: false
  })

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    checkVendorAccess()
  }, [])

  const checkVendorAccess = async (retryCount = 0) => {
    // Check for demo mode first
    const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || 
                       !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'
    
    if (isDemoMode) {
      // Demo mode - check localStorage for demo session
      const demoSession = localStorage.getItem('demo_user_session')
      if (!demoSession) {
        console.log('No demo session found, redirecting to login')
        window.location.href = '/vendor/login'
        return
      }
      
      try {
        const session = JSON.parse(demoSession)
        if (session.expires_at < Date.now()) {
          console.log('Demo session expired, redirecting to login')
          localStorage.removeItem('demo_user_session')
          window.location.href = '/vendor/login'
          return
        }
        
        // Check if user claimed a specific salon
        const claimedSalonInfo = localStorage.getItem('claimingSpecificSalon')
        let demoApplication
        
        if (claimedSalonInfo) {
          try {
            const salonInfo = JSON.parse(claimedSalonInfo)
            // Create demo application based on claimed salon
            demoApplication = {
              id: 'claimed-' + salonInfo.id,
              salon_name: salonInfo.name,
              business_address: salonInfo.address,
              city: salonInfo.city,
              state: salonInfo.state,
              country: 'USA',
              postal_code: '12345',
              owner_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              phone: '(555) 123-4567',
              email: session.user.email,
              website: `https://${salonInfo.slug}.com`,
              status: 'approved',
              admin_notes: 'Claimed business application',
              created_at: new Date().toISOString().split('T')[0]
            }
            console.log('Demo mode: Using claimed salon application for', salonInfo.name)
          } catch (error) {
            console.error('Error parsing claimed salon info:', error)
          }
        }
        
        // Fallback to generic demo if no claimed salon
        if (!demoApplication) {
          demoApplication = {
            id: 'demo-app-1',
            salon_name: 'Demo Nail Salon',
            business_address: '123 Demo Street',
            city: 'Demo City',
            state: 'Demo State',
            country: 'Demo Country',
            postal_code: '12345',
            owner_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            phone: '(555) 123-4567',
            email: session.user.email,
            website: 'https://demo-nail-salon.com',
            status: 'approved',
            admin_notes: 'Demo application',
            created_at: new Date().toISOString().split('T')[0]
          }
        }
        
        console.log('Demo mode: Using demo vendor application')
        setApplication(demoApplication)
        setLoading(false)
        return
      } catch (error) {
        console.error('Error parsing demo session:', error)
        window.location.href = '/vendor/login'
        return
      }
    }
    
    // Real Supabase mode
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      window.location.href = '/vendor/login'
      return
    }

    console.log('Checking vendor access for user:', session.user.id, 'retry:', retryCount)
    const userApplication = await loadVendorApplication(session.user.id, session.user.email)
    
    if (userApplication && userApplication.salon_name?.toLowerCase().includes('admin') && userApplication.status === 'approved') {
      console.log('Admin user detected, redirecting to admin dashboard')
      window.location.href = '/admin/dashboard'
      return
    }
    
    if (!userApplication) {
      console.log('No vendor application found, checking if user is admin by email and user_id')
      try {
        const { data: adminCheckEmail } = await supabase
          .from('vendor_applications')
          .select('salon_name, status, user_id')
          .eq('email', session.user.email)
          .single()
        
        if (adminCheckEmail && adminCheckEmail.salon_name?.toLowerCase().includes('admin') && adminCheckEmail.status === 'approved') {
          console.log('Admin user detected by email, redirecting to admin dashboard')
          
          if (!adminCheckEmail.user_id) {
            console.log('Updating admin application with user_id')
            await supabase
              .from('vendor_applications')
              .update({ user_id: session.user.id })
              .eq('email', session.user.email)
          }
          
          window.location.href = '/admin/dashboard'
          return
        }
        
        const { data: adminCheckUserId } = await supabase
          .from('vendor_applications')
          .select('salon_name, status')
          .eq('user_id', session.user.id)
          .single()
        
        if (adminCheckUserId && adminCheckUserId.salon_name?.toLowerCase().includes('admin') && adminCheckUserId.status === 'approved') {
          console.log('Admin user detected by user_id, redirecting to admin dashboard')
          window.location.href = '/admin/dashboard'
          return
        }
      } catch (error) {
        console.log('Not an admin user')
      }
    }
    
    setLoading(false)
  }

  const loadVendorApplication = async (userId: string, userEmail?: string) => {
    try {
      let { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && userEmail) {
        console.log('No application found by user_id, trying by email:', userEmail)
        const { data: dataByEmail, error: emailError } = await supabase
          .from('vendor_applications')
          .select('*')
          .eq('email', userEmail)
          .single()

        if (!emailError && dataByEmail) {
          await supabase
            .from('vendor_applications')
            .update({ user_id: userId })
            .eq('id', dataByEmail.id)
          
          data = { ...dataByEmail, user_id: userId }
          console.log('Found application by email and updated user_id')
        } else {
          throw emailError || error
        }
      } else if (error) {
        throw error
      }

      setApplication(data)
      
      if (data.draft_data) {
        setSalonData({
          description: data.draft_data.description || '',
          services: data.draft_data.services_offered || ['manicures', 'pedicures'],
          specialties: data.draft_data.specialties || ['nail-care'],
          priceRange: data.draft_data.price_range || 'mid-range',
          priceFrom: data.draft_data.price_from || 35,
          acceptsWalkIns: data.draft_data.accepts_walk_ins ?? true,
          parkingAvailable: data.draft_data.parking_available ?? false,
          hours: data.draft_data.operating_hours || salonData.hours
        })
      }

      // Load filters and menu items
      if (data.draft_data?.filters) {
        setFilters(prev => ({ ...prev, ...data.draft_data.filters }))
      }
      
      if (data.draft_data?.menu_items) {
        setMenuItems(data.draft_data.menu_items)
      }
      
      return data
    } catch (error) {
      console.error('Error loading vendor application:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!application) return

    setSaving(true)
    try {
      const updatedDraftData = {
        ...application.draft_data,
        description: salonData.description,
        services_offered: salonData.services,
        specialties: salonData.specialties,
        price_range: salonData.priceRange,
        price_from: salonData.priceFrom,
        accepts_walk_ins: salonData.acceptsWalkIns,
        parking_available: salonData.parkingAvailable,
        operating_hours: salonData.hours,
        filters: filters,
        menu_items: menuItems
      }

      const { error } = await supabase
        .from('vendor_applications')
        .update({ 
          draft_data: updatedDraftData,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id)

      if (error) throw error

      setApplication(prev => prev ? { ...prev, draft_data: updatedDraftData } : null)
      
      alert('Profile saved successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/vendor/login'
  }

  const filterOptions = [
    { key: 'masterNailArtist', label: 'Master Nail Artist', icon: Palette, category: 'Expertise' },
    { key: 'bridalNails', label: 'Bridal Nails', icon: Heart, category: 'Expertise' },
    { key: 'kidFriendly', label: 'Kid Friendly', icon: Baby, category: 'Atmosphere' },
    { key: 'childPlayArea', label: 'Child Play Area', icon: Users, category: 'Atmosphere' },
    { key: 'adultOnly', label: 'Adult Only', icon: Crown, category: 'Atmosphere' },
    { key: 'petFriendly', label: 'Pet Friendly', icon: Heart, category: 'Atmosphere' },
    { key: 'lgbtqiFriendly', label: 'LGBTQI+ Friendly', icon: Heart, category: 'Atmosphere' },
    { key: 'freeWifi', label: 'Free Wi-Fi', icon: Wifi, category: 'Amenities' },
    { key: 'parkingAvailable', label: 'Parking Available', icon: Car, category: 'Amenities' },
    { key: 'wheelchairAccessible', label: 'Wheelchair Accessible', icon: Users, category: 'Amenities' },
    { key: 'complimentaryBeverage', label: 'Complimentary Beverage', icon: Coffee, category: 'Amenities' },
    { key: 'heatedMassageChairs', label: 'Heated Massage Chairs', icon: Sparkles, category: 'Equipment' },
    { key: 'footSpas', label: 'Foot Spas', icon: Sparkles, category: 'Equipment' },
    { key: 'womanOwned', label: 'Woman-Owned', icon: Crown, category: 'Business Type' },
    { key: 'minorityOwned', label: 'Minority-Owned', icon: Crown, category: 'Business Type' },
    { key: 'nonToxicTreatments', label: 'Non-toxic Nail Treatments', icon: Shield, category: 'Health & Safety' },
    { key: 'veganPolish', label: 'Vegan Polish', icon: Leaf, category: 'Health & Safety' },
    { key: 'equipmentSterilisation', label: 'Equipment Sterilisation', icon: Shield, category: 'Health & Safety' },
    { key: 'organicProducts', label: 'Organic Products', icon: Leaf, category: 'Health & Safety' },
    { key: 'ledCuring', label: 'LED Curing', icon: Sparkles, category: 'Equipment' },
    { key: 'openLate', label: 'Open Late', icon: Clock, category: 'Hours' },
    { key: 'openSunday', label: 'Open Sunday', icon: Calendar, category: 'Hours' },
    { key: 'openSaturday', label: 'Open Saturday', icon: Calendar, category: 'Hours' },
    { key: 'walkInsWelcome', label: 'Walk-Ins Welcome', icon: Users, category: 'Booking' },
    { key: 'appointmentOnly', label: 'Appointment Only', icon: Calendar, category: 'Booking' },
    { key: 'groupBookings', label: 'Group Bookings', icon: Users, category: 'Booking' },
    { key: 'mobileNails', label: 'Mobile Nails', icon: Car, category: 'Booking' },
    { key: 'flexibleCancellation', label: 'Flexible Cancellation', icon: CheckCircle, category: 'Policies' },
    { key: 'fixedPricing', label: 'Fixed Pricing', icon: DollarSign, category: 'Policies' },
    { key: 'depositRequired', label: 'Deposit Required', icon: CreditCard, category: 'Policies' },
    { key: 'loyaltyDiscounts', label: 'Loyalty Discounts', icon: Star, category: 'Policies' }
  ]

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      category: '',
      service: '',
      duration: 30,
      price: 0,
      description: '',
      isActive: true
    }
    setMenuItems([...menuItems, newItem])
  }

  const updateMenuItem = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const removeMenuItem = (id: string) => {
    setMenuItems(items => items.filter(item => item.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor dashboard...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <a href="/" className="flex items-center space-x-2">
                    <Store className="w-8 h-8 text-primary-600" />
                    <span className="text-xl font-bold text-gray-900">NailNav</span>
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/vendor/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </a>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
          <div className="text-center max-w-md mx-auto px-4">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Application Found</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You don't have a vendor application yet. Create one to get started with listing your salon on NailNav.
            </p>
            <div className="space-y-3">
              <a
                href="/vendor/register"
                className="block w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
              >
                Submit New Application
              </a>
              <a
                href="/"
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Back to Home
              </a>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Need help?</strong> If you recently created an account and are seeing this message, there may be a temporary sync issue. Try refreshing the page or contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const groupedFilters = filterOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = []
    }
    acc[option.category].push(option)
    return acc
  }, {} as Record<string, typeof filterOptions>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Site Navigation Header */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a 
                href="/"
                className="flex items-center space-x-3"
              >
                <img 
                  src="https://page.gensparksite.com/v1/base64_upload/1f1454bd566330cbbeffb5137b348d57"
                  alt="NailNav Logo"
                  className="h-8 w-auto"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling!.textContent = 'Nail Nav'
                  }}
                />
                <span className="text-xl font-bold text-gray-900 hidden">Nail Nav</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/search" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Search
              </a>
              <a href="/blog" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Blog
              </a>
              <a href="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                About
              </a>
              <a href="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Contact
              </a>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Vendor Portal</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Vendor Dashboard Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Store className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{application.salon_name}</h1>
                <p className="text-sm text-gray-600">Vendor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/vendor/billing"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </a>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Message */}
        {application.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  🎉 Your salon is live!
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Your salon listing is now visible to customers. Keep your profile updated to attract more bookings.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Basic Info and Filters */}
          <div className="xl:col-span-1 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                {(application as any).is_claimed && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Claimed Business</p>
                        <p className="text-xs text-green-600">You are managing an existing listing. Changes you make here will update the live page.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Store className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{application.salon_name}</p>
                    <p className="text-sm text-gray-500">Salon Name</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{application.email}</p>
                    <p className="text-sm text-gray-500">Contact Email</p>
                  </div>
                </div>

                {application.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{application.phone}</p>
                      <p className="text-sm text-gray-500">Phone Number</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{application.business_address}</p>
                    <p className="text-sm text-gray-500">{application.city}, {application.state}</p>
                  </div>
                </div>

                {application.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <a href={application.website} target="_blank" className="font-medium text-primary-600 hover:underline">
                        {application.website}
                      </a>
                      <p className="text-sm text-gray-500">Website</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={`/salon/${(application as any).claimed_salon_slug || application.salon_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {(application as any).is_claimed ? 'View Live Page' : 'View Public Page'}
                </a>
                <a
                  href="/vendor/billing"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Featured
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Salon Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salon Description</h3>
              <textarea
                value={salonData.description}
                onChange={(e) => setSalonData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your salon, services, and what makes you special..."
              />
            </div>

            {/* Salon Features & Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salon Features</h3>
              <p className="text-sm text-gray-600 mb-6">Select all features that apply to your salon. These will be displayed on your public listing to help customers find you.</p>
              
              {Object.entries(groupedFilters).map(([category, options]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-md font-medium text-gray-800 mb-3">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {options.map(option => (
                      <label key={option.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters[option.key as keyof SalonFilters]}
                          onChange={(e) => setFilters(prev => ({ ...prev, [option.key]: e.target.checked }))}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <option.icon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(salonData.hours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-3">
                    <label className="w-20 text-sm font-medium capitalize">{day}</label>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => setSalonData(prev => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: { ...prev.hours[day as keyof typeof prev.hours], open: e.target.value }
                        }
                      }))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => setSalonData(prev => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: { ...prev.hours[day as keyof typeof prev.hours], close: e.target.value }
                        }
                      }))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Menu & Services */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Menu & Services</h3>
                <button
                  onClick={addMenuItem}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Add your services and pricing. Only services with prices above $0 will be shown on your public page.
              </p>

              <div className="space-y-4">
                {menuItems.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateMenuItem(item.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          placeholder="e.g., Manicures"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                        <input
                          type="text"
                          value={item.service}
                          onChange={(e) => updateMenuItem(item.id, 'service', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          placeholder="e.g., Gel Manicure"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                        <input
                          type="number"
                          value={item.duration}
                          onChange={(e) => updateMenuItem(item.id, 'duration', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          min="0"
                          step="15"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateMenuItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                          />
                          <button
                            onClick={() => removeMenuItem(item.id)}
                            className="px-2 py-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => updateMenuItem(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="Brief description of the service..."
                      />
                    </div>
                  </div>
                ))}

                {menuItems.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No services added yet</p>
                    <button
                      onClick={addMenuItem}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Your First Service</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Photo Upload */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salon Photos</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Photos</h4>
                <p className="text-gray-600 mb-4">
                  Add photos of your salon, services, and work to attract customers
                </p>
                <button className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Upload className="w-4 h-4" />
                  <span>Choose Photos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}