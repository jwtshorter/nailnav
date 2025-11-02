'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, CheckCircle, ArrowRight, Plus, Building } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ExistingListing {
  id: string
  business_name: string
  address: string
  city: string
  state: string
  postal_code: string
  is_claimed: boolean
}

export default function VendorClaimPage() {
  const [userAddress, setUserAddress] = useState('')
  const [suggestions, setSuggestions] = useState<ExistingListing[]>([])
  const [allListings, setAllListings] = useState<ExistingListing[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const [claimingSalon, setClaimingSalon] = useState<any>(null)

  useEffect(() => {
    loadAllListings()
    
    // Check if user came from a specific salon page
    const storedSalon = localStorage.getItem('claimingSalon')
    if (storedSalon) {
      try {
        const salonInfo = JSON.parse(storedSalon)
        setClaimingSalon(salonInfo)
        setUserAddress(`${salonInfo.name}, ${salonInfo.address}, ${salonInfo.city}, ${salonInfo.state}`)
      } catch (error) {
        console.error('Error parsing stored salon info:', error)
      }
    }
  }, [])

  const loadAllListings = async () => {
    try {
      const { data, error } = await supabase
        .from('existing_listings')
        .select('*')
        .eq('is_claimed', false)
        .order('city', { ascending: true })

      if (!error && data) {
        setAllListings(data)
      }
    } catch (err) {
      console.error('Error loading listings:', err)
    }
  }

  const searchListings = async () => {
    if (!userAddress.trim()) return

    setLoading(true)
    try {
      // Simple address matching
      const searchTerms = userAddress.toLowerCase()
      const filtered = allListings.filter(listing => 
        listing.address.toLowerCase().includes(searchTerms) ||
        listing.city.toLowerCase().includes(searchTerms) ||
        listing.postal_code?.toLowerCase().includes(searchTerms) ||
        listing.name.toLowerCase().includes(searchTerms)
      )
      
      // Put exact matches first
      const exactMatches = filtered.filter(listing =>
        listing.address.toLowerCase().includes(searchTerms.split(',')[0]?.trim() || '')
      )
      const otherMatches = filtered.filter(listing =>
        !listing.address.toLowerCase().includes(searchTerms.split(',')[0]?.trim() || '')
      )

      setSuggestions([...exactMatches, ...otherMatches])
    } catch (err) {
      console.error('Error searching listings:', err)
    } finally {
      setLoading(false)
    }
  }

  const claimListing = async (listingId: number) => {
    try {
      // Create a claim request for admin approval
      setSelectedListing(listingId.toString())
      alert('Claim request submitted! You will be redirected to complete your business details.')
      
      // Redirect to vendor dashboard with claimed listing info
      window.location.href = `/vendor/dashboard?claimed=${listingId}`
    } catch (err) {
      console.error('Error claiming listing:', err)
      alert('Error submitting claim. Please try again.')
    }
  }

  const skipToDashboard = () => {
    // Go directly to creating new listing
    window.location.href = '/vendor/dashboard?mode=create'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Claim Your Business Listing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Is your nail salon already listed? Search for it below and claim it, 
              or skip this step to create a completely new listing.
            </p>
          </motion.div>

          {/* Direct Claim Section (when coming from salon page) */}
          {claimingSalon && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Claim "{claimingSalon.name}"
              </h2>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">{claimingSalon.name}</h3>
                <p className="text-sm text-gray-600">
                  {claimingSalon.address}, {claimingSalon.city}, {claimingSalon.state}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Store claim info and redirect to vendor registration
                    localStorage.setItem('claimingSpecificSalon', JSON.stringify(claimingSalon))
                    localStorage.removeItem('claimingSalon') // Clean up
                    window.location.href = '/vendor/register?claiming=true'
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Yes, This is My Business</span>
                </button>
                
                <button
                  onClick={() => {
                    localStorage.removeItem('claimingSalon')
                    setClaimingSalon(null)
                    setUserAddress('')
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600"
                >
                  Search for Different Business
                </button>
              </div>
            </motion.div>
          )}

          {/* Search Section */}
          {!claimingSalon && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-8"
            >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Search for Your Business
            </h2>
            
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchListings()}
                  placeholder="Enter your business address or name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button
                onClick={searchListings}
                disabled={loading || !userAddress.trim()}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>

            {/* Search Results */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">
                  Found {suggestions.length} potential match{suggestions.length !== 1 ? 'es' : ''}:
                </h3>
                {suggestions.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{listing.business_name}</h4>
                      <p className="text-sm text-gray-600">
                        {listing.address}, {listing.city}, {listing.state} {listing.postal_code}
                      </p>
                    </div>
                    <button
                      onClick={() => claimListing(listing.id)}
                      disabled={selectedListing === listing.id}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{selectedListing === listing.id ? 'Claiming...' : 'Claim This'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {suggestions.length === 0 && userAddress && !loading && (
              <div className="text-center py-6 text-gray-500">
                No matching listings found. You can create a new listing instead.
              </div>
            )}
          </motion.div>
          )}

          {/* Browse All Listings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Browse All Available Listings
            </h2>
            
            {allListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {allListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{listing.business_name}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {listing.city}, {listing.state}
                    </p>
                    <button
                      onClick={() => claimListing(listing.id)}
                      className="w-full px-3 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 text-sm flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Claim</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Loading available listings...</p>
            )}
          </motion.div>

          {/* Skip Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Don't see your business?
              </h3>
              <p className="text-gray-600 mb-4">
                No problem! You can create a completely new listing for your nail salon.
              </p>
              <button
                onClick={skipToDashboard}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Listing</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}