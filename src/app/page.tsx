'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Star, TrendingUp, Shield, Clock } from 'lucide-react'
import Navigation from '@/components/mobile-first/Navigation'
import SearchFilter from '@/components/mobile-first/SearchFilter'
import SalonCard from '@/components/mobile-first/SalonCard'
import Footer from '@/components/mobile-first/Footer'
import { useTranslation } from '../contexts/TranslationContext'
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
  website?: string
  price_from?: number
  currency?: string
  specialties?: string[]
  is_verified?: boolean
  average_rating?: number
  review_count?: number
  distance_meters?: number
}

export default function HomePage() {
  const { t } = useTranslation()
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
        website: 'https://elegantnailsspa.com',
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
        website: 'https://luxenaillounge.com',
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
          website: 'https://quicknailsexpress.com',
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
    
    // Navigate to contact form instead of calling
    window.location.href = `/salon/${salon.slug}#contact`
  }

  const features = [
    {
      icon: MapPin,
      title: t('home.whyChoose.comprehensive.title'),
      description: t('home.whyChoose.comprehensive.description')
    },
    {
      icon: Star,
      title: t('home.whyChoose.verified.title'),
      description: t('home.whyChoose.verified.description')
    },
    {
      icon: Shield,
      title: t('home.whyChoose.easyBooking.title'),
      description: t('home.whyChoose.easyBooking.description')
    },
    {
      icon: Clock,
      title: t('home.whyChoose.supportLocal.title'),
      description: t('home.whyChoose.supportLocal.description')
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section with Overlaid Search */}
      <div 
        className="relative text-white min-h-[80vh] md:min-h-[70vh] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Hero Content */}
            <motion.div 
              className="text-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
            </motion.div>

            {/* Overlaid Search Filter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 md:p-8"
            >
              <SearchFilter 
                onSearch={handleSearch}
                loading={loading}
                resultsCount={searchResults.length}
              />
            </motion.div>
          </div>
        </div>
      </div>

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
              {t('search.results.found')} {searchResults.length > 0 && `(${searchResults.length})`}
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
                    showActionButtons={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('search.results.noResults')}</p>
                <p className="text-sm">{t('search.results.tryDifferent')}</p>
              </div>
            )}
          </motion.section>
        )}

        {/* Featured Vendors Section */}
        {!searchPerformed && (
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t('home.featuredVendors.title')}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {t('home.featuredVendors.subtitle')}
            </p>
            
            {/* 2 rows x 4 boxes grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Row 1 */}
              {[
                {
                  id: 'vendor-1',
                  name: 'Elegant Nails Spa',
                  image: 'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121',
                  specialties: ['Gel Manicures', 'Nail Art'],
                  rating: 4.8,
                  reviewCount: 127,
                  location: 'Los Angeles, CA',
                  verified: true
                },
                {
                  id: 'vendor-2', 
                  name: 'Luxe Nail Lounge',
                  image: 'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8',
                  specialties: ['Premium Gel', 'Luxury Treatments'],
                  rating: 4.9,
                  reviewCount: 89,
                  location: 'Beverly Hills, CA',
                  verified: true
                },
                {
                  id: 'vendor-3',
                  name: 'Trendy Nails Studio',
                  image: 'https://page.gensparksite.com/v1/base64_upload/fd5b1d89ee755b0b188cab2569983b82',
                  specialties: ['Nail Art', 'Acrylic Extensions'],
                  rating: 4.7,
                  reviewCount: 156,
                  location: 'Miami, FL',
                  verified: true
                },
                {
                  id: 'vendor-4',
                  name: 'Pure Beauty Nails',
                  image: 'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121',
                  specialties: ['French Manicure', 'Spa Pedicure'],
                  rating: 4.6,
                  reviewCount: 92,
                  location: 'San Francisco, CA',
                  verified: false
                }
              ].map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  onClick={() => {
                    const slugMap: Record<string, string> = {
                      'vendor-1': 'elegant-nails-spa',
                      'vendor-2': 'luxe-nail-lounge', 
                      'vendor-3': 'trendy-nails-studio',
                      'vendor-4': 'pure-beauty-nails',
                      'vendor-5': 'glamour-nail-bar',
                      'vendor-6': 'serenity-spa-nails',
                      'vendor-7': 'modern-nails-boutique',
                      'vendor-8': 'royal-touch-nails'
                    }
                    window.location.href = `/salon/${slugMap[vendor.id] || 'elegant-nails-spa'}`
                  }}
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-200 overflow-hidden relative">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {vendor.verified && (
                      <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <Shield className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {vendor.name}
                    </h3>
                    
                    {/* Location */}
                    <p className="text-xs text-accent-600 mb-2 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {vendor.location}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-gray-700">{vendor.rating}</span>
                        <span className="text-xs text-gray-500">({vendor.reviewCount})</span>
                      </div>
                    </div>
                    
                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.slice(0, 2).map((specialty) => (
                        <span 
                          key={specialty}
                          className="text-xs bg-secondary-100 text-secondary-700 px-1.5 py-0.5 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 'vendor-5',
                  name: 'Glamour Nail Bar',
                  image: 'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8',
                  specialties: ['Dip Powder', 'Nail Extensions'],
                  rating: 4.5,
                  reviewCount: 78,
                  location: 'New York, NY',
                  verified: true
                },
                {
                  id: 'vendor-6',
                  name: 'Serenity Spa Nails',
                  image: 'https://page.gensparksite.com/v1/base64_upload/fd5b1d89ee755b0b188cab2569983b82',
                  specialties: ['Organic Treatments', 'Wellness'],
                  rating: 4.7,
                  reviewCount: 134,
                  location: 'Austin, TX',
                  verified: true
                },
                {
                  id: 'vendor-7',
                  name: 'Modern Nails Boutique',
                  image: 'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121',
                  specialties: ['Contemporary Art', 'Gel Polish'],
                  rating: 4.4,
                  reviewCount: 67,
                  location: 'Seattle, WA',
                  verified: false
                },
                {
                  id: 'vendor-8',
                  name: 'Royal Touch Nails',
                  image: 'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8',
                  specialties: ['Luxury Service', 'VIP Experience'],
                  rating: 4.8,
                  reviewCount: 203,
                  location: 'Las Vegas, NV',
                  verified: true
                }
              ].map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + 0.1 * index }}
                  onClick={() => {
                    const slugMap: Record<string, string> = {
                      'vendor-1': 'elegant-nails-spa',
                      'vendor-2': 'luxe-nail-lounge', 
                      'vendor-3': 'trendy-nails-studio',
                      'vendor-4': 'pure-beauty-nails',
                      'vendor-5': 'glamour-nail-bar',
                      'vendor-6': 'serenity-spa-nails',
                      'vendor-7': 'modern-nails-boutique',
                      'vendor-8': 'royal-touch-nails'
                    }
                    window.location.href = `/salon/${slugMap[vendor.id] || 'elegant-nails-spa'}`
                  }}
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-200 overflow-hidden relative">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {vendor.verified && (
                      <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <Shield className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {vendor.name}
                    </h3>
                    
                    {/* Location */}
                    <p className="text-xs text-accent-600 mb-2 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {vendor.location}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-gray-700">{vendor.rating}</span>
                        <span className="text-xs text-gray-500">({vendor.reviewCount})</span>
                      </div>
                    </div>
                    
                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.slice(0, 2).map((specialty) => (
                        <span 
                          key={specialty}
                          className="text-xs bg-secondary-100 text-secondary-700 px-1.5 py-0.5 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
              {t('home.whyChoose.title')}
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



        {/* Explore Cities Section */}
        {!searchPerformed && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Explore Cities
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Find the best nail salons in these popular locations
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                // USA Cities
                { name: 'Los Angeles', country: 'USA', slug: 'los-angeles-ca' },
                { name: 'New York', country: 'USA', slug: 'new-york-ny' },
                { name: 'Miami', country: 'USA', slug: 'miami-fl' },
                { name: 'Chicago', country: 'USA', slug: 'chicago-il' },
                { name: 'Las Vegas', country: 'USA', slug: 'las-vegas-nv' },
                { name: 'San Francisco', country: 'USA', slug: 'san-francisco-ca' },
                // Australia Cities  
                { name: 'Sydney', country: 'Australia', slug: 'sydney-nsw' },
                { name: 'Melbourne', country: 'Australia', slug: 'melbourne-vic' }
              ].map((city, index) => (
                <motion.a
                  key={city.slug}
                  href={`/search?location=${encodeURIComponent(city.name)}`}
                  className="bg-white p-4 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {city.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {city.country}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.section>
        )}

        {/* Blog Section */}
        {!searchPerformed && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Latest from Our Blog</h2>
              <a
                href="/blog"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
              >
                <span>View All</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 1,
                  title: "The Ultimate Guide to Nail Care: Tips for Healthy, Beautiful Nails",
                  excerpt: "Discover professional secrets for maintaining healthy nails between salon visits.",
                  image: "https://cdn1.genspark.ai/user-upload-image/5_generated/5de0f390-7a30-4ecd-821b-9cf041783001",
                  date: "Jan 15, 2025",
                  category: "Nail Care",
                  readTime: 5
                },
                {
                  id: 2,
                  title: "Top 10 Nail Art Trends for 2025: What's Hot This Year",
                  excerpt: "Stay ahead of the curve with the latest nail art trends and fashion statements.",
                  image: "https://cdn1.genspark.ai/user-upload-image/5_generated/4370c9c9-49cb-4ff5-97bd-7a9196f0b295",
                  date: "Jan 12, 2025",
                  category: "Trends",
                  readTime: 7
                },
                {
                  id: 3,
                  title: "How to Choose the Perfect Nail Salon: A Complete Checklist",
                  excerpt: "Find the ideal nail salon with our comprehensive guide and safety tips.",
                  image: "https://cdn1.genspark.ai/user-upload-image/5_generated/1e0f356a-74af-42c5-923e-e07aa56d7a45",
                  date: "Jan 8, 2025",
                  category: "Tips",
                  readTime: 6
                },
                {
                  id: 4,
                  title: "DIY Manicure at Home: Professional Results Without the Salon",
                  excerpt: "Master the art of at-home manicures with step-by-step instructions.",
                  image: "https://cdn1.genspark.ai/user-upload-image/5_generated/05c3be11-a17c-4eb5-9809-23740d71c9df",
                  date: "Jan 5, 2025",
                  category: "Basics",
                  readTime: 4
                }
              ].map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer group"
                  onClick={() => window.location.href = `/blog/${post.id}`}
                >
                  {/* Image */}
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {/* Category & Read Time */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-xs">{post.readTime} min</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}