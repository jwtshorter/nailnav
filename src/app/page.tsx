'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Star, TrendingUp, Shield, Clock } from 'lucide-react'
import SearchFilter from '@/components/mobile-first/SearchFilter'
import SalonCard from '@/components/mobile-first/SalonCard'
// import { SalonService } from '@/lib/api/salons'
// import { Salon, SalonSearchFilters } from '@/lib/supabase'

interface SalonSearchFilters {
  city?: string
  services?: string[]
  priceRange?: string[]
  specialties?: string[]
  languages?: string[]
  isVerified?: boolean
  acceptsWalkIns?: boolean
  hasParking?: boolean
  location?: {
    lat: number
    lng: number
    radius: number
  }
}

interface SalonWithDetails {
  id: string
  name: string
  slug: string
  address: string
  city: string
  state: string
  phone?: string
  price_from?: number
  currency?: string
  specialties?: string[]
  is_verified?: boolean
  average_rating?: number
  review_count?: number
  distance_meters?: number
}

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<SalonWithDetails[]>([])
  const [featuredSalons, setFeaturedSalons] = useState<SalonWithDetails[]>([])
  const [popularSalons, setPopularSalons] = useState<SalonWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)

  // Load initial data
  useEffect(() => {
    loadFeaturedSalons()
    loadPopularSalons()
  }, [])

  const loadFeaturedSalons = async () => {
    // Mock data for demo
    const mockSalons: SalonWithDetails[] = [
      {
        id: '1',
        name: 'Elegant Nails Spa',
        slug: 'elegant-nails-spa',
        address: '123 Main Street',
        city: 'Los Angeles',
        state: 'CA',
        phone: '(555) 123-4567',
        price_from: 35,
        currency: 'USD',
        specialties: ['Gel Manicures', 'Nail Art', 'Spa Pedicures'],
        is_verified: true,
        average_rating: 4.8,
        review_count: 127
      }
    ]
    setFeaturedSalons(mockSalons)
  }

  const loadPopularSalons = async () => {
    // Mock data for demo
    const mockSalons: SalonWithDetails[] = [
      {
        id: '2',
        name: 'Luxe Nail Lounge',
        slug: 'luxe-nail-lounge',
        address: '456 Beverly Drive',
        city: 'Beverly Hills',
        state: 'CA',
        phone: '(555) 987-6543',
        price_from: 65,
        currency: 'USD',
        specialties: ['Premium Gel Services', 'Luxury Treatments'],
        is_verified: true,
        average_rating: 4.9,
        review_count: 89
      }
    ]
    setPopularSalons(mockSalons)
  }

  const handleSearch = async (filters: SalonSearchFilters) => {
    setLoading(true)
    setSearchPerformed(true)
    
    // Mock search results
    setTimeout(() => {
      const mockResults: SalonWithDetails[] = [
        {
          id: '3',
          name: 'Quick Nails Express',
          slug: 'quick-nails-express',
          address: '789 Downtown Blvd',
          city: 'Miami',
          state: 'FL',
          phone: '(555) 456-7890',
          price_from: 20,
          currency: 'USD',
          specialties: ['Quick Service', 'Walk-ins Welcome'],
          is_verified: false,
          average_rating: 4.2,
          review_count: 45,
          distance_meters: 1200
        }
      ]
      setSearchResults(mockResults)
      setLoading(false)
    }, 1000)
  }

  const handleSalonClick = (salon: SalonWithDetails) => {
    // Mock tracking
    console.log('Salon clicked:', salon.name)
    
    // Navigate to salon detail page
    window.location.href = `/salon/${salon.slug}`
  }

  const handleDirections = (salon: SalonWithDetails) => {
    // Mock tracking
    console.log('Directions requested for:', salon.name)
    
    // Open directions in Google Maps
    const address = encodeURIComponent(`${salon.address}, ${salon.city}, ${salon.state}`)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
  }

  const handleContact = (salon: SalonWithDetails) => {
    // Mock tracking
    console.log('Contact requested for:', salon.name)
    
    if (salon.phone) {
      window.location.href = `tel:${salon.phone}`
    } else {
      alert(`Contact ${salon.name} - This would show contact options`)
    }
  }

  const features = [
    {
      icon: MapPin,
      title: 'Find Nearby',
      description: 'Discover nail salons in your area with GPS-powered search'
    },
    {
      icon: Star,
      title: 'Read Reviews',
      description: 'See what others say about their nail salon experiences'
    },
    {
      icon: Shield,
      title: 'Verified Salons',
      description: 'Browse trusted, verified nail salon businesses'
    },
    {
      icon: Clock,
      title: 'Real-time Info',
      description: 'Get up-to-date hours, availability, and pricing'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Find the Perfect
              <br />
              <span className="text-accent-200">Nail Salon</span> Near You
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Discover top-rated nail salons, compare prices, read reviews, and book appointments
              all in one mobile-first platform.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-4 md:gap-8 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <div className="text-2xl md:text-3xl font-bold">1,000+</div>
              <div className="text-sm md:text-base opacity-80">Nail Salons</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">50K+</div>
              <div className="text-sm md:text-base opacity-80">Happy Customers</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">4.8★</div>
              <div className="text-sm md:text-base opacity-80">Average Rating</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search Filter */}
      <SearchFilter 
        onSearch={handleSearch}
        loading={loading}
        resultsCount={searchResults.length}
      />

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-6">
        {/* Search Results */}
        {searchPerformed && (
          <motion.section 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((salon) => (
                  <SalonCard
                    key={salon.id}
                    salon={salon}
                    onClick={() => handleSalonClick(salon)}
                    onDirections={() => handleDirections(salon)}
                    onContact={() => handleContact(salon)}
                    showDistance={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No salons found matching your criteria.</p>
                <p className="text-sm">Try adjusting your filters or search area.</p>
              </div>
            )}
          </motion.section>
        )}

        {/* Features Section */}
        {!searchPerformed && (
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Why Choose NailNav?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white p-6 rounded-lg shadow-card text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <feature.icon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Featured Salons */}
        {!searchPerformed && featuredSalons.length > 0 && (
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Salons</h2>
              <TrendingUp className="w-6 h-6 text-primary-500" />
            </div>
            <div className="space-y-4">
              {featuredSalons.map((salon) => (
                <SalonCard
                  key={salon.id}
                  salon={salon}
                  onClick={() => handleSalonClick(salon)}
                  onDirections={() => handleDirections(salon)}
                  onContact={() => handleContact(salon)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Popular Salons */}
        {!searchPerformed && popularSalons.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular This Week</h2>
            <div className="space-y-4">
              {popularSalons.map((salon) => (
                <SalonCard
                  key={salon.id}
                  salon={salon}
                  onClick={() => handleSalonClick(salon)}
                  onDirections={() => handleDirections(salon)}
                  onContact={() => handleContact(salon)}
                />
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">NailNav</h3>
            <p className="text-gray-400 mb-4">Find the perfect nail salon near you</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="/about" className="hover:text-white">About</a>
              <a href="/privacy" className="hover:text-white">Privacy</a>
              <a href="/terms" className="hover:text-white">Terms</a>
              <a href="/contact" className="hover:text-white">Contact</a>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              © 2024 NailNav. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}