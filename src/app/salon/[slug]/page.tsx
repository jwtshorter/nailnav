'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Footer from '@/components/mobile-first/Footer'
import NavigationComponent from '@/components/mobile-first/Navigation'
import SalonHero from '@/components/salon/SalonHero'
import FAQSection from '@/components/salon/FAQSection'
import AmenitiesCard from '@/components/salon/AmenitiesCard'
import OpenStreetMapEmbed from '@/components/salon/OpenStreetMapEmbed'
import { renderStars } from '@/lib/utils/renderStars'
import { parseDescriptionFAQ } from '@/lib/utils/parseDescriptionFAQ'
import { formatOperatingHours } from '@/lib/utils/operatingHours'
import { 
  Phone, 
  Globe, 
  Clock, 
  CheckCircle, 
  Shield
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
  amenities: string[]
  appointment_types: string[]
  is_verified: boolean
  parking: boolean
  accepts_walk_ins: boolean
  wheelchair_accessible: boolean
  kid_friendly: boolean
  opening_hours: Record<string, string>
  latitude?: number
  longitude?: number
  average_rating: number
  review_count: number
  reviews: Review[]
  cover_image_url?: string
  about?: string
  review_summary?: string
  customers_saying?: string
  health_wellbeing_care?: string
}

const DEFAULT_HEADER_IMAGE = "https://page.gensparksite.com/v1/base64_upload/20b6324e96a00728ec9a21f203dd1de5"

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
        return
      }
      
      setSalon(data.salon)
    } catch (error) {
      console.error('Error loading salon:', error)
    } finally {
      setLoading(false)
    }
  }

  const trackClick = (type: 'website' | 'phone') => {
    // TODO: Send analytics event to backend
    console.log(`${type} click tracked for salon: ${salon?.name}`)
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

  const faqSections = parseDescriptionFAQ(salon.description, salon.name)

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationComponent />

      <SalonHero
        salon={salon}
        defaultHeaderImage={DEFAULT_HEADER_IMAGE}
        onWebsiteClick={() => trackClick('website')}
        onPhoneClick={() => trackClick('phone')}
        onBack={() => window.history.back()}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            {salon.about && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About {salon.name} in {salon.city}, {salon.state}
                </h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {salon.about}
                </div>
              </motion.section>
            )}

            {/* What are customers saying? */}
            {(salon.customers_saying || salon.review_summary) && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-lg shadow-card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What are customers saying?
                </h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {salon.customers_saying || salon.review_summary}
                </div>
              </motion.section>
            )}

            {/* Health and Wellbeing Care */}
            {salon.health_wellbeing_care && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  How do they care for your health and wellbeing?
                </h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {salon.health_wellbeing_care}
                </div>
              </motion.section>
            )}

            {/* Services Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
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

            {/* Space/Amenities Section */}
            {salon.amenities && salon.amenities.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What sort of space is the salon?</h2>
                <div className="flex flex-wrap gap-2">
                  {salon.amenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Staff Qualifications */}
            {salon.specialties && salon.specialties.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
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

            {/* Appointment Types */}
            {salon.appointment_types && salon.appointment_types.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What appointment types do they accept?</h2>
                <div className="flex flex-wrap gap-2">
                  {salon.appointment_types.map((type, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {/* OpenStreetMap Section */}
            {salon.latitude && salon.longitude && (
              <OpenStreetMapEmbed 
                latitude={salon.latitude} 
                longitude={salon.longitude}
                delay={0.35}
              />
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
                      <span className="text-gray-600 text-sm">{item.hours}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">Hours not available. Please contact salon.</p>
                )}
              </div>
            </motion.div>

            {/* Amenities with Languages */}
            <AmenitiesCard
              parking={salon.parking}
              accepts_walk_ins={salon.accepts_walk_ins}
              wheelchair_accessible={salon.wheelchair_accessible}
              kid_friendly={salon.kid_friendly}
              is_verified={salon.is_verified}
              languages_spoken={salon.languages_spoken}
            />

            {/* Quick Contact CTA */}
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
                  onClick={() => trackClick('phone')}
                  className="block w-full bg-white text-primary-600 text-center py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors mb-3"
                >
                  <Phone className="w-5 h-5 inline mr-2" />
                  Call Now
                </a>
              )}
              {salon.website && (
                <a
                  href={salon.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('website')}
                  className="block w-full bg-white bg-opacity-20 text-white text-center py-3 rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
                >
                  <Globe className="w-5 h-5 inline mr-2" />
                  Visit Website
                </a>
              )}
            </motion.div>

            {/* Claim This Listing Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-yellow-500 text-gray-900 rounded-lg shadow-card p-6 text-center"
            >
              <h3 className="text-xl font-bold mb-2">Own this salon?</h3>
              <p className="text-gray-900 text-opacity-90 mb-4">Claim your listing to manage your profile</p>
              <button className="w-full bg-gray-900 text-yellow-500 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                ⭐ Claim This Listing
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
