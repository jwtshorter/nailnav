'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, MapPin, Check } from 'lucide-react'
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

interface SearchFilterProps {
  onSearch: (filters: SalonSearchFilters) => void
  loading?: boolean
  resultsCount?: number
}

const priceRanges = [
  { value: 'budget', label: 'Budget ($)', color: 'green' },
  { value: 'mid-range', label: 'Mid-range ($$)', color: 'yellow' },
  { value: 'premium', label: 'Premium ($$$)', color: 'purple' }
]

const popularServices = [
  'Gel Manicure',
  'Classic Manicure', 
  'Gel Pedicure',
  'Acrylic Nails',
  'Dip Powder',
  'Nail Art',
  'Classic Pedicure',
  'Gel Extensions'
]

const popularSpecialties = [
  'Gel Services',
  'Nail Art',
  'Acrylic Extensions',
  'Quick Service',
  'Luxury Treatments',
  'Spa Pedicures',
  'Walk-ins Welcome',
  'Premium Brands'
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' }
]

export const SearchFilter = ({ onSearch, loading, resultsCount }: SearchFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SalonSearchFilters>({})
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending')

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setLocationPermission('granted')
        },
        () => {
          setLocationPermission('denied')
        }
      )
    }
  }, [])

  const handleSearch = () => {
    const searchFilters: SalonSearchFilters = {
      ...filters,
      city: searchQuery.trim() || undefined,
      location: userLocation ? {
        ...userLocation,
        radius: 25000 // 25km default radius
      } : undefined
    }
    
    onSearch(searchFilters)
  }

  const toggleFilter = (type: keyof SalonSearchFilters, value: string) => {
    setFilters(prev => {
      const currentArray = (prev[type] as string[]) || []
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      
      return {
        ...prev,
        [type]: newArray.length > 0 ? newArray : undefined
      }
    })
  }

  const toggleBooleanFilter = (type: keyof SalonSearchFilters) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] ? undefined : true
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search city or salon name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                style={{ minHeight: '44px' }}
              />
            </div>
            
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-3 rounded-lg border flex items-center space-x-2 relative ${
                activeFilterCount > 0 
                  ? 'bg-primary-500 text-white border-primary-500' 
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
              style={{ minHeight: '44px', minWidth: '44px' }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          </div>
          
          <motion.button
            onClick={handleSearch}
            disabled={loading}
            className="w-full mt-3 bg-primary-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '44px' }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Searching...' : 'Search Salons'}
          </motion.button>
        </div>

        {/* Location Status */}
        {locationPermission === 'granted' && (
          <div className="flex items-center mt-2 text-sm text-green-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Using your location for nearby results</span>
          </div>
        )}

        {/* Results Count */}
        {resultsCount !== undefined && (
          <div className="mt-2 text-sm text-gray-600">
            {resultsCount} salon{resultsCount !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="p-4 space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => toggleFilter('priceRange', range.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.priceRange?.includes(range.value)
                          ? `bg-${range.color}-100 text-${range.color}-800 border-${range.color}-300`
                          : 'bg-white text-gray-700 border-gray-300'
                      } border`}
                      style={{ minHeight: '36px' }}
                    >
                      {range.label}
                      {filters.priceRange?.includes(range.value) && (
                        <Check className="w-4 h-4 inline ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {popularServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => toggleFilter('services', service)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.services?.includes(service)
                          ? 'bg-primary-100 text-primary-800 border-primary-300'
                          : 'bg-white text-gray-700 border-gray-300'
                      } border`}
                      style={{ minHeight: '36px' }}
                    >
                      {service}
                      {filters.services?.includes(service) && (
                        <Check className="w-4 h-4 inline ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSpecialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => toggleFilter('specialties', specialty)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.specialties?.includes(specialty)
                          ? 'bg-accent-100 text-accent-800 border-accent-300'
                          : 'bg-white text-gray-700 border-gray-300'
                      } border`}
                      style={{ minHeight: '36px' }}
                    >
                      {specialty}
                      {filters.specialties?.includes(specialty) && (
                        <Check className="w-4 h-4 inline ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Languages Spoken</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => toggleFilter('languages', lang.code)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.languages?.includes(lang.code)
                          ? 'bg-secondary-100 text-secondary-800 border-secondary-300'
                          : 'bg-white text-gray-700 border-gray-300'
                      } border`}
                      style={{ minHeight: '36px' }}
                    >
                      {lang.name}
                      {filters.languages?.includes(lang.code) && (
                        <Check className="w-4 h-4 inline ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Additional Options</h3>
                <div className="space-y-2">
                  {[
                    { key: 'isVerified', label: 'Verified salons only' },
                    { key: 'acceptsWalkIns', label: 'Accepts walk-ins' },
                    { key: 'hasParking', label: 'Parking available' }
                  ].map((option) => (
                    <label key={option.key} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!filters[option.key as keyof SalonSearchFilters]}
                        onChange={() => toggleBooleanFilter(option.key as keyof SalonSearchFilters)}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium"
                  style={{ minHeight: '44px' }}
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    handleSearch()
                    setIsFilterOpen(false)
                  }}
                  className="flex-1 px-4 py-2 text-white bg-primary-500 border border-primary-500 rounded-lg font-medium"
                  style={{ minHeight: '44px' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchFilter