'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '../../contexts/TranslationContext'
import Link from 'next/link'

const Footer = () => {
  const { t } = useTranslation()

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

  // Major US states (add more as needed)
  const usStates = [
    { name: 'California', code: 'ca' },
    { name: 'New York', code: 'ny' },
    { name: 'Texas', code: 'tx' },
    { name: 'Florida', code: 'fl' },
    { name: 'Illinois', code: 'il' },
    { name: 'Pennsylvania', code: 'pa' },
    { name: 'Ohio', code: 'oh' },
    { name: 'Georgia', code: 'ga' },
    { name: 'North Carolina', code: 'nc' },
    { name: 'Michigan', code: 'mi' },
    { name: 'New Jersey', code: 'nj' },
    { name: 'Virginia', code: 'va' },
    { name: 'Washington', code: 'wa' },
    { name: 'Arizona', code: 'az' },
    { name: 'Massachusetts', code: 'ma' },
    { name: 'Tennessee', code: 'tn' }
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Browse by State Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Australian States */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Browse Australian Nail Salons by State
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {australianStates.map((state) => (
                  <Link
                    key={state.code}
                    href={`/nail-salons/${state.code}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline text-sm"
                  >
                    {state.name} Nail Salons
                  </Link>
                ))}
              </div>
            </div>

            {/* US States */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Browse US Nail Salons by State
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {usStates.map((state) => (
                  <Link
                    key={state.code}
                    href={`/nail-salons/${state.code}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline text-sm"
                  >
                    {state.name} Nail Salons
                  </Link>
                ))}
              </div>
            </div>
          </div>
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