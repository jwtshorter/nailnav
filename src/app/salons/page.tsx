'use client'

import Navigation from '@/components/mobile-first/Navigation'
import SearchFilter from '@/components/mobile-first/SearchFilter'
import SalonCard from '@/components/mobile-first/SalonCard'
import Footer from '@/components/mobile-first/Footer'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MapPin, Filter, Grid, List } from 'lucide-react'

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

export default function SalonsPage() {
  const [searchResults, setSearchResults] = useState<SalonWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState('distance')

  // Load initial salons
  useEffect(() => {
    loadAllSalons()
  }, [])

  const loadAllSalons = async () => {
    setLoading(true)
    // Mock data for demo
    setTimeout(() => {
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
          review_count: 127,
          distance_meters: 500
        },
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
          review_count: 89,
          distance_meters: 1200
        },
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
          distance_meters: 2500
        }
      ]
      setSearchResults(mockSalons)
      setLoading(false)
    }, 800)
  }

  const handleSearch = async (filters: SalonSearchFilters) => {
    setLoading(true)
    console.log('Searching with filters:', filters)
    
    // Simulate search delay
    setTimeout(() => {
      loadAllSalons()
    }, 1000)
  }

  const handleSalonClick = (salon: SalonWithDetails) => {
    window.location.href = `/salon/${salon.slug}`
  }

  const handleDirections = (salon: SalonWithDetails) => {
    const address = encodeURIComponent(`${salon.address}, ${salon.city}, ${salon.state}`)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
  }

  const handleContact = (salon: SalonWithDetails) => {
    if (salon.phone) {
      window.location.href = `tel:${salon.phone}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Nail Salons
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the best nail salons in your area. Compare services, prices, and reviews to find your perfect match.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <SearchFilter 
            onSearch={handleSearch}
            loading={loading}
            resultsCount={searchResults.length}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-6">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchResults.length} salons found
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
              <option value="reviews">Most Reviewed</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:text-primary-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:text-primary-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
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
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
            {searchResults.map((salon) => (
              <SalonCard
                key={salon.id}
                salon={salon}
                onClick={() => handleSalonClick(salon)}
                onDirections={() => handleDirections(salon)}
                onContact={() => handleContact(salon)}
                showDistance={true}
                showActionButtons={false}
                isCompact={viewMode === 'grid'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No salons found</h3>
            <p className="text-gray-500">Try adjusting your search filters or expanding your search area.</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}