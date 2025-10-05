'use client'

import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { motion } from 'framer-motion'
import { FileText, Users, Shield, AlertTriangle, Scale, Mail } from 'lucide-react'

export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: FileText,
      content: 'By accessing or using Nail Nav, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
    },
    {
      title: 'Use License',
      icon: Users,
      content: 'Permission is granted to temporarily access Nail Nav for personal, non-commercial use only. This license shall automatically terminate if you violate any restrictions and may be terminated by us at any time.'
    },
    {
      title: 'User Account',
      icon: Shield,
      content: 'When creating an account, you must provide accurate and complete information. You are responsible for safeguarding your account credentials and for all activities that occur under your account.'
    },
    {
      title: 'Prohibited Uses',
      icon: AlertTriangle,
      content: 'You may not use Nail Nav for any unlawful purpose, to violate any laws, to transmit harmful code, to collect user information, or to interfere with the security of the platform.'
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
            <Scale className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              These terms govern your use of Nail Nav. Please read them carefully 
              to understand your rights and responsibilities.
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
              These terms are effective immediately and apply to all users of our platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Terms Sections */}
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
                
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}

            {/* Additional Detailed Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Salon Listings and Bookings</h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  Nail Nav serves as a platform connecting customers with nail salons. We do not 
                  directly provide nail services and are not responsible for the quality of 
                  services provided by listed salons.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Booking Terms</h3>
                <ul className="space-y-2">
                  <li>• Bookings are subject to salon availability and policies</li>
                  <li>• Cancellation and refund policies are set by individual salons</li>
                  <li>• We facilitate connections but are not party to service agreements</li>
                  <li>• Disputes should be resolved directly with the service provider</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Listing Accuracy</h3>
                <p>
                  While we strive to maintain accurate salon information, we cannot guarantee 
                  the accuracy of all listings. Users should verify details directly with salons.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">User Content and Reviews</h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  Users may submit reviews, photos, and other content. By submitting content, 
                  you grant us a non-exclusive, worldwide, royalty-free license to use, 
                  display, and distribute such content.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Content Guidelines</h3>
                <ul className="space-y-2">
                  <li>• Content must be honest, accurate, and based on actual experiences</li>
                  <li>• No offensive, discriminatory, or inappropriate content</li>
                  <li>• No spam, promotional content, or competitive information</li>
                  <li>• Respect privacy of others and do not share personal information</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Content Moderation</h3>
                <p>
                  We reserve the right to review, edit, or remove any user content that 
                  violates our guidelines or terms of service.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  Nail Nav shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages resulting from your use of the platform.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Service Availability</h3>
                <p>
                  We do not guarantee that our service will be uninterrupted, secure, or 
                  error-free. We may suspend or terminate service at any time without notice.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Third-Party Services</h3>
                <p>
                  Our platform may contain links to third-party websites or services. 
                  We are not responsible for the content or practices of these third parties.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law and Disputes</h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  These terms shall be governed by and construed in accordance with the laws 
                  of the State of California, without regard to its conflict of law principles.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Dispute Resolution</h3>
                <p>
                  Any disputes arising from these terms or your use of Nail Nav shall be 
                  resolved through binding arbitration in accordance with the rules of the 
                  American Arbitration Association.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Changes to Terms</h3>
                <p>
                  We reserve the right to update these terms at any time. Continued use of 
                  our platform after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2"><strong>Email:</strong> legal@nailnav.com</p>
                  <p className="mb-2"><strong>Phone:</strong> 1-555-NAILNAV</p>
                  <p><strong>Address:</strong> Nail Nav Legal Department<br />
                  123 Business Ave, Suite 100<br />
                  San Francisco, CA 94105</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-primary-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Mail className="w-12 h-12 mx-auto mb-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About These Terms?</h2>
            <p className="text-gray-600 mb-6">
              Our legal team is here to help clarify any questions you may have about our terms of service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@nailnav.com"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Contact Legal Team
              </a>
              <a
                href="/contact"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium border border-primary-600 hover:bg-primary-50 transition-colors"
              >
                General Support
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