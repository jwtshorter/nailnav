'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Navigation2, Phone, Star, Clock, X, List, Map } from 'lucide-react'
import NavigationComponent from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import SalonCard from '@/components/mobile-first/SalonCard'
import { useTranslation } from '../../contexts/TranslationContext'

interface Salon {
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
  lat: number
  lng: number
  hours?: string
  image?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function SearchPage() {
  const { t } = useTranslation()
  const [serviceQuery, setServiceQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null)
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // Mock salon data
  const mockSalons: Salon[] = [
    {
      id: '1',
      name: 'Elegant Nails Spa',
      slug: 'elegant-nails-spa',
      address: '123 Collins Street',
      city: 'Melbourne',
      state: 'VIC',
      phone: '+61 3 9123 4567',
      price_from: 35,
      currency: 'AUD',
      specialties: ['Gel Manicures', 'Nail Art', 'Spa Pedicures'],
      is_verified: true,
      average_rating: 4.8,
      review_count: 127,
      lat: -37.8136,
      lng: 144.9631,
      hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-6PM, Sun: 10AM-5PM',
      image: 'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121'
    },
    {
      id: '2',
      name: 'Luxe Nail Lounge',
      slug: 'luxe-nail-lounge',
      address: '456 Chapel Street',
      city: 'South Yarra',
      state: 'VIC',
      phone: '+61 3 9876 5432',
      price_from: 65,
      currency: 'AUD',
      specialties: ['Premium Gel Services', 'Luxury Treatments'],
      is_verified: true,
      average_rating: 4.9,
      review_count: 89,
      lat: -37.8467,
      lng: 144.9908,
      hours: 'Mon-Sun: 9AM-8PM',
      image: 'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8'
    },
    {
      id: '3',
      name: 'Quick Nails Express',
      slug: 'quick-nails-express',
      address: '789 Burke Street',
      city: 'Melbourne',
      state: 'VIC',
      phone: '+61 3 9456 7890',
      price_from: 20,
      currency: 'AUD',
      specialties: ['Quick Service', 'Walk-ins Welcome'],
      is_verified: false,
      average_rating: 4.2,
      review_count: 45,
      lat: -37.8118,
      lng: 144.9648,
      hours: 'Mon-Sat: 8AM-6PM, Sun: 10AM-4PM'
    }
  ]

  // Initialize map
  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current && window.google) {
        const defaultCenter = userLocation || { lat: -37.8136, lng: 144.9631 } // Melbourne
        
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: defaultCenter,
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })

        // Add salon markers
        addSalonMarkers(mockSalons)
      }
    }

    // Load Google Maps API
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&callback=initMap`
      script.async = true
      script.defer = true
      
      window.initMap = initializeMap
      document.head.appendChild(script)
    } else {
      initializeMap()
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          
          if (googleMapRef.current) {
            googleMapRef.current.setCenter(location)
          }
        },
        (error) => {
          console.log('Geolocation error:', error)
        }
      )
    }

    setSalons(mockSalons)
  }, [userLocation])

  const addSalonMarkers = (salonsData: Salon[]) => {
    if (!googleMapRef.current || !window.google) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    salonsData.forEach(salon => {
      const marker = new window.google.maps.Marker({
        position: { lat: salon.lat, lng: salon.lng },
        map: googleMapRef.current,
        title: salon.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.164 0 0 7.164 0 16C0 24.836 16 40 16 40C16 40 32 24.836 32 16C32 7.164 24.836 0 16 0Z" fill="#F4C7B8"/>
              <circle cx="16" cy="16" r="8" fill="white"/>
              <circle cx="16" cy="16" r="4" fill="#2F2F2F"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 40),
          anchor: new window.google.maps.Point(16, 40)
        }
      })

      marker.addListener('click', () => {
        setSelectedSalon(salon)
        setViewMode('list')
      })

      markersRef.current.push(marker)
    })
  }

  const handleSearch = () => {
    setLoading(true)
    // Simulate search
    setTimeout(() => {
      const filteredSalons = mockSalons.filter(salon => {
        const serviceMatch = serviceQuery === '' || 
          salon.name.toLowerCase().includes(serviceQuery.toLowerCase()) ||
          salon.specialties?.some(spec => spec.toLowerCase().includes(serviceQuery.toLowerCase()))
        
        const locationMatch = locationQuery === '' ||
          salon.city.toLowerCase().includes(locationQuery.toLowerCase()) ||
          salon.address.toLowerCase().includes(locationQuery.toLowerCase()) ||
          salon.state.toLowerCase().includes(locationQuery.toLowerCase())
        
        return serviceMatch && locationMatch
      })
      setSalons(filteredSalons)
      addSalonMarkers(filteredSalons)
      setLoading(false)
    }, 500)
  }

  const handleSalonClick = (salon: Salon) => {
    setSelectedSalon(salon)
    if (googleMapRef.current) {
      googleMapRef.current.setCenter({ lat: salon.lat, lng: salon.lng })
      googleMapRef.current.setZoom(16)
    }
  }

  const getDirections = (salon: Salon) => {
    const address = encodeURIComponent(`${salon.address}, ${salon.city}, ${salon.state}`)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
  }

  const callSalon = (salon: Salon) => {
    if (salon.phone) {
      window.location.href = `tel:${salon.phone}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationComponent />
      
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mb-4">
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
              />
              {/* Location Permission Status */}
              {userLocation && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center space-x-1 text-xs text-accent-600 font-medium">
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                    <span>Using your location</span>
                  </div>
                </div>
              )}
            </div>
            
            <motion.button
              onClick={handleSearch}
              className="md:w-auto px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Searching...' : t('common.search')}
            </motion.button>
          </div>

          {/* View Toggle & Results Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {salons.length} {t('search.results.found')}
              </span>
              <motion.button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-4 h-4" />
                <span>{t('common.filter')}</span>
              </motion.button>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <motion.button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-white text-accent-500 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Map className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-accent-500 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Map Container */}
        <div className={`${viewMode === 'map' ? 'flex-1' : 'hidden md:block md:w-1/2'} relative`}>
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Map Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className={`${
          viewMode === 'list' 
            ? 'flex-1' 
            : 'w-0 md:w-1/2'
        } bg-white border-l border-gray-200 overflow-hidden transition-all duration-300`}>
          <div className="h-full overflow-y-auto">
            {salons.length > 0 ? (
              <div className="p-4 space-y-4">
                {salons.map((salon) => (
                  <motion.div
                    key={salon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`cursor-pointer ${
                      selectedSalon?.id === salon.id ? 'ring-2 ring-primary-500 rounded-lg' : ''
                    }`}
                    onClick={() => handleSalonClick(salon)}
                  >
                    <SalonCard
                      salon={salon}
                      onClick={() => handleSalonClick(salon)}
                      onDirections={() => getDirections(salon)}
                      onContact={() => callSalon(salon)}
                      showActionButtons={true}
                      showDistance={true}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">{t('search.results.noResults')}</p>
                  <p className="text-sm">{t('search.results.tryDifferent')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Salon Details (Mobile) */}
      {selectedSalon && viewMode === 'map' && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden max-h-96 overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{selectedSalon.name}</h3>
            <button
              onClick={() => setSelectedSalon(null)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{selectedSalon.address}, {selectedSalon.city}</span>
            </div>
            {selectedSalon.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{selectedSalon.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{selectedSalon.average_rating} ({selectedSalon.review_count} reviews)</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              onClick={() => getDirections(selectedSalon)}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium text-sm"
              whileTap={{ scale: 0.95 }}
            >
              <Navigation2 className="w-4 h-4 inline mr-2" />
              Directions
            </motion.button>
            {selectedSalon.phone && (
              <motion.button
                onClick={() => callSalon(selectedSalon)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm"
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Call
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      <Footer />
    </div>
  )
}