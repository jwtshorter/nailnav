'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Star, Phone, Globe, Award, ChevronRight } from 'lucide-react'
import NavigationComponent from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { SearchFilter } from '@/components/mobile-first/SearchFilter'
import Link from 'next/link'

interface Salon {
  id: number
  name: string
  slug: string
  address: string
  phone?: string
  website?: string
  rating: number
  review_count: number
  is_featured: boolean
  is_verified: boolean
  services_offered: string[]
  price_range: string
  latitude?: number
  longitude?: number
  cover_image_url?: string
}

interface CityPageProps {
  params: {
    state: string
    city: string
  }
}

export default function CityPage({ params }: CityPageProps) {
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)
  const [cityName, setCityName] = useState('')
  const [stateName, setStateName] = useState('')
  const [relatedCities, setRelatedCities] = useState<any[]>([])

  useEffect(() => {
    loadCityData()
  }, [params.state, params.city])

  const loadCityData = async () => {
    setLoading(true)
    
    try {
      // Format city name from slug
      const formattedCity = params.city
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      const formattedState = params.state.toUpperCase()
      
      setCityName(formattedCity)
      setStateName(formattedState)

      // Fetch salons for this city
      const response = await fetch(`/api/salons?city=${encodeURIComponent(formattedCity)}&state=${formattedState}`)
      
      if (response.ok) {
        const data = await response.json()
        setSalons(data.salons || [])
      }

      // Fetch related cities in the same state
      const citiesResponse = await fetch(`/api/cities?state=${formattedState}&limit=20`)
      if (citiesResponse.ok) {
        const citiesData = await citiesResponse.json()
        // Convert city names to slugs for URLs since cities table doesn't have slug column
        const citiesWithSlugs = (citiesData.cities || []).map((city: any) => ({
          ...city,
          slug: city.name.toLowerCase().replace(/\s+/g, '-')
        }))
        setRelatedCities(citiesWithSlugs)
      }
    } catch (error) {
      console.error('Error loading city data:', error)
    } finally {
      setLoading(false)
    }
  }

  const featuredSalons = salons.filter(s => s.is_featured)
  const regularSalons = salons.filter(s => !s.is_featured)

  const renderSalonCard = (salon: Salon, featured = false) => (
    <motion.div
      key={salon.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
        featured ? 'border-2 border-primary-500' : ''
      }`}
    >
      <Link href={`/salon/${salon.slug}`}>
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 relative">
            {salon.cover_image_url && (
              <img
                src={salon.cover_image_url}
                alt={salon.name}
                className="w-full h-full object-cover"
              />
            )}
            {featured && (
              <div className="absolute top-2 right-2 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Featured</span>
              </div>
            )}
            {salon.is_verified && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                ✓ Verified
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
              {salon.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(salon.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {salon.rating.toFixed(1)} ({salon.review_count} reviews)
              </span>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-2 text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <span className="text-sm">{salon.address}</span>
            </div>

            {/* Services Preview */}
            {salon.services_offered && salon.services_offered.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {salon.services_offered.slice(0, 3).map((service, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                  >
                    {service}
                  </span>
                ))}
                {salon.services_offered.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{salon.services_offered.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Price Range */}
            {salon.price_range && (
              <div className="text-sm text-gray-600 mb-3">
                Price: <span className="font-semibold">{salon.price_range}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              {salon.phone && (
                <a
                  href={`tel:${salon.phone}`}
                  className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-center text-sm font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="w-4 h-4 inline mr-1" />
                  Call
                </a>
              )}
              <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold">
                View Details
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading salons...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationComponent />

      {/* Hero Section with Map */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Best Nail Salons in {cityName}, {stateName}
            </h1>
            <p className="text-xl text-primary-100 mb-2">
              Find the perfect nail salon near you
            </p>
            <p className="text-primary-200">
              {salons.length} nail salon{salons.length !== 1 ? 's' : ''} found in {cityName}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <SearchFilter
            onSearch={(filters) => {
              console.log('Search filters:', filters)
              // TODO: Apply filters
            }}
            loading={loading}
            resultsCount={salons.length}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Best Salons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Award className="w-6 h-6 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Best Nail Salons in {cityName}
            </h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              Looking for the best nail salon in {cityName}, {stateName}? You've come to the right place! 
              NailNav has curated a comprehensive list of top-rated nail salons in {cityName} offering everything 
              from classic manicures and pedicures to gel extensions, SNS dip powder, and nail art.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you're looking for a quick polish change or a full spa treatment, our featured salons 
              in {cityName} provide exceptional service, experienced technicians, and a welcoming atmosphere. 
              Browse our verified listings, read customer reviews, and find the perfect nail salon for your needs.
            </p>
          </div>

          {/* Featured Salons */}
          {featuredSalons.length > 0 && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-600">★</span>
                <span>Featured Salons</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredSalons.map(salon => renderSalonCard(salon, true))}
              </div>
            </>
          )}

          {/* All Salons */}
          {regularSalons.length > 0 && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                All Nail Salons in {cityName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularSalons.map(salon => renderSalonCard(salon))}
              </div>
            </>
          )}

          {salons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No salons found in {cityName}. Check back soon as we're always adding new listings!
              </p>
            </div>
          )}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How do I choose the best nail salon in {cityName}?
              </h3>
              <p className="text-gray-600">
                Look for salons with high ratings, verified listings, and positive customer reviews. 
                Check if they offer the specific services you need (gel, SNS, nail art, etc.) and 
                review their hygiene practices and technician qualifications.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What services do nail salons in {cityName} typically offer?
              </h3>
              <p className="text-gray-600">
                Most nail salons in {cityName} offer manicures, pedicures, gel polish, gel extensions, 
                SNS dip powder, BIAB (Builder in a Bottle), acrylic nails, and nail art. Some also 
                provide additional beauty services like waxing, facials, and massage.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How much does a manicure cost in {cityName}?
              </h3>
              <p className="text-gray-600">
                Prices vary depending on the salon and service type. A basic manicure typically ranges 
                from $25-$40, while gel manicures cost between $40-$70. Premium services like gel 
                extensions or detailed nail art may cost more.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do I need an appointment at nail salons in {cityName}?
              </h3>
              <p className="text-gray-600">
                While many salons accept walk-ins, we recommend booking an appointment to ensure 
                availability, especially during peak times like weekends and evenings. Check each 
                salon's listing for their appointment policy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Related Cities */}
        {relatedCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nail Salons in Other {stateName} Cities
            </h2>
            <p className="text-gray-600 mb-6">
              Explore nail salons in other cities across {stateName}:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedCities
                .filter(city => city.slug !== params.city)
                .map((city) => (
                  <Link
                    key={city.id}
                    href={`/nail-salons/${params.state}/${city.slug}`}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 hover:underline group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>{city.name}</span>
                  </Link>
                ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}
