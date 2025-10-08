'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, MapPin, Check } from 'lucide-react'
import { useTranslation } from '../../contexts/TranslationContext'

interface SalonSearchFilters {
  city?: string
  services?: string[]
  priceRange?: string[]
  specialties?: string[]
  languages?: string[]
  expertise?: string[]
  hours?: string[]
  booking?: string[]
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

const expertiseFilters = [
  'Certified Nail Technicians',
  'Licensed Professionals',
  'Award-Winning Staff',
  'Experienced Team',
  'Qualified Technicians',
  'Specialty Certified',
  'Advanced Training',
  'Master Technicians'
]

const hoursFilters = [
  'Open Monday',
  'Open Tuesday',
  'Open Wednesday', 
  'Open Thursday',
  'Open Friday',
  'Open Saturday',
  'Open Sunday',
  'Extended Hours',
  'Late Night',
  'Early Morning'
]

const bookingFilters = [
  'Online Booking',
  'Phone Booking',
  'Walk-ins Welcome',
  'Appointment Required',
  'Same Day Booking',
  'Mobile Nails',
  'Group Bookings',
  'Advance Booking'
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' }
]

export const SearchFilter = ({ onSearch, loading, resultsCount }: SearchFilterProps) => {
  const { t } = useTranslation()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [serviceQuery, setServiceQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
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
    // Redirect to search page with parameters
    const params = new URLSearchParams()
    
    if (serviceQuery.trim()) {
      params.set('service', encodeURIComponent(serviceQuery.trim()))
    }
    
    if (locationQuery.trim()) {
      params.set('location', encodeURIComponent(locationQuery.trim()))
    }
    
    // Redirect to search page
    window.location.href = `/search?${params.toString()}`
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
    setServiceQuery('')
    setLocationQuery('')
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const quickFilters = [
    { label: t('search.filters.gelNails'), type: 'service', value: 'Gel Manicure' },
    { label: t('search.filters.manicure'), type: 'service', value: 'Classic Manicure' },
    { label: t('search.filters.pedicure'), type: 'service', value: 'Gel Pedicure' },
    { label: t('search.filters.acrylicNails'), type: 'service', value: 'Acrylic Nails' },
    { label: t('search.filters.nailArt'), type: 'service', value: 'Nail Art' },
    { label: t('search.filters.nailExtensions'), type: 'service', value: 'Gel Extensions' },
    { label: t('search.filters.nailRepair'), type: 'service', value: 'Classic Pedicure' },
    { label: t('search.filters.frenchManicure'), type: 'service', value: 'French Manicure' }
  ]

  const handleQuickFilter = (filter: typeof quickFilters[0]) => {
    if (filter.type === 'location' && userLocation) {
      handleSearch()
    } else if (filter.type === 'service' && filter.value) {
      toggleFilter('services', filter.value)
    } else if (filter.type === 'price' && filter.value) {
      toggleFilter('priceRange', filter.value)
    }
  }

  const isQuickFilterActive = (filter: typeof quickFilters[0]) => {
    if (filter.type === 'service' && filter.value) {
      return filters.services?.includes(filter.value) || false
    } else if (filter.type === 'price' && filter.value) {
      return filters.priceRange?.includes(filter.value) || false
    }
    return false
  }

  return (
    <div>
      {/* Search Bar */}
      <div>
        <div className="relative">
          {/* Search Input Fields Row */}
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            {/* Service/Business Name Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services or business name..."
                value={serviceQuery}
                onChange={(e) => setServiceQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                style={{ minHeight: '48px' }}
              />
            </div>
            
            {/* Location Input */}
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Location (city, suburb, postcode)"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                style={{ minHeight: '48px' }}
              />
              {/* Location Permission Status */}
              {locationPermission === 'granted' && userLocation && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center space-x-1 text-xs text-accent-600 font-medium">
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Search and Filter Buttons Row */}
          <div className="flex space-x-3 mt-3">
            {/* Search Button */}
            <motion.button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 md:flex-none md:px-8 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.95 }}
              style={{ minHeight: '48px' }}
            >
              {loading ? 'Searching...' : t('common.search')}
            </motion.button>
            
            {/* Enhanced Filter Button */}
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-3 rounded-lg border flex items-center space-x-2 relative font-medium transition-all duration-200 ${
                activeFilterCount > 0 
                  ? 'bg-primary-500 text-white border-primary-500 shadow-md' 
                  : isFilterOpen
                    ? 'bg-primary-50 text-primary-700 border-primary-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300 hover:text-primary-600'
              }`}
              style={{ minHeight: '48px', minWidth: '100px' }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">{t('common.filter')}</span>
              {activeFilterCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm"
                >
                  {activeFilterCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Quick Filter Chips */}
          {!isFilterOpen && activeFilterCount === 0 && (
            <motion.div 
              className="flex flex-wrap gap-2 mt-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-xs text-gray-500 font-medium mb-1 w-full">Quick filters:</span>
              {quickFilters.map((filter, index) => (
                <motion.button
                  key={filter.label}
                  onClick={() => handleQuickFilter(filter)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 flex items-center space-x-1 ${
                    isQuickFilterActive(filter)
                      ? 'bg-primary-100 text-primary-700 border-primary-300'
                      : 'bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-600 border-gray-200 hover:border-primary-200'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span>{filter.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && !isFilterOpen && (
            <motion.div 
              className="mt-3 flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-xs text-gray-500 font-medium">Active filters:</span>
              {filters.priceRange?.map((range) => (
                <span key={range} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {priceRanges.find(r => r.value === range)?.label}
                </span>
              ))}
              {filters.services?.slice(0, 2).map((service) => (
                <span key={service} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  {service}
                </span>
              ))}
              {(filters.services?.length || 0) > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{(filters.services?.length || 0) - 2} more
                </span>
              )}
              {filters.expertise?.slice(0, 1).map((expertise) => (
                <span key={expertise} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {expertise}
                </span>
              ))}
              {filters.hours?.slice(0, 1).map((hours) => (
                <span key={hours} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {hours}
                </span>
              ))}
              {filters.booking?.slice(0, 1).map((booking) => (
                <span key={booking} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {booking}
                </span>
              ))}
              {filters.acceptsWalkIns && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Walk-ins</span>
              )}
              <button
                onClick={clearFilters}
                className="ml-2 text-xs text-gray-500 hover:text-red-600 underline"
              >
                Clear all
              </button>
            </motion.div>
          )}

        </div>



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
            className="mt-4 bg-gray-50 rounded-lg border border-gray-200"
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

              {/* Expertise */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {expertiseFilters.map((expertise) => (
                    <button
                      key={expertise}
                      onClick={() => toggleFilter('expertise', expertise)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.expertise?.includes(expertise)
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'bg-white text-gray-700 border-gray-300'
                      } border`}
                      style={{ minHeight: '36px' }}
                    >
                      {expertise}
                      {filters.expertise?.includes(expertise) && (
                        <Check className="w-4 h-4 inline ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Hours</h3>
                <div className="flex flex-wrap gap-2">
                  {hoursFilters.map((hours) => (
                    <button
                      key={hours}
                      onClick={() => toggleFilter('hours', hours)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.hours?.includes(hours)
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-white text-gray-700 border-gray-300'
                      } border`}
                      style={{ minHeight: '36px' }}
                    >
                      {hours}
                      {filters.hours?.includes(hours) && (
                        <Check className="w-4 h-4 inline ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Booking</h3>
                <div className="flex flex-wrap gap-2">
                  {bookingFilters.map((booking) => (
                    <button
                      key={booking}
                      onClick={() => toggleFilter('booking', booking)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.booking?.includes(booking)
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-white text-gray-700 border-gray-300'
                      } border`}
                      style={{ minHeight: '36px' }}
                    >
                      {booking}
                      {filters.booking?.includes(booking) && (
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
                  Search Results
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