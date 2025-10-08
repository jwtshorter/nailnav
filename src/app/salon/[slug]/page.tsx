'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Footer from '@/components/mobile-first/Footer'
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
  Navigation
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
  const [selectedTab, setSelectedTab] = useState<'overview' | 'services' | 'reviews' | 'contact'>('overview')
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    loadSalonDetails(params.slug)
  }, [params.slug])

  const loadSalonDetails = async (slug: string) => {
    setLoading(true)
    
    // First check localStorage for auto-created salons
    const salonListings = JSON.parse(localStorage.getItem('salonListings') || '[]')
    const autoCreatedSalon = salonListings.find((salon: any) => salon.slug === slug)
    
    if (autoCreatedSalon) {
      // Convert auto-created salon to SalonDetails format
      const convertedSalon: SalonDetails = {
        id: autoCreatedSalon.id.toString(),
        name: autoCreatedSalon.name,
        slug: autoCreatedSalon.slug,
        description: autoCreatedSalon.description,
        address: autoCreatedSalon.address.street,
        city: autoCreatedSalon.address.city,
        state: autoCreatedSalon.address.state,
        phone: '(555) 000-0000', // Default phone
        email: autoCreatedSalon.contact.email,
        website: `https://${autoCreatedSalon.slug}.com`,
        price_range: 'mid-range',
        price_from: 25,
        currency: 'USD',
        specialties: autoCreatedSalon.services || ['Manicure', 'Pedicure', 'Gel Polish'],
        languages_spoken: ['en'],
        is_verified: autoCreatedSalon.verified || true,
        is_featured: false,
        accepts_walk_ins: true,
        parking_available: true,
        operating_hours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '20:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '10:00', close: '18:00' }
        },
        cover_image_url: autoCreatedSalon.images?.[0] || '/api/placeholder/600/400',
        gallery_images: autoCreatedSalon.images || [
          '/api/placeholder/600/400',
          '/api/placeholder/600/400',
          '/api/placeholder/600/400'
        ],
        latitude: 34.0522,
        longitude: -118.2437,
        average_rating: autoCreatedSalon.rating || 4.5,
        review_count: autoCreatedSalon.reviewCount || 0,
        services: [
          {
            id: '1',
            name: 'Classic Manicure',
            description: 'Traditional nail care with cuticle treatment and polish',
            price: 35,
            duration: 45,
            category: 'Manicures',
            available: true
          },
          {
            id: '2', 
            name: 'Gel Manicure',
            description: 'Long-lasting gel polish application',
            price: 45,
            duration: 60,
            category: 'Manicures', 
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
        reviews: autoCreatedSalon.reviewCount > 0 ? [] : [ // Start with no reviews for new salons
          {
            id: '1',
            customerName: 'Welcome Customer',
            rating: 5,
            comment: `Just opened! Looking forward to trying ${autoCreatedSalon.name}. The salon looks great!`,
            serviceType: 'New Listing',
            date: autoCreatedSalon.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
            verified: false
          }
        ]
      }
      
      setSalon(convertedSalon)
      setLoading(false)
      return
    }
    
    // Fallback to mock data based on the slug
    const mockSalons: Record<string, SalonDetails> = {
      'elegant-nails-spa': {
        id: '1',
        name: 'Elegant Nails Spa',
        slug: 'elegant-nails-spa',
        description: 'Full-service nail salon offering premium manicures, pedicures, and nail art in a relaxing spa environment. We pride ourselves on cleanliness, professionalism, and using only the highest quality products.',
        address: '123 Main Street',
        city: 'Los Angeles',
        state: 'CA',
        phone: '(555) 123-4567',
        email: 'info@elegantnails.com',
        website: 'https://elegantnails.com',
        price_range: 'mid-range',
        price_from: 35,
        currency: 'USD',
        specialties: ['Gel Manicures', 'Nail Art', 'Spa Pedicures', 'French Manicures'],
        languages_spoken: ['en', 'es'],
        is_verified: true,
        is_featured: true,
        accepts_walk_ins: true,
        parking_available: true,
        operating_hours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '20:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '10:00', close: '18:00' }
        },
        cover_image_url: '/images/salon-elegant-cover.jpg',
        gallery_images: [
          '/images/salon-elegant-1.jpg',
          '/images/salon-elegant-2.jpg',
          '/images/salon-elegant-3.jpg'
        ],
        latitude: 34.0522,
        longitude: -118.2437,
        average_rating: 4.8,
        review_count: 127,
        services: [
          {
            id: '1',
            name: 'Classic Manicure',
            description: 'Traditional nail care with cuticle treatment, shaping, and polish application',
            price: 35,
            duration: 45,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'Gel Manicure',
            description: 'Long-lasting gel polish that stays chip-free for up to 3 weeks',
            price: 55,
            duration: 60,
            category: 'Manicures',
            available: true
          },
          {
            id: '3',
            name: 'Spa Pedicure',
            description: 'Relaxing foot treatment with exfoliation, massage, and polish',
            price: 65,
            duration: 75,
            category: 'Pedicures',
            available: true
          },
          {
            id: '4',
            name: 'Nail Art Design',
            description: 'Custom artistic designs and decorations for special occasions',
            price: 25,
            duration: 30,
            category: 'Nail Art',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Sarah M.',
            rating: 5,
            comment: 'Amazing service! My gel manicure lasted exactly 3 weeks as promised. The salon is so clean and relaxing.',
            serviceType: 'Gel Manicure',
            date: '2024-09-15',
            verified: true
          },
          {
            id: '2',
            customerName: 'Jessica L.',
            rating: 4,
            comment: 'Love the nail art here! Very creative and skilled technicians. Will definitely be back.',
            serviceType: 'Nail Art',
            date: '2024-09-10',
            verified: true
          },
          {
            id: '3',
            customerName: 'Maria G.',
            rating: 5,
            comment: 'Best pedicure in the city! Staff speaks Spanish which made me feel so comfortable.',
            serviceType: 'Spa Pedicure',
            date: '2024-09-05',
            verified: true
          }
        ]
      },
      'luxe-nail-lounge': {
        id: '2',
        name: 'Luxe Nail Lounge',
        slug: 'luxe-nail-lounge',
        description: 'Upscale nail salon specializing in premium gel services and luxury treatments. Experience the ultimate in nail care with our VIP service and premium product selection.',
        address: '456 Beverly Drive',
        city: 'Beverly Hills',
        state: 'CA',
        phone: '(555) 987-6543',
        email: 'contact@luxenaillounge.com',
        website: 'https://luxenaillounge.com',
        price_range: 'premium',
        price_from: 65,
        currency: 'USD',
        specialties: ['Premium Gel Services', 'Luxury Treatments', 'VIP Experience'],
        languages_spoken: ['en'],
        is_verified: true,
        is_featured: false,
        accepts_walk_ins: false,
        parking_available: true,
        operating_hours: {
          monday: { open: '10:00', close: '20:00' },
          tuesday: { open: '10:00', close: '20:00' },
          wednesday: { open: '10:00', close: '20:00' },
          thursday: { open: '10:00', close: '20:00' },
          friday: { open: '09:00', close: '21:00' },
          saturday: { open: '09:00', close: '21:00' },
          sunday: { open: '11:00', close: '19:00' }
        },
        cover_image_url: '/images/salon-luxe-cover.jpg',
        gallery_images: [
          '/images/salon-luxe-1.jpg',
          '/images/salon-luxe-2.jpg'
        ],
        latitude: 34.0736,
        longitude: -118.4004,
        average_rating: 4.9,
        review_count: 89,
        services: [
          {
            id: '1',
            name: 'Luxury Gel Manicure',
            description: 'Premium gel treatment with high-end products and extended hand massage',
            price: 85,
            duration: 90,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'VIP Pedicure Experience',
            description: 'Ultimate luxury pedicure with aromatherapy and premium foot massage',
            price: 120,
            duration: 120,
            category: 'Pedicures',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Amanda R.',
            rating: 5,
            comment: 'Worth every penny! The luxury experience and attention to detail is exceptional.',
            serviceType: 'VIP Pedicure',
            date: '2024-09-20',
            verified: true
          }
        ]
      },
      'quick-nails-express': {
        id: '3',
        name: 'Quick Nails Express',
        slug: 'quick-nails-express',
        description: 'Fast and affordable nail services for busy lifestyles. Walk-ins welcome! We specialize in quick, quality service without compromising on care.',
        address: '789 Downtown Blvd',
        city: 'Miami',
        state: 'FL',
        phone: '(555) 456-7890',
        price_range: 'budget',
        price_from: 20,
        currency: 'USD',
        specialties: ['Quick Service', 'Walk-ins Welcome', 'Affordable Prices'],
        languages_spoken: ['en', 'es'],
        is_verified: false,
        is_featured: false,
        accepts_walk_ins: true,
        parking_available: false,
        operating_hours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '21:00' },
          saturday: { open: '07:00', close: '21:00' },
          sunday: { open: '09:00', close: '19:00' }
        },
        gallery_images: [],
        latitude: 25.7617,
        longitude: -80.1918,
        average_rating: 4.2,
        review_count: 45,
        services: [
          {
            id: '1',
            name: 'Express Manicure',
            description: 'Quick 30-minute manicure perfect for busy schedules',
            price: 25,
            duration: 30,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'Basic Pedicure',
            description: 'Affordable pedicure with essential care and polish',
            price: 35,
            duration: 45,
            category: 'Pedicures',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Lisa K.',
            rating: 4,
            comment: 'Perfect for a quick touch-up. In and out in 30 minutes with a great manicure!',
            serviceType: 'Express Manicure',
            date: '2024-09-18',
            verified: true
          }
        ]
      }
    }

    // Simulate API delay
    setTimeout(() => {
      const salonData = mockSalons[slug]
      setSalon(salonData || null)
      setLoading(false)
    }, 800)
  }

  const formatPrice = (price: number, currency = 'USD'): string => {
    const symbol = currency === 'USD' ? '$' : currency
    return `${symbol}${price}`
  }

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

  const status = getCurrentStatus(salon.operating_hours)

  return (
    <div className="min-h-screen bg-gray-50">
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
                <span>{salon.address}, {salon.city}, {salon.state}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <Clock className="w-4 h-4 mr-2" />
                <span className={status.isOpen ? 'text-green-600' : 'text-red-600'}>
                  {status.message}
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>{formatPrice(salon.price_from || 0)} and up - {salon.price_range.replace('-', ' ')}</span>
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

            {/* Enhanced filters/features */}
            {autoCreatedSalon?.filters && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(autoCreatedSalon.filters)
                  .filter(([key, value]) => value === true)
                  .map(([key, value]) => {
                    // Map filter keys to display labels and icons
                    const filterLabels = {
                      masterNailArtist: { label: 'Master Nail Artist', icon: '🎨' },
                      bridalNails: { label: 'Bridal Nails', icon: '💒' },
                      kidFriendly: { label: 'Kid Friendly', icon: '👶' },
                      childPlayArea: { label: 'Play Area', icon: '🎮' },
                      adultOnly: { label: 'Adult Only', icon: '🔞' },
                      petFriendly: { label: 'Pet Friendly', icon: '🐕' },
                      lgbtqiFriendly: { label: 'LGBTQI+ Friendly', icon: '🏳️‍🌈' },
                      freeWifi: { label: 'Free Wi-Fi', icon: '📶' },
                      parkingAvailable: { label: 'Parking Available', icon: '🚗' },
                      wheelchairAccessible: { label: 'Wheelchair Accessible', icon: '♿' },
                      complimentaryBeverage: { label: 'Complimentary Drinks', icon: '☕' },
                      heatedMassageChairs: { label: 'Heated Massage Chairs', icon: '🛋️' },
                      footSpas: { label: 'Foot Spas', icon: '🦶' },
                      womanOwned: { label: 'Woman-Owned', icon: '👩' },
                      minorityOwned: { label: 'Minority-Owned', icon: '🤝' },
                      nonToxicTreatments: { label: 'Non-toxic Treatments', icon: '🌿' },
                      veganPolish: { label: 'Vegan Polish', icon: '🌱' },
                      equipmentSterilisation: { label: 'Equipment Sterilisation', icon: '🧼' },
                      organicProducts: { label: 'Organic Products', icon: '🌿' },
                      ledCuring: { label: 'LED Curing', icon: '💡' },
                      openLate: { label: 'Open Late', icon: '🌙' },
                      openSunday: { label: 'Open Sunday', icon: '📅' },
                      openSaturday: { label: 'Open Saturday', icon: '📅' },
                      mobileNails: { label: 'Mobile Service', icon: '🚗' },
                      walkInsWelcome: { label: 'Walk-Ins Welcome', icon: '🚶' },
                      appointmentOnly: { label: 'Appointment Only', icon: '📅' },
                      groupBookings: { label: 'Group Bookings', icon: '👥' },
                      flexibleCancellation: { label: 'Flexible Cancellation', icon: '↩️' },
                      fixedPricing: { label: 'Fixed Pricing', icon: '💰' },
                      depositRequired: { label: 'Deposit Required', icon: '💳' },
                      loyaltyDiscounts: { label: 'Loyalty Discounts', icon: '⭐' }
                    }

                    const filter = filterLabels[key]
                    if (!filter) return null

                    return (
                      <span
                        key={key}
                        className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                      >
                        <span className="mr-1">{filter.icon}</span>
                        {filter.label}
                      </span>
                    )
                  })}
              </div>
            )}
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
              className="flex items-center justify-center bg-primary-500 text-white px-4 py-3 rounded-lg font-medium"
              style={{ minHeight: '44px' }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-card mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'overview', label: 'Overview', icon: null },
              { key: 'services', label: 'Services', icon: null },
              { key: 'reviews', label: 'Reviews', icon: MessageSquare },
              { key: 'contact', label: 'Contact', icon: Mail }
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">{salon.accepts_walk_ins ? 'Walk-ins Welcome' : 'By Appointment'}</span>
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
                {autoCreatedSalon?.menuItems && autoCreatedSalon.menuItems.length > 0 ? (
                  <div className="space-y-6">
                    {/* Group services by category */}
                    {Object.entries(
                      autoCreatedSalon.menuItems
                        .filter(item => item.isActive && item.price > 0)
                        .reduce((acc, item) => {
                          if (!acc[item.category]) acc[item.category] = []
                          acc[item.category].push(item)
                          return acc
                        }, {})
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
                                  <h5 className="font-medium text-gray-900">{service.service}</h5>
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
                  /* Default services if no custom menu */
                  salon.services.map((service) => (
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

                <div className="space-y-4">
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

            {selectedTab === 'contact' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium">{salon.address}</div>
                      <div className="text-gray-600">{salon.city}, {salon.state}</div>
                    </div>
                  </div>



                  {salon.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <a href={`mailto:${salon.email}`} className="text-primary-600 font-medium">
                        {salon.email}
                      </a>
                    </div>
                  )}

                  {salon.website && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-gray-400 mr-3" />
                      <a href={salon.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-medium">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Hours of Operation</h4>
                  <div className="space-y-2">
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

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Getting Here</h4>
                  <p className="text-blue-800 text-sm mb-3">
                    {salon.parking_available 
                      ? 'Parking is available for customers.' 
                      : 'Street parking may be limited. Consider public transportation.'}
                  </p>
                  <button 
                    onClick={() => handleContact('directions')}
                    className="text-blue-600 font-medium text-sm"
                  >
                    Get Directions
                  </button>
                </div>
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