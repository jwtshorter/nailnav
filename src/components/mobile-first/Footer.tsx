'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '../../contexts/TranslationContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Footer = () => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [region, setRegion] = useState<'australia' | 'usa' | 'both'>('both')

  useEffect(() => {
    // Detect if we're on an Australian or USA page
    const australianStates = ['nsw', 'vic', 'qld', 'wa', 'sa', 'tas', 'act', 'nt']
    
    if (pathname?.includes('/nail-salons/')) {
      const pathParts = pathname.split('/')
      const stateCode = pathParts[2]?.toLowerCase()
      
      if (australianStates.includes(stateCode)) {
        setRegion('australia')
      } else {
        setRegion('usa')
      }
    } else {
      setRegion('both')
    }
  }, [pathname])

  // Australian states
  const australianStates = [
    { name: 'New South Wales', code: 'nsw' },
    { name: 'Victoria', code: 'vic' },
    { name: 'Queensland', code: 'qld' },
    { name: 'Western Australia', code: 'wa' },
    { name: 'South Australia', code: 'sa' },
    { name: 'Tasmania', code: 'tas' },
    { name: 'Australian Capital Territory', code: 'act' },
    { name: 'Northern Territory', code: 'nt' }
  ]

  // All US states
  const usStates = [
    { name: 'Alabama', code: 'al' },
    { name: 'Alaska', code: 'ak' },
    { name: 'Arizona', code: 'az' },
    { name: 'Arkansas', code: 'ar' },
    { name: 'California', code: 'ca' },
    { name: 'Colorado', code: 'co' },
    { name: 'Connecticut', code: 'ct' },
    { name: 'Delaware', code: 'de' },
    { name: 'Florida', code: 'fl' },
    { name: 'Georgia', code: 'ga' },
    { name: 'Hawaii', code: 'hi' },
    { name: 'Idaho', code: 'id' },
    { name: 'Illinois', code: 'il' },
    { name: 'Indiana', code: 'in' },
    { name: 'Iowa', code: 'ia' },
    { name: 'Kansas', code: 'ks' },
    { name: 'Kentucky', code: 'ky' },
    { name: 'Louisiana', code: 'la' },
    { name: 'Maine', code: 'me' },
    { name: 'Maryland', code: 'md' },
    { name: 'Massachusetts', code: 'ma' },
    { name: 'Michigan', code: 'mi' },
    { name: 'Minnesota', code: 'mn' },
    { name: 'Mississippi', code: 'ms' },
    { name: 'Missouri', code: 'mo' },
    { name: 'Montana', code: 'mt' },
    { name: 'Nebraska', code: 'ne' },
    { name: 'Nevada', code: 'nv' },
    { name: 'New Hampshire', code: 'nh' },
    { name: 'New Jersey', code: 'nj' },
    { name: 'New Mexico', code: 'nm' },
    { name: 'New York', code: 'ny' },
    { name: 'North Carolina', code: 'nc' },
    { name: 'North Dakota', code: 'nd' },
    { name: 'Ohio', code: 'oh' },
    { name: 'Oklahoma', code: 'ok' },
    { name: 'Oregon', code: 'or' },
    { name: 'Pennsylvania', code: 'pa' },
    { name: 'Rhode Island', code: 'ri' },
    { name: 'South Carolina', code: 'sc' },
    { name: 'South Dakota', code: 'sd' },
    { name: 'Tennessee', code: 'tn' },
    { name: 'Texas', code: 'tx' },
    { name: 'Utah', code: 'ut' },
    { name: 'Vermont', code: 'vt' },
    { name: 'Virginia', code: 'va' },
    { name: 'Washington', code: 'wa' },
    { name: 'West Virginia', code: 'wv' },
    { name: 'Wisconsin', code: 'wi' },
    { name: 'Wyoming', code: 'wy' }
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Browse by State Section - Region-Aware */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          {/* Show only Australian states on Australian pages */}
          {region === 'australia' && (
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                Browse Australian Nail Salons by State
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center">
                {australianStates.map((state) => (
                  <Link
                    key={state.code}
                    href={`/nail-salons/${state.code}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline text-sm text-center"
                  >
                    {state.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Show only US states on US pages */}
          {region === 'usa' && (
            <div className="max-w-7xl mx-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                Browse US Nail Salons by State
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
                {usStates.map((state) => (
                  <Link
                    key={state.code}
                    href={`/nail-salons/${state.code}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline text-sm text-center"
                  >
                    {state.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Show both on homepage and other pages */}
          {region === 'both' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {/* Australian States */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  Browse Australian Nail Salons by State
                </h3>
                <div className="grid grid-cols-2 gap-3 justify-items-center">
                  {australianStates.map((state) => (
                    <Link
                      key={state.code}
                      href={`/nail-salons/${state.code}`}
                      className="text-primary-600 hover:text-primary-700 hover:underline text-sm text-center"
                    >
                      {state.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* US States */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  Browse US Nail Salons by State
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 justify-items-center">
                  {usStates.map((state) => (
                    <Link
                      key={state.code}
                      href={`/nail-salons/${state.code}`}
                      className="text-primary-600 hover:text-primary-700 hover:underline text-sm text-center"
                    >
                      {state.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Links */}
      <div className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600"
        >
          {/* Left side - Copyright */}
          <div className="flex items-center mb-2 md:mb-0">
            <span>© 2025 Nail Nav. All rights reserved.</span>
          </div>
          
          {/* Right side - Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="/badge-generator" 
              className="hover:text-primary-600 transition-colors font-medium"
            >
              Claim 1 Month Free
            </a>
            <a 
              href="/privacy" 
              className="hover:text-primary-600 transition-colors"
            >
              Privacy
            </a>
            <a 
              href="/terms" 
              className="hover:text-primary-600 transition-colors"
            >
              Terms
            </a>
            <a 
              href="/contact" 
              className="hover:text-primary-600 transition-colors"
            >
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer