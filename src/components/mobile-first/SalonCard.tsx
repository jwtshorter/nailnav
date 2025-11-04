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
  state?: string | null  // State can be null/undefined
  website?: string
  price_from?: number
  currency?: string
  specialties?: string[]
  is_verified?: boolean
  logo_url?: string
  accepts_walk_ins?: boolean
  price_range?: string
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
    // Price range comes as $, $$, or $$$
    return priceRange
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
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 p-4 border border-gray-100 cursor-pointer"
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        style={{ minHeight: '44px' }}
      >
        {/* Salon Image */}
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200 mb-3">
          {salon.logo_url && !imageError ? (
            <img
              src={salon.logo_url}
              alt={salon.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-100">
              <span className="text-primary-600 font-semibold text-xl">
                {salon.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Salon Information */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <h3 className="font-semibold text-base text-gray-900 truncate max-w-full">
              {salon.name}
            </h3>
            {salon.is_verified && (
              <CheckCircle className="w-4 h-4 text-green-500 ml-1 flex-shrink-0" />
            )}
          </div>

          {/* Location */}
          <div className="flex items-center justify-center text-gray-600 text-sm mb-2">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{salon.city}{salon.state ? `, ${salon.state}` : ''}</span>
          </div>

          {/* Rating */}
          {salon.average_rating && salon.review_count && (
            <div className="flex justify-center mb-2">
              <div className="flex items-center space-x-1">
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
            </div>
          )}

          {/* Price Range */}
          {salon.price_range && (
            <div className="text-lg text-gray-700 font-semibold mb-2">
              {formatPriceRange(salon.price_range)}
            </div>
          )}

          {/* Distance (if shown) */}
          {showDistance && salon.distance_meters && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mb-2">
              {formatDistance(salon.distance_meters)}
            </div>
          )}

          {/* Top Specialty */}
          {salon.specialties && salon.specialties.length > 0 && (
            <div className="text-xs text-gray-500 truncate">
              {salon.specialties[0]}
              {salon.specialties.length > 1 && ` +${salon.specialties.length - 1} more`}
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
      style={{ minHeight: '44px' }} // iOS touch target minimum
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

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{salon.city}{salon.state ? `, ${salon.state}` : ''}</span>
          </div>

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
                salon.price_range === '$' 
                  ? 'bg-green-100 text-green-800'
                  : salon.price_range === '$$'
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
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <Clock className="w-3 h-3 mr-1" />
            <span>
              {salon.accepts_walk_ins ? 'Walk-ins welcome' : 'By appointment'}
            </span>
          </div>
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
              // Navigate to salon detail page
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