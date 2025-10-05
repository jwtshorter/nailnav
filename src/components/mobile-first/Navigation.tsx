'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Globe, 
  LogIn, 
  Store, 
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  Phone
} from 'lucide-react'
import { useTranslation } from '../../contexts/TranslationContext'

interface NavigationProps {
  // No longer needed as we get language from context
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
]

const Navigation = (props: NavigationProps) => {
  const { language, setLanguage, t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false)

  const currentLang = languages.find(lang => lang.code === language) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as 'en' | 'es' | 'vi')
    setIsLanguageDropdownOpen(false)
    setIsMenuOpen(false)
  }

  const handleVendorLogin = () => {
    // Navigate to vendor login page
    window.location.href = '/vendor/login'
    setIsVendorDropdownOpen(false)
    setIsMenuOpen(false)
  }

  const handleVendorRegister = () => {
    // Navigate to vendor registration page
    window.location.href = '/vendor/register'
    setIsVendorDropdownOpen(false)
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.a 
              href="/"
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img 
                src="https://page.gensparksite.com/v1/base64_upload/1f1454bd566330cbbeffb5137b348d57"
                alt="NailNav Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling!.textContent = 'Nail Nav'
                }}
              />
              <span className="text-xl font-bold text-gray-900 hidden">Nail Nav</span>
            </motion.a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-6">
              <a href="/search" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                {t('nav.search')}
              </a>
              <a href="/blog" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                {t('nav.blog')}
              </a>
              <a href="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                {t('nav.about')}
              </a>
              <a href="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                {t('nav.contact')}
              </a>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <motion.button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{currentLang.flag} {t('nav.language')}</span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>

              <AnimatePresence>
                {isLanguageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                          lang.code === language ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vendor Portal */}
            <div className="relative">
              <motion.button
                onClick={() => setIsVendorDropdownOpen(!isVendorDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Store className="w-4 h-4" />
                <span>{t('nav.vendorPortal')}</span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>

              <AnimatePresence>
                {isVendorDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <button
                      onClick={handleVendorLogin}
                      className="w-full text-left px-4 py-3 text-sm flex items-center space-x-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <LogIn className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Vendor Login</div>
                        <div className="text-xs text-gray-500">Access your dashboard</div>
                      </div>
                    </button>
                    <button
                      onClick={handleVendorRegister}
                      className="w-full text-left px-4 py-3 text-sm flex items-center space-x-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Store className="w-4 h-4" />
                      <div>
                        <div className="font-medium">List Your Salon</div>
                        <div className="text-xs text-gray-500">Join our platform</div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  <a 
                    href="/search"
                    className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    {t('nav.search')}
                  </a>
                  <a 
                    href="/blog"
                    className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    {t('nav.blog')}
                  </a>
                  <a 
                    href="/about"
                    className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    {t('nav.about')}
                  </a>
                  <a 
                    href="/contact"
                    className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    {t('nav.contact')}
                  </a>
                </div>

                {/* Mobile Language Selector */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t('nav.language')}
                  </div>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 rounded-lg transition-colors ${
                          lang.code === language 
                            ? 'text-primary-600 bg-primary-50' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Vendor Section */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    For Business Owners
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleVendorLogin}
                      className="w-full text-left px-4 py-3 flex items-center space-x-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <LogIn className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Vendor Login</div>
                        <div className="text-xs text-gray-500">Access your dashboard</div>
                      </div>
                    </button>
                    <button
                      onClick={handleVendorRegister}
                      className="w-full text-left px-4 py-3 flex items-center space-x-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Store className="w-5 h-5" />
                      <div>
                        <div className="font-medium">List Your Salon</div>
                        <div className="text-xs text-gray-500">Join our platform</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Mobile Contact Info */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Support
                  </div>
                  <div className="space-y-2">
                    <a
                      href="/help"
                      className="w-full text-left px-4 py-2 flex items-center space-x-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <HelpCircle className="w-5 h-5" />
                      <span>Help Center</span>
                    </a>
                    <a
                      href="tel:+1-555-NAILNAV"
                      className="w-full text-left px-4 py-2 flex items-center space-x-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call Support</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay for dropdowns */}
      {(isLanguageDropdownOpen || isVendorDropdownOpen || isMenuOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          onClick={() => {
            setIsLanguageDropdownOpen(false)
            setIsVendorDropdownOpen(false)
            setIsMenuOpen(false)
          }}
        />
      )}
    </nav>
  )
}

export default Navigation