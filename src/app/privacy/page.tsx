'use client'

import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { motion } from 'framer-motion'
import { Shield, Eye, Lock, Users, Database, Mail } from 'lucide-react'

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: [
        'Personal information you provide when creating an account (name, email, phone number)',
        'Location data when you use our location-based search features',
        'Usage data about how you interact with our platform',
        'Device information including IP address, browser type, and operating system',
        'Communications between you and nail salons through our platform'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Users,
      content: [
        'To provide and improve our nail salon discovery services',
        'To connect you with nail salons and facilitate bookings',
        'To send you relevant notifications about appointments and services',
        'To personalize your experience and show you relevant content',
        'To communicate with you about our services and updates'
      ]
    },
    {
      title: 'Information Sharing',
      icon: Eye,
      content: [
        'We share your contact information with salons only when you make a booking',
        'We may share aggregated, non-personal data for business analytics',
        'We do not sell your personal information to third parties',
        'We may disclose information if required by law or to protect our rights',
        'Service providers may access data to help us operate our platform'
      ]
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: [
        'We use industry-standard encryption to protect your data',
        'Regular security audits and monitoring of our systems',
        'Secure data centers with 24/7 monitoring and access controls',
        'Employee training on data privacy and security best practices',
        'Incident response procedures for any potential security breaches'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 to-accent-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your information when you use Nail Nav.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-gray-600">
              <strong>Last Updated:</strong> January 15, 2024
            </p>
            <p className="text-sm text-gray-500 mt-2">
              We may update this policy from time to time. We'll notify you of any significant changes.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Privacy Sections */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <section.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Additional Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights</h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  You have the right to access, update, or delete your personal information. 
                  You can do this through your account settings or by contacting us directly.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Access</h3>
                <p className="mb-4">
                  You can request a copy of all personal data we hold about you.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Portability</h3>
                <p className="mb-4">
                  You can request to receive your data in a structured, commonly used format.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Deletion</h3>
                <p className="mb-4">
                  You can request that we delete your personal information, subject to certain legal requirements.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies and Tracking</h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  We use cookies and similar technologies to improve your experience on our platform:
                </p>
                <ul className="space-y-2 mb-4">
                  <li>• <strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li>• <strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                  <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  Nail Nav is not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If you believe we have 
                  collected information from a child under 13, please contact us immediately.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-primary-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Mail className="w-12 h-12 mx-auto mb-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Privacy?</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about this privacy policy or how we handle your data, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@nailnav.com"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Email Privacy Team
              </a>
              <a
                href="/contact"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium border border-primary-600 hover:bg-primary-50 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}