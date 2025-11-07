'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '../../contexts/TranslationContext'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-white border-t border-gray-200">
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