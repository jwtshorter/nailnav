'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Copy, Check, Mail, Shield, TrendingUp, Gift } from 'lucide-react'
import NavigationComponent from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import Image from 'next/image'

interface City {
  id: number
  name: string
  state_id: number
  state: string
  slug: string
}

export default function BadgeGeneratorPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [copied, setCopied] = useState(false)
  const [badgeType, setBadgeType] = useState<'image' | 'text'>('image')

  const BADGE_IMAGE_URL = 'https://page.gensparksite.com/v1/base64_upload/4d7ddfb1a87e47233aa92e372e910589'

  useEffect(() => {
    if (searchQuery.length >= 2) {
      fetchCities(searchQuery)
    } else {
      setCities([])
    }
  }, [searchQuery])

  const fetchCities = async (query: string) => {
    try {
      const response = await fetch(`/api/cities?search=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setCities(data.cities || [])
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const generateBadgeCode = () => {
    if (!selectedCity) return ''

    const cityUrl = `${window.location.origin}/search?city=${encodeURIComponent(selectedCity.name)}`

    if (badgeType === 'image') {
      return `<a href="${cityUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${BADGE_IMAGE_URL}" alt="Find nail salons in ${selectedCity.name}, ${selectedCity.state} on NailNav" style="max-width: 200px; height: auto;" />
</a>`
    } else {
      return `<a href="${cityUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: #6B46C1; font-weight: 600;">
  Find us on NailNav - ${selectedCity.name}, ${selectedCity.state}
</a>`
    }
  }

  const copyToClipboard = async () => {
    const code = generateBadgeCode()
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationComponent />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Free Badge Generator
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-6">
              Get 1 month FREE featured listing when you add our badge to your website!
            </p>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <Gift className="w-5 h-5" />
              <span className="font-semibold">Featured listing worth $29 - absolutely free!</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Steps Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create Your Account</h3>
                  <p className="text-gray-600">Sign up for a free NailNav account.</p>
                  <a href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center mt-2">
                    Sign Up Here →
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add or Claim Your Listing</h3>
                  <p className="text-gray-600">Make sure your nail salon is listed on NailNav.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Generate & Add Badge to Your Website</h3>
                  <p className="text-gray-600">Use the generator below to create your custom badge.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Login & Upgrade to Featured</h3>
                  <p className="text-gray-600">Access your dashboard to upgrade your listing.</p>
                  <a href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center mt-2">
                    Login to Dashboard →
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Choose 1 Month Option & Enter Code</h3>
                  <p className="text-gray-600 mb-2">Select the 1-month featured option and apply your discount code.</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> Email us at <a href="mailto:contact@nailnav.com" className="underline">contact@nailnav.com</a> with your website URL after adding the badge. We'll send your discount code within 24 hours!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Badge Generator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Your Badge</h2>
            
            {/* City Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Salon Location
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Start typing to search for your city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Just type your city and state, and we'll automatically generate the badge that links to your local directory page!
              </p>

              {/* City Results Dropdown */}
              {cities.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city)
                        setSearchQuery(`${city.name}, ${city.state}`)
                        setCities([])
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-900">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.state}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Badge Type Selection */}
            {selectedCity && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Badge Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setBadgeType('image')}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        badgeType === 'image'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-2">Option A: Image Badge</div>
                      <div className="text-sm text-gray-600 mb-3">Professional branded badge with logo</div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <Image
                          src={BADGE_IMAGE_URL}
                          alt="NailNav Partner Badge"
                          width={200}
                          height={200}
                          className="mx-auto"
                        />
                      </div>
                    </button>

                    <button
                      onClick={() => setBadgeType('text')}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        badgeType === 'text'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-2">Option B: Text Link (Recommended)</div>
                      <div className="text-sm text-gray-600 mb-3">Simple text link - easiest to add!</div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">
                          Find us on NailNav - {selectedCity.name}, {selectedCity.state}
                        </a>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Generated Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Generated Badge Code
                  </label>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{generateBadgeCode()}</code>
                    </pre>
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Copy this code and paste it into your website's footer or sidebar.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg shadow-lg p-8 mb-12"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 text-primary-700 mb-4">
                <Gift className="w-6 h-6" />
                <h2 className="text-2xl font-bold">See How It Works</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-3">Step 1: Add Badge to Your Site</h3>
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-4xl mb-2">👇</div>
                  <div className="text-sm text-gray-600 mb-4">Badge on your website footer</div>
                  <Image
                    src={BADGE_IMAGE_URL}
                    alt="Badge Preview"
                    width={150}
                    height={150}
                    className="mx-auto"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-3">Step 2: Customer Finds Your Salon</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <div className="text-2xl">✅</div>
                    <p>Customers see you're on a trusted directory</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="text-2xl">👆</div>
                    <p>They click the badge</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="text-2xl">🔍</div>
                    <p>Find your salon details</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="text-2xl">📞</div>
                    <p>And call you to book!</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Add the Badge?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Build Trust</h3>
                <p className="text-gray-600">Show customers you're verified on a trusted directory</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <TrendingUp className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Get More Visibility</h3>
                <p className="text-gray-600">Increase your online presence and reach more customers</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Gift className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">1 Month FREE</h3>
                <p className="text-gray-600">Get a free featured listing worth $29</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do I need to keep the badge/link forever?
                </h3>
                <p className="text-gray-600">
                  The badge must remain on your website indefinitely to maintain your listing. During your free featured month, the badge must be visible to claim your promotion.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  I'm not tech-savvy. Which option should I choose?
                </h3>
                <p className="text-gray-600">
                  Choose Option B (the text link)! It's the easiest to add and works on any website platform. Just paste the code into your website editor.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I customize the badge or link?
                </h3>
                <p className="text-gray-600">
                  The badge should be used as-is to ensure it displays correctly. However, you can place it wherever you'd like on your website (footer is recommended).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How long to get my free month?
                </h3>
                <p className="text-gray-600">
                  We typically verify and send coupon codes within 24 hours on business days. Check your spam folder if you don't see our email!
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
