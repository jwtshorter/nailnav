'use client'

import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { motion } from 'framer-motion'
import { Users, Target, Heart, Award, MapPin, Star, Shield, Clock } from 'lucide-react'
import { useTranslation } from '../../contexts/TranslationContext'

export default function AboutPage() {
  const { t } = useTranslation()
  
  const features = [
    {
      icon: MapPin,
      title: t('about.whyChoose.comprehensive.title'),
      description: t('about.whyChoose.comprehensive.description')
    },
    {
      icon: Star,
      title: t('about.whyChoose.verified.title'),
      description: t('about.whyChoose.verified.description')
    },
    {
      icon: Shield,
      title: t('about.whyChoose.easyBooking.title'),
      description: t('about.whyChoose.easyBooking.description')
    }
  ]

  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building a strong community of nail salon owners and customers who support each other.',
      color: 'primary'
    },
    {
      icon: Target,
      title: 'Quality Focus',
      description: 'Our platform prioritizes quality salons and services, ensuring customers find the best nail care experiences.',
      color: 'accent'
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'Every feature we build is designed with our users in mind, creating the best possible experience for finding nail care.',
      color: 'secondary'
    }
  ]

  const stats = [
    { number: '1,000+', label: 'Partner Salons' },
    { number: '50,000+', label: 'Happy Customers' },
    { number: '4.8★', label: 'Average Rating' },
    { number: '25+', label: 'Cities Served' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div 
        className="text-white py-16 md:py-24 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://page.gensparksite.com/v1/base64_upload/fd5b1d89ee755b0b188cab2569983b82')`,
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
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('about.mission.title')}</h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                {t('about.mission.description')}
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do, from product development to customer service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white p-8 rounded-lg shadow-md text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-${value.color}-100 flex items-center justify-center`}>
                  <value.icon className={`w-8 h-8 text-${value.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('about.whyChoose.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.whyChoose.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="prose prose-lg mx-auto text-gray-600"
            >
              <p className="text-lg leading-relaxed mb-6">
                {t('about.team.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Nail Nav Community</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Whether you're looking for your next nail appointment or want to grow your salon business, 
              we'd love to have you as part of our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/salons"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Find Salons
              </a>
              <a
                href="/vendor/register"
                className="bg-accent-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-600 transition-colors"
              >
                List Your Salon
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