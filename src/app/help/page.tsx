'use client'

import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  HelpCircle, 
  Search, 
  Phone, 
  Mail, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  User,
  Calendar,
  CreditCard,
  MapPin,
  Star,
  Settings
} from 'lucide-react'

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const categories = [
    {
      icon: User,
      title: 'Account & Profile',
      description: 'Managing your account, profile settings, and preferences',
      color: 'primary'
    },
    {
      icon: Calendar,
      title: 'Bookings & Appointments',
      description: 'How to book, modify, and cancel appointments',
      color: 'accent'
    },
    {
      icon: MapPin,
      title: 'Finding Salons',
      description: 'Search tips, filters, and location services',
      color: 'secondary'
    },
    {
      icon: Star,
      title: 'Reviews & Ratings',
      description: 'Writing reviews and understanding salon ratings',
      color: 'primary'
    },
    {
      icon: CreditCard,
      title: 'Payments & Pricing',
      description: 'Payment methods, pricing, and billing questions',
      color: 'accent'
    },
    {
      icon: Settings,
      title: 'Technical Issues',
      description: 'App problems, website issues, and troubleshooting',
      color: 'secondary'
    }
  ]

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking the "Sign Up" button and providing your email address, name, and creating a password. You can also sign up using your Google or Facebook account for faster registration.'
    },
    {
      question: 'How do I book an appointment through Nail Nav?',
      answer: 'Find a salon you like, click on their profile, select your preferred service and time slot, then follow the booking prompts. You\'ll receive a confirmation email once your appointment is booked.'
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule appointments through your account dashboard. Please note that each salon has its own cancellation policy, so check the specific terms when booking.'
    },
    {
      question: 'How do I leave a review for a salon?',
      answer: 'After your appointment, you\'ll receive an email prompt to leave a review. You can also visit the salon\'s profile page and click "Write Review" to share your experience and rate the service.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption and work with trusted payment processors to ensure your payment information is completely secure. We never store your full credit card details on our servers.'
    },
    {
      question: 'How does the location search work?',
      answer: 'Our location search uses your device\'s GPS to find nearby salons. You can also manually enter a city or zip code to search in a specific area. We\'ll show you salons within your selected radius.'
    },
    {
      question: 'What if I have a problem with a salon service?',
      answer: 'While we facilitate connections between customers and salons, service issues should be resolved directly with the salon. If you need help contacting a salon or have concerns, our support team can assist.'
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to your account settings by clicking on your profile picture or name. From there, you can update your personal information, contact details, and preferences.'
    }
  ]

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

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
            <HelpCircle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Help Center
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-8">
              Find answers to common questions, get help with bookings, 
              and learn how to make the most of Nail Nav.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Contact */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need immediate help?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <a
                href="tel:+15556245628"
                className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Call Support</span>
              </a>
              <a
                href="mailto:support@nailnav.com"
                className="flex items-center justify-center space-x-2 bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Email Us</span>
              </a>
              <button className="flex items-center justify-center space-x-2 bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span>Live Chat</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Browse Help Topics</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose a category below to find answers to your questions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className={`w-12 h-12 mb-4 rounded-full bg-${category.color}-100 flex items-center justify-center`}>
                  <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to the most common questions we receive.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4 border-t border-gray-100"
                  >
                    <p className="text-gray-600 pt-4">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Still Need Help */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-xl opacity-90 mb-8">
              Can't find what you're looking for? Our support team is here to help you 
              with any questions or issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@nailnav.com"
                className="bg-accent-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-600 transition-colors"
              >
                Email Us Directly
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