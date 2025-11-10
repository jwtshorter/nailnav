'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ChevronRight } from 'lucide-react'
import NavigationComponent from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import Link from 'next/link'

interface City {
  id: number
  name: string
  state: string
  salon_count?: number
}

interface StatePageProps {
  params: {
    state: string
  }
}

// State name mapping
const STATE_NAMES: { [key: string]: string } = {
  // Australian states
  'nsw': 'New South Wales',
  'vic': 'Victoria',
  'qld': 'Queensland',
  'wa': 'Western Australia',
  'sa': 'South Australia',
  'tas': 'Tasmania',
  'act': 'Australian Capital Territory',
  'nt': 'Northern Territory',
  // US states (add as needed)
  'ca': 'California',
  'ny': 'New York',
  'tx': 'Texas',
  'fl': 'Florida',
  'il': 'Illinois',
  'pa': 'Pennsylvania',
  'oh': 'Ohio',
  'ga': 'Georgia',
  'nc': 'North Carolina',
  'mi': 'Michigan',
  'nj': 'New Jersey',
  'va': 'Virginia',
  'wa': 'Washington',
  'az': 'Arizona',
  'ma': 'Massachusetts',
  'tn': 'Tennessee',
  'in': 'Indiana',
  'mo': 'Missouri',
  'md': 'Maryland',
  'wi': 'Wisconsin',
  'co': 'Colorado',
  'mn': 'Minnesota',
  'sc': 'South Carolina',
  'al': 'Alabama',
  'la': 'Louisiana',
  'ky': 'Kentucky',
  'or': 'Oregon',
  'ok': 'Oklahoma',
  'ct': 'Connecticut',
  'ut': 'Utah',
  'ia': 'Iowa',
  'nv': 'Nevada',
  'ar': 'Arkansas',
  'ms': 'Mississippi',
  'ks': 'Kansas',
  'nm': 'New Mexico',
  'ne': 'Nebraska',
  'wv': 'West Virginia',
  'id': 'Idaho',
  'hi': 'Hawaii',
  'nh': 'New Hampshire',
  'me': 'Maine',
  'mt': 'Montana',
  'ri': 'Rhode Island',
  'de': 'Delaware',
  'sd': 'South Dakota',
  'nd': 'North Dakota',
  'ak': 'Alaska',
  'vt': 'Vermont',
  'wy': 'Wyoming'
}

export default function StatePage({ params }: StatePageProps) {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [stateCode, setStateCode] = useState('')
  const [stateName, setStateName] = useState('')

  useEffect(() => {
    loadStateData()
  }, [params.state])

  const loadStateData = async () => {
    setLoading(true)
    
    try {
      const formattedState = params.state.toUpperCase()
      const fullStateName = STATE_NAMES[params.state.toLowerCase()] || formattedState
      
      setStateCode(formattedState)
      setStateName(fullStateName)

      // Fetch cities for this state
      const response = await fetch(`/api/cities?state=${formattedState}&limit=100`)
      
      if (response.ok) {
        const data = await response.json()
        // Convert city names to slugs for URLs
        const citiesWithSlugs = (data.cities || []).map((city: any) => ({
          ...city,
          slug: city.name.toLowerCase().replace(/\s+/g, '-')
        }))
        
        // Sort cities alphabetically
        citiesWithSlugs.sort((a: any, b: any) => a.name.localeCompare(b.name))
        
        setCities(citiesWithSlugs)
      }
    } catch (error) {
      console.error('Error loading state data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationComponent />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {stateName} Nail Salons
            </h1>
            <p className="text-xl text-primary-100 mb-2">
              Explore nail salons across {stateName}
            </p>
            <p className="text-primary-200">
              {cities.length} {cities.length !== 1 ? 'cities' : 'city'} with nail salon listings
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-8 mb-12"
        >
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-6 h-6 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Find Nail Salons in {stateName}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Looking for the perfect nail salon in {stateName}? Browse our comprehensive directory 
            of nail salons across all major cities in {stateName}. From manicures and pedicures 
            to gel extensions, SNS dip powder, and custom nail art, find top-rated salons near you.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Each listing includes customer reviews, pricing information, services offered, and 
            contact details to help you make the best choice for your nail care needs.
          </p>
        </motion.div>

        {/* Cities Grid */}
        {cities.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Browse by City
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cities.map((city: any, index: number) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    href={`/nail-salons/${params.state}/${city.slug}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary-600 group-hover:text-primary-700" />
                      <span className="text-gray-900 font-medium group-hover:text-primary-700">
                        {city.name}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No cities found for {stateName}. Check back soon as we're always adding new listings!
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-8 mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            About Nail Salons in {stateName}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What services are available at nail salons in {stateName}?
              </h3>
              <p className="text-gray-600">
                Nail salons across {stateName} offer a wide range of services including classic manicures 
                and pedicures, gel polish, gel extensions, SNS dip powder, BIAB (Builder in a Bottle), 
                acrylic nails, nail art, and spa treatments. Many salons also provide additional beauty 
                services like waxing and facials.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How do I find the best nail salon near me in {stateName}?
              </h3>
              <p className="text-gray-600">
                Use NailNav to browse nail salons by city, read customer reviews, check ratings, and 
                compare services and prices. Look for verified salons with high ratings and positive 
                feedback. You can also filter by specific services you need.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What's the average cost of nail services in {stateName}?
              </h3>
              <p className="text-gray-600">
                Prices vary by city and salon type. Basic manicures typically range from $25-$40, 
                gel manicures from $40-$70, and specialized services like gel extensions or detailed 
                nail art may cost $70-$120+. Check individual salon listings for specific pricing.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
