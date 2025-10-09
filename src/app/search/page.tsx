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
  
  // Handle URL search parameters and auto-search
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const service = urlParams.get('service') || ''
    const location = urlParams.get('location') || ''
    
    if (service) {
      setServiceQuery(decodeURIComponent(service))
    }
    if (location) {
      setLocationQuery(decodeURIComponent(location))
    }
    
    // Auto-search if parameters are provided
    if (service || location) {
      setTimeout(() => {
        setLoading(true)
        setTimeout(() => {
          const filteredSalons = mockSalons.filter(salon => {
            const serviceMatch = service === '' || 
              salon.name.toLowerCase().includes(service.toLowerCase()) ||
              salon.specialties?.some(spec => spec.toLowerCase().includes(service.toLowerCase()))
            
            const locationMatch = location === '' ||
              salon.city.toLowerCase().includes(location.toLowerCase()) ||
              salon.address.toLowerCase().includes(location.toLowerCase()) ||
              salon.state.toLowerCase().includes(location.toLowerCase())
            
            return serviceMatch && locationMatch
          })
          setSalons(filteredSalons)
          if (leafletMapRef.current) {
            addSalonMarkers(filteredSalons)
          }
          setLoading(false)
        }, 500)
      }, 1500) // Delay to ensure map is loaded
    }
  }, [])
  
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
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

  // Initialize OpenStreetMap with Leaflet
  useEffect(() => {
    let mounted = true

    const initializeMap = async () => {
      if (!mapRef.current || leafletMapRef.current) return

      try {
        // Dynamic import of Leaflet to avoid SSR issues
        const L = (await import('leaflet')).default
        
        // Check if component is still mounted
        if (!mounted || !mapRef.current) return

        // Clear any existing map container content
        const mapElement = mapRef.current as any
        if (mapElement._leaflet_id) {
          mapElement._leaflet_id = null
        }
        mapRef.current.innerHTML = ''
        
        // Fix for default markers in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        })

        const defaultCenter = userLocation || { lat: -37.8136, lng: 144.9631 } // Melbourne
        
        // Create new map instance
        leafletMapRef.current = L.map(mapRef.current, {
          center: [defaultCenter.lat, defaultCenter.lng],
          zoom: 13,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        })
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(leafletMapRef.current)

        // Add salon markers
        addSalonMarkers(mockSalons)
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    // Load Leaflet CSS only once
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Initialize map after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeMap, 100)

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!mounted) return
          
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          
          if (leafletMapRef.current) {
            leafletMapRef.current.setView([location.lat, location.lng], 13)
          }
        },
        (error) => {
          console.log('Geolocation error:', error)
        }
      )
    }

    setSalons(mockSalons)

    // Cleanup function
    return () => {
      mounted = false
      clearTimeout(timeoutId)
      
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove()
        } catch (error) {
          console.error('Error removing map:', error)
        } finally {
          leafletMapRef.current = null
        }
      }
      
      // Clear container
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
        const mapElement = mapRef.current as any
        if (mapElement._leaflet_id) {
          mapElement._leaflet_id = null
        }
      }
    }
  }, []) // Empty dependency array to run only once

  const addSalonMarkers = async (salonsData: Salon[]) => {
    if (!leafletMapRef.current || !salonsData.length) return

    try {
      const L = (await import('leaflet')).default

      // Clear existing markers safely
      markersRef.current.forEach(marker => {
        try {
          if (leafletMapRef.current && marker) {
            leafletMapRef.current.removeLayer(marker)
          }
        } catch (error) {
          console.error('Error removing marker:', error)
        }
      })
      markersRef.current = []

      // Create custom nail salon icon
      const nailIcon = L.divIcon({
        html: `
          <div style="
            background-color: #F4C7B8;
            border: 3px solid #fff;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            <div style="
              background-color: #2F2F2F;
              width: 8px;
              height: 8px;
              border-radius: 50%;
            "></div>
          </div>
        `,
        className: 'nail-salon-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      })

      salonsData.forEach(salon => {
        try {
          const marker = L.marker([salon.lat, salon.lng], { icon: nailIcon })
            .addTo(leafletMapRef.current)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${salon.name}</h3>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">📍 ${salon.address}, ${salon.city}</p>
                ${salon.phone ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">📞 ${salon.phone}</p>` : ''}
                ${salon.average_rating ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">⭐ ${salon.average_rating} (${salon.review_count} reviews)</p>` : ''}
                <button 
                  onclick="window.location.href='tel:${salon.phone || ''}'" 
                  style="
                    background: #F4C7B8; 
                    border: none; 
                    padding: 6px 12px; 
                    border-radius: 4px; 
                    cursor: pointer; 
                    margin-right: 8px;
                    font-size: 12px;
                  "
                  ${!salon.phone ? 'disabled' : ''}
                >
                  Call
                </button>
                <button 
                  onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(salon.address + ', ' + salon.city + ', ' + salon.state)}', '_blank')"
                  style="
                    background: #2F2F2F; 
                    color: white; 
                    border: none; 
                    padding: 6px 12px; 
                    border-radius: 4px; 
                    cursor: pointer;
                    font-size: 12px;
                  "
                >
                  Directions
                </button>
              </div>
            `)

          marker.on('click', () => {
            setSelectedSalon(salon)
            setViewMode('list')
          })

          markersRef.current.push(marker)
        } catch (error) {
          console.error('Error adding marker for salon:', salon.name, error)
        }
      })
    } catch (error) {
      console.error('Error adding salon markers:', error)
    }
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
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([salon.lat, salon.lng], 16)
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
      <div className="bg-white border-b border-gray-200 sticky top-16 z-50">
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
      <div className="flex h-[calc(100vh-140px)] relative">
        {/* Map Container */}
        <div className={`${
          viewMode === 'map' 
            ? 'w-full md:w-1/2' 
            : 'hidden md:block md:w-1/2'
        } relative z-10`}>
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Map Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className={`${
          viewMode === 'list' 
            ? 'w-full md:w-1/2' 
            : 'hidden md:block md:w-1/2'
        } bg-white border-l border-gray-200 overflow-hidden transition-all duration-300 z-10`}>
          <div className="h-full overflow-y-auto">
            {salons.length > 0 ? (
              <div className="p-3 space-y-3">
                {salons.map((salon) => (
                  <motion.div
                    key={salon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`cursor-pointer ${
                      selectedSalon?.id === salon.id ? 'ring-2 ring-primary-500 rounded-lg' : ''
                    }`}
                    onClick={() => {
                      // Navigate to vendor page when clicking salon box
                      window.location.href = `/salon/${salon.slug}`
                    }}
                  >
                    {/* Smaller, more compact card layout - Made even smaller */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 hover:shadow-md transition-all duration-200">
                      <div className="flex space-x-2">
                        {/* Smaller salon image */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                            {salon.image ? (
                              <img
                                src={salon.image}
                                alt={salon.name}
                                className="w-full h-full object-cover"
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

                        {/* Compact salon information */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">
                              {salon.name}
                            </h3>
                            {salon.is_verified && (
                              <div className="flex items-center ml-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center text-gray-600 text-xs mb-1">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{salon.city}, {salon.state}</span>
                          </div>

                          {salon.average_rating && (
                            <div className="flex items-center mb-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                              <span className="text-xs text-gray-600">
                                {salon.average_rating.toFixed(1)} ({salon.review_count})
                              </span>
                            </div>
                          )}

                          <div className="text-xs text-primary-600 font-medium">
                            From ${salon.price_from || 25} 
                          </div>
                        </div>
                      </div>

                      {/* Compact action button - Changed from Contact & Directions to Learn More */}
                      <div className="mt-2">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = `/salon/${salon.slug}`
                          }}
                          className="w-full bg-primary-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center justify-center space-x-1"
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Learn More</span>
                        </motion.button>
                      </div>
                    </div>
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