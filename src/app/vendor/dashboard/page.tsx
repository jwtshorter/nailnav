'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Store, 
  LogOut, 
  Edit, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle,
  Camera,
  Save,
  MapPin,
  Mail,
  Phone,
  Globe,
  DollarSign
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  phone: string
  website: string
  status: string
  admin_notes: string
  draft_data: any
  created_at: string
}

interface SalonData {
  description: string
  services: string[]
  specialties: string[]
  priceRange: string
  priceFrom: number
  acceptsWalkIns: boolean
  parkingAvailable: boolean
  hours: Record<string, { open: string; close: string }>
}

export default function VendorDashboard() {
  const [application, setApplication] = useState<VendorApplication | null>(null)
  const [salonData, setSalonData] = useState<SalonData>({
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'photos'>('overview')

  useEffect(() => {
    checkVendorAccess()
  }, [])

  const checkVendorAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      window.location.href = '/vendor/login'
      return
    }

    // Check if user is vendor and load their application
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'vendor') {
      await supabase.auth.signOut()
      window.location.href = '/vendor/login'
      return
    }

    await loadVendorApplication(session.user.id)
  }

  const loadVendorApplication = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error

      setApplication(data)
      
      // Load draft data if exists
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
    } catch (error) {
      console.error('Error loading vendor application:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDetails = async () => {
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
        operating_hours: salonData.hours
      }

      const { error } = await supabase
        .from('vendor_applications')
        .update({ 
          draft_data: updatedDraftData,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id)

      if (error) throw error

      // Update local state
      setApplication(prev => prev ? { ...prev, draft_data: updatedDraftData } : null)
      
      alert('Details saved successfully!')
    } catch (error) {
      console.error('Error saving details:', error)
      alert('Failed to save details. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/vendor/login'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending Review
        </span>
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved & Live
        </span>
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
    }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Application Found</h2>
          <p className="text-gray-600 mb-4">You don't have a vendor application yet.</p>
          <a
            href="/vendor/register"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Submit Application
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              {getStatusBadge(application.status)}
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
        {/* Status Alert */}
        {application.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <Clock className="w-5 h-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Application Under Review
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Your salon application is being reviewed by our team. You can continue updating your details and photos while you wait.
                </p>
              </div>
            </div>
          </div>
        )}

        {application.status === 'rejected' && application.admin_notes && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <XCircle className="w-5 h-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Application Rejected
                </h3>
                <p className="mt-1 text-sm text-red-700">{application.admin_notes}</p>
                <p className="mt-2 text-sm text-red-600">
                  Please update your information and resubmit your application.
                </p>
              </div>
            </div>
          </div>
        )}

        {application.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Congratulations! Your salon is live
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Your salon listing has been approved and is now visible to customers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: Store },
              { id: 'details', name: 'Salon Details', icon: Edit },
              { id: 'photos', name: 'Photos', icon: Camera }
            ].map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Store className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{application.salon_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{application.email}</span>
                </div>
                {application.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{application.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{application.business_address}, {application.city}, {application.state}</span>
                </div>
                {application.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={application.website} target="_blank" className="text-primary-600 hover:underline">
                      {application.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  {getStatusBadge(application.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Applied</span>
                  <span className="text-sm font-medium">{new Date(application.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">{new Date(application.updated_at || application.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Salon Details</h3>
              <button
                onClick={handleSaveDetails}
                disabled={saving}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salon Description
                </label>
                <textarea
                  value={salonData.description}
                  onChange={(e) => setSalonData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your salon, services, and what makes you special..."
                />
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Offered
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['manicures', 'pedicures', 'gel-polish', 'nail-art', 'extensions', 'treatments'].map(service => (
                    <label key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={salonData.services.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSalonData(prev => ({ ...prev, services: [...prev.services, service] }))
                          } else {
                            setSalonData(prev => ({ ...prev, services: prev.services.filter(s => s !== service) }))
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm capitalize">{service.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={salonData.priceRange}
                    onChange={(e) => setSalonData(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="budget">Budget ($)</option>
                    <option value="mid-range">Mid-range ($$)</option>
                    <option value="premium">Premium ($$$)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Starting Price ($)
                  </label>
                  <input
                    type="number"
                    value={salonData.priceFrom}
                    onChange={(e) => setSalonData(prev => ({ ...prev, priceFrom: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="35"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={salonData.acceptsWalkIns}
                    onChange={(e) => setSalonData(prev => ({ ...prev, acceptsWalkIns: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">Accepts walk-in customers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={salonData.parkingAvailable}
                    onChange={(e) => setSalonData(prev => ({ ...prev, parkingAvailable: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">Parking available</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Salon Photos</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
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
        )}
      </div>
    </div>
  )
}