'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Footer from '@/components/mobile-first/Footer'
import NavigationComponent from '@/components/mobile-first/Navigation'
import { 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Clock, 
  CheckCircle, 
  Navigation as NavigationIcon,
  Calendar,
  Users,
  Heart,
  Sparkles,
  Shield,
  Languages
} from 'lucide-react'

interface Review {
  id: number
  rating: number
  content: string
  reviewer_name: string
  is_verified: boolean
  created_at: string
}

interface SalonDetails {
  id: number
  name: string
  slug: string
  description: string
  address: string
  city: string
  state: string
  phone?: string
  website?: string
  rating: number
  specialties: string[]
  services_offered: string[]
  languages_spoken: string[]
  is_verified: boolean
  parking: boolean
  accepts_walk_ins: boolean
  opening_hours: Record<string, string>
  latitude?: number
  longitude?: number
  average_rating: number
  review_count: number
  reviews: Review[]
  manicure: boolean
  pedicure: boolean
  gel_nails: boolean
  acrylic_nails: boolean
  nail_art: boolean
  master_artist: boolean
  certified_technicians: boolean
  experienced_staff: boolean
}

export default function SalonDetailPage({ params }: { params: { slug: string } }) {
  const [salon, setSalon] = useState<SalonDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSalonDetails(params.slug)
  }, [params.slug])

  const loadSalonDetails = async (slug: string) => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/salons/${slug}`)
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        console.error('Salon not found')
        setLoading(false)
        return
      }
      
      setSalon(data.salon)
    } catch (error) {
      console.error('Error loading salon:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatOperatingHours = (hours: Record<string, string>) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    return days.map((day, index) => ({
      day: dayNames[index],
      hours: hours[day] || hours[day.toLowerCase()] || 'Closed'
    }))
  }

  const parseDescription = (desc: string) => {
    const sections = {
      about: '',
      reviews: '',
      services: '',
      amenities: '',
      qualifications: '',
      treatments: '',
      hours: '',
      appointments: '',
      space: '',
      ownership: '',
      languages: ''
    }

    // Try to extract sections from description
    const aboutMatch = desc.match(/About.*?(?=What|$)/is)
    if (aboutMatch) sections.about = aboutMatch[0]
    
    return sections
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading salon details...</p>
        </div>
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationComponent />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Salon Not Found</h1>
          <p className="text-gray-600 mb-6">The salon you're looking for doesn't exist.</p>
          <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Return to Homepage
          </a>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationComponent />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => window.history.back()}
            className="mb-4 flex items-center text-white hover:text-primary-100 transition-colors"
          >
            <NavigationIcon className="w-5 h-5 mr-2 transform rotate-180" />
            Back
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h1 className="text-3xl md:text-4xl font-bold mr-3">{salon.name}</h1>
                {salon.is_verified && (
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>

              <div className="flex items-center mb-3">
                {renderStars(salon.average_rating || salon.rating)}
                <span className="ml-2 text-white text-opacity-90">
                  {(salon.average_rating || salon.rating).toFixed(1)} ({salon.review_count} reviews)
                </span>
              </div>

              <div className="flex items-center text-white text-opacity-90 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{salon.address}, {salon.city}, {salon.state}</span>
              </div>

              {salon.phone && (
                <div className="flex items-center text-white text-opacity-90 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${salon.phone}`} className="hover:text-white transition-colors">
                    {salon.phone}
                  </a>
                </div>
              )}

              {salon.website && (
                <div className="flex items-center text-white text-opacity-90">
                  <Globe className="w-4 h-4 mr-2" />
                  <a 
                    href={salon.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Single Page Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {salon.name}</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {salon.description}
                </p>
              </div>
            </motion.section>

            {/* Reviews Summary */}
            {salon.review_count > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What do the reviews say?</h2>
                <div className="flex items-center mb-4">
                  {renderStars(salon.average_rating || salon.rating)}
                  <span className="ml-2 text-lg font-semibold text-gray-900">
                    {(salon.average_rating || salon.rating).toFixed(1)} out of 5
                  </span>
                  <span className="ml-2 text-gray-600">
                    ({salon.review_count} reviews)
                  </span>
                </div>
                
                {/* Real Reviews from Database */}
                {salon.reviews && salon.reviews.length > 0 ? (
                  <div className="space-y-4 mt-6">
                    {salon.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-l-4 border-primary-500 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{review.reviewer_name}</span>
                            {review.is_verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                )}
              </motion.section>
            )}

            {/* Services Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What services do they offer?</h2>
              <div className="flex flex-wrap gap-2">
                {salon.services_offered && salon.services_offered.length > 0 ? (
                  salon.services_offered.map((service, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {service}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">Services information coming soon</p>
                )}
              </div>
            </motion.section>

            {/* Staff Qualifications */}
            {salon.specialties && salon.specialties.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How qualified are the staff?</h2>
                <div className="flex flex-wrap gap-2">
                  {salon.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {specialty}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Languages */}
            {salon.languages_spoken && salon.languages_spoken.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What languages do they speak?</h2>
                <div className="flex flex-wrap gap-2">
                  {salon.languages_spoken.map((language, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center"
                    >
                      <Languages className="w-4 h-4 mr-2" />
                      {language}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Map Section */}
            {salon.latitude && salon.longitude && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(salon.address + ', ' + salon.city + ', ' + salon.state)}&zoom=15`}
                    allowFullScreen
                  />
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Operating Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-600" />
                Opening Hours
              </h3>
              <div className="space-y-2">
                {salon.opening_hours && Object.keys(salon.opening_hours).length > 0 ? (
                  formatOperatingHours(salon.opening_hours).map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-700">{item.day}</span>
                      <span className="text-gray-600">{item.hours}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Hours not available. Please contact salon.</p>
                )}
              </div>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
              <div className="space-y-3">
                {salon.parking && (
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Parking Available</span>
                  </div>
                )}
                {salon.accepts_walk_ins && (
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Walk-ins Welcome</span>
                  </div>
                )}
                {salon.is_verified && (
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Verified Business</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary-600 text-white rounded-lg shadow-card p-6"
            >
              <h3 className="text-xl font-bold mb-2">Ready to Book?</h3>
              <p className="text-white text-opacity-90 mb-4">Contact {salon.name} today</p>
              {salon.phone && (
                <a
                  href={`tel:${salon.phone}`}
                  className="block w-full bg-white text-primary-600 text-center py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Call Now
                </a>
              )}
              {salon.website && (
                <a
                  href={salon.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white bg-opacity-20 text-white text-center py-3 rounded-lg font-semibold hover:bg-opacity-30 transition-colors mt-3"
                >
                  Visit Website
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
