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
  const locationQueryRef = useRef('')  // Track location with ref to avoid closure issues
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null)
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(false)
  const [showSearchThisArea, setShowSearchThisArea] = useState(false)
  const [mapBounds, setMapBounds] = useState<any>(null)
  const [autoSearchEnabled, setAutoSearchEnabled] = useState(false)
  
  // Filter state - ONLY real database columns
  const [filters, setFilters] = useState<{
    services: string[]
    priceRange: string[]
    specialties: string[]
    amenities: string[]
    walkIns: boolean
    parking: boolean
  }>({
    services: [],
    priceRange: [],
    specialties: [],
    amenities: [],
    walkIns: false,
    parking: false
  })
  
  // Handle URL search parameters and auto-search
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const service = urlParams.get('service') || ''
    const location = urlParams.get('location') || ''
    const services = urlParams.get('services')
    const priceRange = urlParams.get('priceRange')
    const specialties = urlParams.get('specialties')
    const walkIns = urlParams.get('walkIns') === 'true'
    const parking = urlParams.get('parking') === 'true'
    
    console.log('URL params:', { location, services, priceRange, specialties, walkIns, parking })
    
    if (service) {
      setServiceQuery(decodeURIComponent(service))
    }
    const locationValue = location ? decodeURIComponent(location) : ''
    if (locationValue) {
      setLocationQuery(locationValue)
      locationQueryRef.current = locationValue
    }
    
    // Build filters object from URL params
    const urlFilters = {
      services: services ? services.split(',') : [],
      priceRange: priceRange ? priceRange.split(',') : [],
      specialties: specialties ? specialties.split(',') : [],
      amenities: [],
      walkIns,
      parking
    }
    
    console.log('Built urlFilters:', urlFilters)
    
    // Set filters from URL params
    if (services || priceRange || specialties || walkIns || parking) {
      setFilters(urlFilters)
    }
    
    // Auto-search if parameters are provided - pass values directly to avoid stale state
    if (service || locationValue || services || priceRange) {
      console.log('Initial URL search with location:', locationValue)
      setTimeout(() => {
        handleSearch(false, locationValue, urlFilters)
      }, 500) // Reduced delay since we're passing values directly
    }
  }, [])
  
  // Auto-search when filters change (but not on initial mount or initial URL param load)
  const [initialLoad, setInitialLoad] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)
  
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false)
      return
    }
    // Only auto-search if user has done at least one search (has location context)
    if (!hasSearched) {
      console.log('No initial search yet, not auto-searching on filter change')
      return
    }
    
    console.log('Filter changed, auto-searching with locationQuery:', locationQuery)
    const timer = setTimeout(() => {
      handleSearch(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [filters])
  
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

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

        // Center on Sydney where most salons are located
        const defaultCenter = { lat: -33.8688, lng: 151.2093 }
        
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

        // Add map movement listeners to show "Search this area" button
        leafletMapRef.current.on('moveend', () => {
          if (leafletMapRef.current) {
            const bounds = leafletMapRef.current.getBounds()
            setMapBounds(bounds)
            
            // Show "Search this area" button when map is moved
            // Only show if there's already been a search (salons exist)
            if (salons.length > 0) {
              setShowSearchThisArea(true)
            }
            
            // If auto-search is enabled, automatically search on map move
            if (autoSearchEnabled) {
              setTimeout(() => {
                handleSearch(true)
              }, 500) // Debounce by 500ms
            }
          }
        })

        // Salon markers will be added after search
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

  // City coordinates map for Australia and USA
  const cityCoordinates: Record<string, {lat: number, lng: number, country: string}> = {
    // Australia
    'Sydney': { lat: -33.8688, lng: 151.2093, country: 'AU' },
    'Melbourne': { lat: -37.8136, lng: 144.9631, country: 'AU' },
    'Brisbane': { lat: -27.4698, lng: 153.0251, country: 'AU' },
    'Perth': { lat: -31.9505, lng: 115.8605, country: 'AU' },
    'Adelaide': { lat: -34.9285, lng: 138.6007, country: 'AU' },
    'Gold Coast': { lat: -28.0167, lng: 153.4000, country: 'AU' },
    'Canberra': { lat: -35.2809, lng: 149.1300, country: 'AU' },
    'Newcastle': { lat: -32.9283, lng: 151.7817, country: 'AU' },
    'Darwin': { lat: -12.4634, lng: 130.8456, country: 'AU' },
    'Hobart': { lat: -42.8821, lng: 147.3272, country: 'AU' },
    // USA
    'New York': { lat: 40.7128, lng: -74.0060, country: 'US' },
    'Los Angeles': { lat: 34.0522, lng: -118.2437, country: 'US' },
    'Chicago': { lat: 41.8781, lng: -87.6298, country: 'US' },
    'Houston': { lat: 29.7604, lng: -95.3698, country: 'US' },
    'Phoenix': { lat: 33.4484, lng: -112.0740, country: 'US' },
    'Philadelphia': { lat: 39.9526, lng: -75.1652, country: 'US' },
    'San Antonio': { lat: 29.4241, lng: -98.4936, country: 'US' },
    'San Diego': { lat: 32.7157, lng: -117.1611, country: 'US' },
    'Dallas': { lat: 32.7767, lng: -96.7970, country: 'US' },
    'San Jose': { lat: 37.3382, lng: -121.8863, country: 'US' },
    'Austin': { lat: 30.2672, lng: -97.7431, country: 'US' },
    'Miami': { lat: 25.7617, lng: -80.1918, country: 'US' },
    'Seattle': { lat: 47.6062, lng: -122.3321, country: 'US' },
    'Boston': { lat: 42.3601, lng: -71.0589, country: 'US' },
    'Las Vegas': { lat: 36.1699, lng: -115.1398, country: 'US' }
  }

  const addSalonMarkers = async (salonsData: Salon[]) => {
    if (!leafletMapRef.current) return

    try {
      const L = (await import('leaflet')).default

      // Clear existing markers safely (ALWAYS, even if no new salons)
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
      
      // If no salons, just clear and return
      if (!salonsData.length) {
        console.log('No salons to show on map, markers cleared')
        return
      }
      
      // Center map on the first salon's city or searched city
      if (salonsData.length > 0) {
        const firstCity = salonsData[0].city
        const cityCoords = cityCoordinates[firstCity]
        if (cityCoords && leafletMapRef.current) {
          leafletMapRef.current.setView([cityCoords.lat, cityCoords.lng], 12)
        }
      }

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

      // Add markers for salons with coordinates, geocode others
      for (const salon of salonsData) {
        try {
          let lat = salon.lat
          let lng = salon.lng
          
          // If no coordinates, try to use city center or geocode address
          if (!lat || !lng || lat === 0 || lng === 0) {
            const cityCoords = cityCoordinates[salon.city]
            if (cityCoords) {
              // Use city center + small random offset to spread markers
              lat = cityCoords.lat + (Math.random() - 0.5) * 0.05
              lng = cityCoords.lng + (Math.random() - 0.5) * 0.05
            } else {
              // Skip if no city coords available
              console.log(`No coordinates for ${salon.name} in ${salon.city}`)
              continue
            }
          }
          
          const marker = L.marker([lat, lng], { icon: nailIcon })
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
      }
    } catch (error) {
      console.error('Error adding salon markers:', error)
    }
  }

  const handleSearch = async (useBounds = false, overrideLocation?: string, overrideFilters?: typeof filters) => {
    // Use ref to get current location value, avoiding stale closure
    const searchLocation = overrideLocation !== undefined ? overrideLocation : (locationQueryRef.current || locationQuery)
    const searchFilters = overrideFilters !== undefined ? overrideFilters : filters
    
    console.log('=== handleSearch called ===')
    console.log('searchLocation:', searchLocation)
    console.log('searchFilters:', searchFilters)
    setLoading(true)
    
    try {
      // Build API query
      const params = new URLSearchParams()
      if (searchLocation) {
        params.append('city', searchLocation)
        console.log('Added city filter:', searchLocation)
      } else {
        console.warn('NO LOCATION QUERY - will return all salons!')
      }
      params.append('limit', '500') // Increased limit to show all results in metro area
      
      // Add filter parameters
      if (searchFilters.priceRange.length > 0) {
        params.append('priceRange', searchFilters.priceRange.join(','))
      }
      if (searchFilters.walkIns) params.append('walkIns', 'true')
      if (searchFilters.parking) params.append('parking', 'true')
      
      // Add service filters as comma-separated
      if (searchFilters.services.length > 0) {
        params.append('services', searchFilters.services.join(','))
      }
      
      // Add specialty filters
      if (searchFilters.specialties.length > 0) {
        params.append('specialties', searchFilters.specialties.join(','))
      }
      
      // Add amenity filters
      if (searchFilters.amenities.length > 0) {
        params.append('amenities', searchFilters.amenities.join(','))
      }
      
      // Add bounding box if searching by map area
      if (useBounds && mapBounds && leafletMapRef.current) {
        const bounds = leafletMapRef.current.getBounds()
        const boundsObj = {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        }
        params.append('bounds', JSON.stringify(boundsObj))
      }
      
      const apiUrl = `/api/salons?${params.toString()}`
      console.log('API URL:', apiUrl)
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      console.log('API returned', data.salons?.length, 'salons')
      if (data.salons && data.salons.length > 0) {
        console.log('First salon city:', data.salons[0].city)
        console.log('Last salon city:', data.salons[data.salons.length - 1].city)
      }
      
      if (data.success && data.salons) {
        const transformedSalons = data.salons.map((salon: any) => ({
          id: salon.id.toString(),
          name: salon.name,
          slug: salon.slug,
          address: salon.address,
          city: salon.city,
          state: salon.state,  // NO FAKE DATA
          phone: salon.phone,
          price_from: salon.price_from,  // NO FAKE DATA
          currency: salon.currency,  // NO FAKE DATA
          specialties: salon.specialties || salon.services_offered || [],
          is_verified: salon.is_verified,
          average_rating: salon.average_rating || salon.rating,
          review_count: salon.review_count,  // NO FAKE DATA
          lat: salon.latitude || 0,  // 0 if no coords
          lng: salon.longitude || 0,  // 0 if no coords
          hours: salon.opening_hours?.monday || null,  // Real hours
          image: salon.cover_image_url,
          price_range: salon.price_range,
          appointment_only: salon.appointment_only,
          accepts_walk_ins: salon.accepts_walk_ins
        }))
        
        // Filter by service if provided
        const filtered = serviceQuery
          ? transformedSalons.filter((salon: Salon) =>
              salon.name.toLowerCase().includes(serviceQuery.toLowerCase()) ||
              salon.specialties?.some(spec => spec.toLowerCase().includes(serviceQuery.toLowerCase()))
            )
          : transformedSalons
        
        setSalons(filtered)
        addSalonMarkers(filtered)
        setShowSearchThisArea(false) // Hide button after search
        setHasSearched(true) // Mark that we've done at least one search
      } else {
        setSalons([])
      }
    } catch (error) {
      console.error('Error searching salons:', error)
      setSalons([])
    } finally {
      setLoading(false)
    }
  }
  
  // Search by current map area
  const handleSearchThisArea = () => {
    handleSearch(true)
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
                onChange={(e) => {
                  setLocationQuery(e.target.value)
                  locationQueryRef.current = e.target.value
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {/* Location tracking removed */}
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
                className={`flex items-center space-x-2 px-3 py-1 text-sm border rounded-lg ${
                  isFilterOpen 
                    ? 'bg-primary-500 text-white border-primary-500' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-4 h-4" />
                <span>{t('common.filter')}</span>
                {(filters.services.length + filters.priceRange.length + filters.specialties.length + filters.amenities.length + 
                  (filters.verified ? 1 : 0) + (filters.walkIns ? 1 : 0) + (filters.parking ? 1 : 0)) > 0 && (
                  <span className="ml-1 bg-white text-primary-600 rounded-full px-2 py-0.5 text-xs font-bold">
                    {filters.services.length + filters.priceRange.length + filters.specialties.length + filters.amenities.length + 
                     (filters.verified ? 1 : 0) + (filters.walkIns ? 1 : 0) + (filters.parking ? 1 : 0)}
                  </span>
                )}
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

          {/* Filter Panel */}
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 bg-gray-50 rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto"
            >
              {/* Services - ONLY database columns */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Nail Services</h3>
                <div className="flex flex-wrap gap-2">
                  {['Manicure', 'Pedicure', 'Gel Nails', 'Acrylic Nails', 'Nail Art', 'Nail Extensions', 'Dip Powder', 'Nail Repair'].map(service => (
                    <button
                      key={service}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          services: prev.services.includes(service)
                            ? prev.services.filter(s => s !== service)
                            : [...prev.services, service]
                        }))
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.services.includes(service)
                          ? 'bg-primary-500 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Price Range</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'budget', label: 'Budget ($)' },
                    { value: 'mid-range', label: 'Mid-range ($$)' },
                    { value: 'luxury', label: 'Luxury ($$$)' }
                  ].map(range => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          priceRange: prev.priceRange.includes(range.value)
                            ? prev.priceRange.filter(p => p !== range.value)
                            : [...prev.priceRange, range.value]
                        }))
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.priceRange.includes(range.value)
                          ? 'bg-primary-500 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialties - ONLY database columns */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {['Master Artist', 'Certified Technicians', 'Experienced Staff', 'Quick Service'].map(specialty => (
                    <button
                      key={specialty}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          specialties: prev.specialties.includes(specialty)
                            ? prev.specialties.filter(s => s !== specialty)
                            : [...prev.specialties, specialty]
                        }))
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.specialties.includes(specialty)
                          ? 'bg-accent-500 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities - ONLY database columns */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'Kid Friendly', key: 'amenities' },
                    { value: 'Wheelchair Accessible', key: 'amenities' },
                    { value: 'Walk-ins Welcome', key: 'walkIns' },
                    { value: 'Parking', key: 'parking' }
                  ].map(item => {
                    const isSelected = item.key === 'amenities' 
                      ? filters.amenities.includes(item.value)
                      : filters[item.key as keyof typeof filters] === true
                    
                    return (
                      <button
                        key={item.value}
                        onClick={() => {
                          if (item.key === 'amenities') {
                            setFilters(prev => ({
                              ...prev,
                              amenities: prev.amenities.includes(item.value)
                                ? prev.amenities.filter(a => a !== item.value)
                                : [...prev.amenities, item.value]
                            }))
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              [item.key]: !prev[item.key as keyof typeof prev]
                            }))
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isSelected
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                      >
                        {item.value}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setFilters({
                      services: [],
                      priceRange: [],
                      specialties: [],
                      amenities: [],
                      walkIns: false,
                      parking: false
                    })
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 px-4 py-2 text-white bg-primary-500 rounded-lg hover:bg-primary-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
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
          
          {/* Search This Area Button */}
          {showSearchThisArea && !loading && (
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30"
            >
              <motion.button
                onClick={handleSearchThisArea}
                className="bg-white shadow-lg rounded-full px-6 py-3 flex items-center space-x-2 border border-gray-200 hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-4 h-4 text-primary-600" />
                <span className="font-medium text-gray-900">Search this area</span>
              </motion.button>
            </motion.div>
          )}
          
          {/* Auto-Search Toggle */}
          <div className="absolute top-4 right-4 z-30">
            <motion.button
              onClick={() => {
                const newValue = !autoSearchEnabled
                setAutoSearchEnabled(newValue)
                if (newValue) {
                  // Immediately search when enabled
                  handleSearch(true)
                }
              }}
              className={`${
                autoSearchEnabled 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200'
              } shadow-md rounded-lg px-4 py-2 text-sm font-medium transition-colors`}
              whileTap={{ scale: 0.95 }}
              title={autoSearchEnabled ? 'Auto-search enabled' : 'Enable auto-search on map move'}
            >
              {autoSearchEnabled ? '✓ Auto-search' : 'Auto-search'}
            </motion.button>
          </div>
          
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

                          {salon.price_range && (
                            <div className="text-sm text-primary-600 font-bold">
                              {salon.price_range === 'budget' ? '$' : salon.price_range === 'mid-range' ? '$$' : '$$$'}
                            </div>
                          )}
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