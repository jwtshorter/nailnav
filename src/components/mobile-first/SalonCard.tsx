'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Star, Clock, CheckCircle } from 'lucide-react'

interface Salon {
  id: string
  name: string
  slug: string
  address: string
  city: string
  state?: string | null
  website?: string
  price_from?: number
  currency?: string
  specialties?: string[]
  amenities?: string[]
  is_verified?: boolean
  logo_url?: string
  accepts_walk_ins?: boolean
  appointment_only?: boolean
  price_range?: string
  opening_hours?: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
}

interface SalonCardProps {
  salon: Salon & {
    average_rating?: number
    review_count?: number
    distance_meters?: number
  }
  onClick?: () => void
  onDirections?: () => void
  onContact?: () => void
  showDistance?: boolean
  showActionButtons?: boolean
  isCompact?: boolean
}

export const SalonCard = ({ 
  salon, 
  onClick, 
  onDirections, 
  onContact,
  showDistance = false,
  showActionButtons = false,
  isCompact = false 
}: SalonCardProps) => {
  const [imageError, setImageError] = useState(false)

  const formatDistance = (meters?: number): string => {
    if (!meters) return ''
    if (meters < 1000) return `${Math.round(meters)}m`
    return `${(meters / 1000).toFixed(1)}km`
  }

  const formatPriceRange = (priceRange?: string): string => {
    if (!priceRange) return ''
    const priceMap: Record<string, string> = {
      'budget': '$',
      'mid-range': '$$',
      'luxury': '$$$'
    }
    return priceMap[priceRange] || priceRange
  }

  const getOpeningStatus = (openingHours?: Record<string, string>): string => {
    if (!openingHours) return ''
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const now = new Date()
    const currentDay = days[now.getDay()]
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const todayHours = openingHours[currentDay]
    if (!todayHours || todayHours.toLowerCase() === 'closed') {
      // Check next open day
      for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (now.getDay() + i) % 7
        const nextDay = days[nextDayIndex]
        const nextDayHours = openingHours[nextDay]
        if (nextDayHours && nextDayHours.toLowerCase() !== 'closed') {
          const dayName = nextDay.charAt(0).toUpperCase() + nextDay.slice(1)
          return i === 1 ? `Opens tomorrow ${nextDayHours.split('-')[0].trim()}` : `Opens ${dayName} ${nextDayHours.split('-')[0].trim()}`
        }
      }
      return 'Closed'
    }
    
    // Parse hours like "9 am-7 pm" or "9:30 am-6 pm"
    const hoursMatch = todayHours.match(/(\d+):?(\d*)\s*(am|pm)\s*-\s*(\d+):?(\d*)\s*(am|pm)/i)
    if (!hoursMatch) return todayHours
    
    const [, openHour, openMin = '0', openPeriod, closeHour, closeMin = '0', closePeriod] = hoursMatch
    
    const openTime = (openPeriod.toLowerCase() === 'pm' && parseInt(openHour) !== 12 ? parseInt(openHour) + 12 : parseInt(openHour)) * 60 + parseInt(openMin)
    const closeTime = (closePeriod.toLowerCase() === 'pm' && parseInt(closeHour) !== 12 ? parseInt(closeHour) + 12 : parseInt(closeHour)) * 60 + parseInt(closeMin)
    
    if (currentTime >= openTime && currentTime < closeTime) {
      return 'Open now'
    } else if (currentTime < openTime) {
      return `Opens ${openHour}${openMin !== '0' ? ':' + openMin : ''}${openPeriod.toLowerCase()}`
    } else {
      // Check tomorrow's hours
      const tomorrowIndex = (now.getDay() + 1) % 7
      const tomorrowDay = days[tomorrowIndex]
      const tomorrowHours = openingHours[tomorrowDay]
      if (tomorrowHours && tomorrowHours.toLowerCase() !== 'closed') {
        return `Opens tomorrow ${tomorrowHours.split('-')[0].trim()}`
      }
      return 'Closed'
    }
  }

  // Get best specialty in priority order
  const getBestSpecialty = (): string | null => {
    if (!salon.specialties || salon.specialties.length === 0) return null
    const priority = ['Master Nail Artist', 'Award winning staff', 'Experienced Team', 'Qualified technicians']
    for (const spec of priority) {
      if (salon.specialties.includes(spec)) return spec
    }
    return salon.specialties[0]
  }

  // Get up to 3 amenities
  const getTopAmenities = (): string[] => {
    if (!salon.amenities || salon.amenities.length === 0) return []
    const priority = [
      'Complimentary drink',
      'Pet friendly',
      'Kid friendly',
      'Quick Service',
      'Heated Massage Chairs',
      'Eco-friendly products'
    ]
    const sorted = salon.amenities.sort((a, b) => {
      const aIndex = priority.indexOf(a)
      const bIndex = priority.indexOf(b)
      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
    return sorted.slice(0, 3)
  }

  const renderStars = (rating: number, count: number) => {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)} ({count})
        </span>
      </div>
    )
  }

  if (isCompact) {
    // Compact vertical layout for grid view (4 across on desktop)
    const bestSpecialty = getBestSpecialty()
    const topAmenities = getTopAmenities()
    
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden flex flex-col h-full"
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {/* Salon Image - SMALLER */}
        <div className="w-full h-32 rounded-t-lg overflow-hidden bg-gray-200 flex-shrink-0">
          {salon.logo_url && !imageError ? (
            <img
              src={salon.logo_url}
              alt={salon.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-100">
              <span className="text-primary-600 font-semibold text-3xl">
                {salon.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Salon Information - MORE SPACE */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Name - single line only, truncate at 38 chars */}
          <h3 className="font-bold text-base text-gray-900 mb-2 truncate">
            {salon.name.length > 38 ? salon.name.substring(0, 38) + '...' : salon.name}
            {salon.is_verified && (
              <CheckCircle className="w-4 h-4 text-green-500 inline-block ml-1" />
            )}
          </h3>

          {/* Address + Price + Open Status - same line */}
          <div className="flex items-center text-xs text-gray-600 mb-2 space-x-2">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate flex-1">{salon.city}, {salon.state}</span>
            {salon.price_range && (
              <span className="text-black font-normal">
                {formatPriceRange(salon.price_range)}
              </span>
            )}
            {salon.opening_hours && (
              <span className={`flex-shrink-0 ${
                getOpeningStatus(salon.opening_hours) === 'Open now' 
                  ? 'text-green-600 font-medium' 
                  : 'text-gray-600'
              }`}>
                {getOpeningStatus(salon.opening_hours)}
              </span>
            )}
          </div>

          {/* Rating */}
          {salon.average_rating && salon.review_count ? (
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= salon.average_rating! 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {salon.average_rating.toFixed(1)} ({salon.review_count})
              </span>
            </div>
          ) : null}

          {/* Operating Status */}
          {salon.appointment_only && (
            <div className="text-xs text-gray-500 mb-2">
              By appointment
            </div>
          )}

          {/* Best Specialty */}
          {bestSpecialty && (
            <div className="mb-2">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                {bestSpecialty}
              </span>
            </div>
          )}

          {/* Top Amenities */}
          {topAmenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {topAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Original horizontal layout for list view
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 p-4 mb-4 border border-gray-100"
      whileTap={{ scale: 0.98 }}
      style={{ minHeight: '44px' }}
    >
      <div className="flex space-x-4">
        {/* Salon Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
            {salon.logo_url && !imageError ? (
              <img
                src={salon.logo_url}
                alt={salon.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-100">
                <span className="text-primary-600 font-semibold text-lg">
                  {salon.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Salon Information */}
        <div className="flex-1 min-w-0" onClick={onClick}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {salon.name}
              </h3>
              {salon.is_verified && (
                <div className="flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">Verified</span>
                </div>
              )}
            </div>
            {showDistance && salon.distance_meters && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {formatDistance(salon.distance_meters)}
              </span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">{salon.address}</span>
          </div>

          {/* Opening Hours Status */}
          {salon.opening_hours && getOpeningStatus(salon.opening_hours) && (
            <div className="flex items-center text-sm mb-2">
              <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className={`${
                getOpeningStatus(salon.opening_hours) === 'Open now' 
                  ? 'text-green-600 font-semibold' 
                  : 'text-gray-600'
              }`}>
                {getOpeningStatus(salon.opening_hours)}
              </span>
            </div>
          )}

          {/* Rating */}
          {salon.average_rating && salon.review_count && (
            <div className="mb-3">
              {renderStars(salon.average_rating, salon.review_count)}
            </div>
          )}

          {/* Price Range */}
          {salon.price_range && (
            <div className="mb-3">
              <span className={`text-base font-semibold px-3 py-1 rounded-full ${
                salon.price_range === 'budget' 
                  ? 'bg-green-100 text-green-800'
                  : salon.price_range === 'mid-range'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {formatPriceRange(salon.price_range)}
              </span>
            </div>
          )}

          {/* Specialties */}
          {salon.specialties && salon.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {salon.specialties.slice(0, 3).map((specialty) => (
                <span
                  key={specialty}
                  className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs"
                >
                  {specialty}
                </span>
              ))}
              {salon.specialties.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{salon.specialties.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Operating Status */}
          {(salon.accepts_walk_ins || salon.appointment_only) && (
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Clock className="w-3 h-3 mr-1" />
              <span>
                {salon.accepts_walk_ins && 'Walk-ins welcome'}
                {salon.appointment_only && 'By appointment'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Only show when explicitly requested */}
      {showActionButtons && (
        <div className="flex space-x-2 mt-4">
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              onDirections?.()
            }}
            className="flex-1 bg-primary-500 text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
            style={{ minHeight: '44px', minWidth: '44px' }}
            whileTap={{ scale: 0.95 }}
          >
            <MapPin className="w-4 h-4" />
            <span>Directions</span>
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `/salon/${salon.slug}`
            }}
            className="flex-1 bg-accent-500 text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
            style={{ minHeight: '44px', minWidth: '44px' }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-4 h-4" />
            <span>Learn More</span>
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

export default SalonCard
