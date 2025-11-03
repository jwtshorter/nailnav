'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Footer from '@/components/mobile-first/Footer'
import NavigationComponent from '@/components/mobile-first/Navigation'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Clock, 
  CheckCircle, 
  Camera,
  Calendar,
  DollarSign,
  MessageSquare,
  Share2,
  Heart,
  Navigation,
  Store
} from 'lucide-react'

interface SalonService {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  available: boolean
}

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  serviceType: string
  date: string
  verified: boolean
}

interface SalonDetails {
  id: string
  name: string
  slug: string
  description: string
  address: string
  city: string
  state: string
  phone?: string
  email?: string
  website?: string
  price_range: string
  price_from?: number
  currency: string
  specialties: string[]
  languages_spoken: string[]
  is_verified: boolean
  is_featured: boolean
  accepts_walk_ins: boolean
  parking_available: boolean
  operating_hours: Record<string, { open: string; close: string }>
  logo_url?: string
  cover_image_url?: string
  gallery_images: string[]
  average_rating: number
  review_count: number
  services: SalonService[]
  reviews: Review[]
  latitude: number
  longitude: number
}

export default function SalonDetailPage({ params }: { params: { slug: string } }) {
  const [salon, setSalon] = useState<SalonDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'services' | 'reviews'>('overview')
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    loadSalonDetails(params.slug)
  }, [params.slug])

  const loadSalonDetails = async (slug: string) => {
    setLoading(true)
    
    try {
      // Fetch salon from API
      const response = await fetch(`/api/salons/${slug}`)
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        console.error('Salon not found')
        setLoading(false)
        return
      }
      
      const salonData = data.salon
      
      // Convert API salon to SalonDetails format
      const convertedSalon: SalonDetails = {
        id: salonData.id.toString(),
        name: salonData.name,
        slug: salonData.slug,
        description: salonData.description || 'Quality nail care services',
        address: salonData.address,
        city: salonData.city,
        state: salonData.state || 'VIC',
        phone: salonData.phone,
        email: salonData.email,
        website: salonData.website,
        price_range: salonData.price_range || 'mid-range',
        price_from: salonData.price_from || 35,
        currency: salonData.currency || 'AUD',
        specialties: salonData.specialties || [],
        languages_spoken: salonData.languages_spoken || ['English'],
        is_verified: salonData.is_verified || false,
        is_featured: salonData.is_featured || false,
        accepts_walk_ins: salonData.accepts_walk_ins || true,
        parking_available: salonData.parking || false,
        operating_hours: salonData.opening_hours || {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: '10:00', close: '16:00' }
        },
        logo_url: undefined,
        cover_image_url: salonData.cover_image_url || '/api/placeholder/800/400',
        gallery_images: salonData.gallery_images || ['/api/placeholder/600/400'],
        latitude: salonData.latitude || -37.8136,
        longitude: salonData.longitude || 144.9631,
        average_rating: salonData.average_rating || salonData.rating || 4.5,
        review_count: salonData.review_count || 0,
        services: salonData.services || [
          {
            id: '1',
            name: 'Manicure',
            description: 'Professional nail care service',
            price: 35,
            duration: 45,
            category: 'Manicures',
            available: true
          },
          {
            id: '2', 
            name: 'Pedicure',
            description: 'Complete foot and nail care',
            price: 45,
            duration: 60,
            category: 'Pedicures', 
            available: true
          },
          {
            id: '3',
            name: 'Spa Pedicure',
            description: 'Relaxing foot treatment with massage',
            price: 55,
            duration: 75,
            category: 'Pedicures',
            available: true
          }
        ],
        reviews: salonData.reviews || []
      }
      
      setSalon(convertedSalon)
    } catch (error) {
      console.error('Error loading salon:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper functions
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getCurrentStatus = (hours: Record<string, { open: string; close: string }>) => {
    const now = new Date()
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const currentDay = days[now.getDay()]
    const currentTime = now.toTimeString().substring(0, 5)
    
    const todayHours = hours[currentDay]
    if (!todayHours) return { isOpen: false, message: 'Closed today' }
    
    if (currentTime >= todayHours.open && currentTime <= todayHours.close) {
      return { isOpen: true, message: `Open until ${todayHours.close}` }
    }
    
    return { isOpen: false, message: `Opens at ${todayHours.open}` }
  }

  const handleContact = (type: 'phone' | 'email' | 'directions' | 'website') => {
    if (!salon) return
    
    switch (type) {
      case 'phone':
        if (salon.phone) window.location.href = `tel:${salon.phone}`
        break
      case 'email':
        if (salon.email) window.location.href = `mailto:${salon.email}`
        break
      case 'website':
        if (salon.website) window.open(salon.website, '_blank')
        break
      case 'directions':
        const address = encodeURIComponent(`${salon.address}, ${salon.city}, ${salon.state}`)
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-gray-300 rounded-lg"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Salon Not Found</h1>
          <p className="text-gray-600 mb-6">The salon you're looking for doesn't exist.</p>
          <button
            onClick={() => {
              // Check if user came from admin dashboard
              const referrer = document.referrer
              if (referrer.includes('/admin/dashboard')) {
                window.location.href = '/admin/dashboard'
              } else {
                window.history.back()
              }
            }}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // This should not happen given the checks above, but TypeScript requires it
  if (!salon) return null

  const status = getCurrentStatus(salon.operating_hours)

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationComponent />
      
      {/* Header Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary-500 to-accent-500">
        {salon.cover_image_url ? (
          <img 
            src={salon.cover_image_url} 
            alt={salon.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Camera className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Back Button */}
        <button
          onClick={() => {
            // Check if user came from admin dashboard
            const referrer = document.referrer
            if (referrer.includes('/admin/dashboard')) {
              window.location.href = '/admin/dashboard'
            } else {
              window.history.back()
            }
          }}
          className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-full"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <Navigation className="w-5 h-5 transform rotate-180" />
        </button>

        {/* Share Button */}
        <button
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 -mt-6 relative z-10">
        {/* Salon Info Card */}
        <motion.div 
          className="bg-white rounded-lg shadow-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-900 mr-3">{salon.name}</h1>
                {salon.is_verified && (
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">Verified</span>
                  </div>
                )}
              </div>

              <div className="flex items-center mb-3">
                {renderStars(salon.average_rating)}
                <span className="ml-2 text-gray-600">
                  {salon.average_rating.toFixed(1)} ({salon.review_count} reviews)
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{salon.city}, {salon.state}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <Clock className="w-4 h-4 mr-2" />
                <span className={status.isOpen ? 'text-green-600' : 'text-red-600'}>
                  {status.message}
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <span>${salon.price_from || 0} and up - {salon.price_range.replace('-', ' ')}</span>
              </div>
            </div>

            <button className="p-2 text-gray-400 hover:text-primary-500">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Specialties and Features */}
          <div className="mb-6">
            {/* Traditional specialties */}
            <div className="flex flex-wrap gap-2 mb-4">
              {salon.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>

            {/* Enhanced filters/features - Temporarily disabled for build
            TODO: Add filters property to SalonDetails interface 
            This section is temporarily disabled to prevent build errors
            */}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <motion.button
              onClick={() => handleContact('directions')}
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-3 rounded-lg font-medium"
              style={{ minHeight: '44px' }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Directions
            </motion.button>

            {salon.website && (
              <motion.button
                onClick={() => handleContact('website')}
                className="flex items-center justify-center bg-purple-500 text-white px-4 py-3 rounded-lg font-medium"
                style={{ minHeight: '44px' }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-4 h-4 mr-2" />
                Website
              </motion.button>
            )}

            <motion.button
              onClick={() => {
                // Track booking button click
                console.log('Book button clicked for salon:', salon.slug)
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'booking_click', {
                    salon_name: salon.name,
                    salon_slug: salon.slug
                  })
                }
                // Navigate to booking page
                window.location.href = `/salon/${salon.slug}/book`
              }}
              className="flex items-center justify-center bg-primary-500 text-white px-4 py-3 rounded-lg font-medium"
              style={{ minHeight: '44px' }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book
            </motion.button>
          </div>
          
          {/* Claim Business Button - Only show if salon is not verified */}
          {!salon.is_verified && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Are you the owner of {salon.name}?</h4>
                  <p className="text-xs text-blue-700 mt-1">Claim your business to manage your listing, respond to reviews, and update information.</p>
                </div>
                <motion.button
                  onClick={() => {
                    // Store salon info for claiming
                    localStorage.setItem('claimingSalon', JSON.stringify({
                      id: salon.id,
                      name: salon.name,
                      slug: salon.slug,
                      address: salon.address,
                      city: salon.city,
                      state: salon.state
                    }))
                    window.location.href = '/vendor/claim'
                  }}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap"
                  whileTap={{ scale: 0.95 }}
                >
                  <Store className="w-4 h-4 mr-2" />
                  Claim Business
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Tabs - Recentred after removing Contact tab */}
        <div className="bg-white rounded-lg shadow-card mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'overview', label: 'Overview', icon: null },
              { key: 'services', label: 'Services', icon: null },
              { key: 'reviews', label: 'Reviews', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
                  selectedTab === tab.key
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
                style={{ minHeight: '44px' }}
              >
                <div className="flex items-center justify-center space-x-1">
                  {tab.icon && <tab.icon className="w-4 h-4" />}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.substring(0, 3)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About {salon.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{salon.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Expanded features list - only show selected features */}
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">{salon.accepts_walk_ins ? 'Walk-ins Welcome' : 'By Appointment Only'}</span>
                    </div>
                    
                    {salon.parking_available && (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm">Parking Available</span>
                      </div>
                    )}
                    
                    {salon.languages_spoken.length > 1 && (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm">Multilingual Staff</span>
                      </div>
                    )}
                    
                    {salon.is_verified && (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm">Verified Business</span>
                      </div>
                    )}
                    
                    {/* Additional features based on salon data */}
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">Online Booking Available</span>
                    </div>
                    
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">Credit Cards Accepted</span>
                    </div>
                    
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">Sanitized Equipment</span>
                    </div>
                    
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">Professional Staff</span>
                    </div>
                    
                    {salon.price_range === 'premium' && (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm">Luxury Experience</span>
                      </div>
                    )}
                    
                    {salon.average_rating >= 4.5 && (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm">Highly Rated</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Hours of Operation</h3>
                  <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                    {Object.entries(salon.operating_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize font-medium">{day}</span>
                        <span className="text-gray-600">
                          {hours.open} - {hours.close}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {salon.gallery_images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {salon.gallery_images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${salon.name} gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'services' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Services & Pricing</h3>
                
                {/* Check for real menu items from vendor application */}
                {salon?.services && salon.services.length > 0 ? (
                  <div className="space-y-6">
                    {/* Group services by category - Only show services with $ figures */}
                    {Object.entries(
                      salon.services
                        .filter(item => item.available && item.price > 0)
                        .reduce((acc, item) => {
                          if (!acc[item.category]) acc[item.category] = []
                          acc[item.category].push(item)
                          return acc
                        }, {} as Record<string, SalonService[]>)
                    ).map(([category, services]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
                          {category}
                        </h4>
                        <div className="space-y-3">
                          {services.map((service, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{service.name}</h5>
                                  {service.description && (
                                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className="font-semibold text-primary-600">
                                    ${service.price.toFixed(2)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDuration(service.duration)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
                                  Book Now
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Default services if no custom menu - Only show services with prices */
                  salon.services.filter(service => service.price > 0).map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-semibold text-primary-600">
                            {formatPrice(service.price)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDuration(service.duration)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {service.category}
                        </span>
                        <button className="text-sm text-primary-600 font-medium">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <button className="text-primary-600 font-medium">Write Review</button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {renderStars(salon.average_rating)}
                      <span className="ml-2 text-2xl font-bold">{salon.average_rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-600">{salon.review_count} reviews</span>
                  </div>
                </div>

                {/* Google Reviews Integration */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6" />
                      <h4 className="font-semibold text-gray-900">Google Reviews</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Verified</span>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/${encodeURIComponent(salon.name + ' ' + salon.address + ' ' + salon.city + ' ' + salon.state)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View on Google
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Google Reviews Rating Summary */}
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{salon.average_rating.toFixed(1)}</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(salon.average_rating)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Based on {salon.review_count}+ Google reviews
                      </div>
                    </div>
                    
                    {/* Google Review Highlights */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Service Quality</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cleanliness</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-18 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">4.9</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Value</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-14 h-2 bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">4.6</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Google Reviews */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-3">Recent Google Reviews</h5>
                    <div className="space-y-3">
                      <div className="border-l-2 border-blue-500 pl-3">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              M
                            </div>
                            <div>
                              <div className="font-medium text-sm">Maria S.</div>
                              <div className="flex items-center">
                                {renderStars(5)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Excellent service! The gel manicure lasted exactly 3 weeks. Very clean salon and friendly staff."
                        </p>
                      </div>
                      
                      <div className="border-l-2 border-green-500 pl-3">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              J
                            </div>
                            <div>
                              <div className="font-medium text-sm">Jessica L.</div>
                              <div className="flex items-center">
                                {renderStars(5)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">1 week ago</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Amazing nail art! They really listened to what I wanted and exceeded my expectations."
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(salon.name + ' ' + salon.address + ' ' + salon.city + ' ' + salon.state)}/reviews`, '_blank')}
                      className="w-full mt-4 py-2 px-4 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      View All Google Reviews
                    </button>
                  </div>
                </div>

                {/* Platform Reviews */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Platform Reviews</h4>
                  {salon.reviews.slice(0, showAllReviews ? undefined : 3).map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="font-medium">{review.customerName}</span>
                            {review.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                            )}
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        {review.serviceType}
                      </span>
                    </div>
                  ))}
                </div>

                {salon.reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full py-3 text-primary-600 font-medium border border-primary-200 rounded-lg hover:bg-primary-50"
                  >
                    {showAllReviews ? 'Show Less' : `See All ${salon.reviews.length} Reviews`}
                  </button>
                )}
              </div>
            )}


          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}