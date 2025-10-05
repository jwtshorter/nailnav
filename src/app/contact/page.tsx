'use client'

import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, MessageSquare, Users, Store, HelpCircle } from 'lucide-react'
import { useTranslation } from '../../contexts/TranslationContext'

export default function ContactPage() {
  const { t } = useTranslation()
  
  const contactMethods = [
    {
      icon: Mail,
      title: t('contact.methods.email.title'),
      description: t('contact.methods.email.description'),
      value: t('contact.methods.email.address'),
      action: 'mailto:support@nailnav.com',
      color: 'primary'
    },
    {
      icon: Phone,
      title: t('contact.methods.phone.title'),
      description: t('contact.methods.phone.description'),
      value: t('contact.methods.phone.number'),
      action: 'tel:+61296765432',
      color: 'accent'
    },
    {
      icon: MessageSquare,
      title: t('contact.methods.business.title'),
      description: t('contact.methods.business.description'),
      value: t('contact.methods.business.address'),
      action: 'mailto:business@nailnav.com',
      color: 'secondary'
    }
  ]

  const departments = [
    {
      icon: Users,
      title: t('contact.departments.support.title'),
      description: t('contact.departments.support.description'),
      email: t('contact.departments.support.email')
    },
    {
      icon: Store,
      title: t('contact.departments.business.title'),
      description: t('contact.departments.business.description'),
      email: t('contact.departments.business.email')
    },
    {
      icon: HelpCircle,
      title: t('contact.departments.technical.title'),
      description: t('contact.departments.technical.description'),
      email: t('contact.departments.technical.email')
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div 
        className="text-white py-16 md:py-24 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('contact.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              {t('contact.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('contact.getInTouch.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('contact.getInTouch.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 block"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-${method.color}-100 flex items-center justify-center`}>
                  <method.icon className={`w-8 h-8 text-${method.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{method.title}</h3>
                <p className="text-gray-600 text-center mb-4">{method.description}</p>
                <p className={`text-${method.color}-600 font-medium text-center`}>{method.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('contact.form.title')}</h2>
              <p className="text-lg text-gray-600">
                {t('contact.getInTouch.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="customer-support">Customer Support</option>
                    <option value="business-inquiry">Business Inquiry</option>
                    <option value="technical-issue">Technical Issue</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Please describe your question or concern in detail..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('contact.departments.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('contact.getInTouch.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-50 p-6 rounded-lg text-center"
              >
                <dept.icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{dept.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                <a
                  href={`mailto:${dept.email}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  {dept.email}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Clock className="w-12 h-12 mx-auto mb-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Support Hours</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday:</span>
                  <span>10:00 AM - 4:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700">
                  <strong>Note:</strong> Response times may be longer during weekends and holidays.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}