'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Star, Shield, Users, Heart, Award } from 'lucide-react'
import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'

export default function AboutPage() {
  const features = [
    {
      icon: MapPin,
      title: 'Find Local Salons',
      description: 'Discover the best nail salons in your area with our comprehensive directory.'
    },
    {
      icon: Star,
      title: 'Verified Reviews',
      description: 'Read authentic reviews from real customers to make informed decisions.'
    },
    {
      icon: Shield,
      title: 'Trusted Partners',
      description: 'We work only with verified, professional nail salons and technicians.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by nail enthusiasts for nail enthusiasts - join our growing community.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Salons Listed' },
    { number: '500K+', label: 'Happy Customers' },
    { number: '1M+', label: 'Reviews & Ratings' },
    { number: '50+', label: 'Cities Covered' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Nail Nav
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your trusted platform for discovering exceptional nail salons and connecting with skilled nail technicians. 
              We're passionate about helping you find the perfect place for beautiful, healthy nails.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/search"
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find Salons
              </motion.a>
              <motion.a
                href="/vendor/register"
                className="bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold border border-primary-500 hover:bg-primary-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                List Your Salon
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-500 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-6">
              Founded in 2024, Nail Nav was born from a simple idea: finding a great nail salon shouldn't be a gamble. 
              We noticed that people were struggling to find reliable, skilled nail technicians in their area, often 
              relying on outdated directories or word-of-mouth recommendations.
            </p>
            <p className="mb-6">
              Our mission is to bridge the gap between nail enthusiasts and exceptional nail salons. We believe 
              everyone deserves access to professional, safe, and beautiful nail care services, regardless of 
              where they live.
            </p>
            <p className="mb-8">
              Today, Nail Nav serves thousands of customers across multiple cities, connecting them with verified, 
              top-rated nail salons and helping local businesses grow their customer base.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Nail Nav?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than just a directory - we're your trusted partner in finding exceptional nail care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-gray-50 p-6 rounded-lg text-center"
              >
                <feature.icon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <Heart className="w-10 h-10 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quality First
              </h3>
              <p className="text-gray-600">
                We carefully vet all salons to ensure they meet our high standards for cleanliness, 
                professionalism, and customer service.
              </p>
            </div>
            <div className="p-6">
              <Users className="w-10 h-10 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community Focus
              </h3>
              <p className="text-gray-600">
                We support local businesses and believe in building strong communities around 
                nail care and beauty services.
              </p>
            </div>
            <div className="p-6">
              <Award className="w-10 h-10 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Excellence
              </h3>
              <p className="text-gray-600">
                We're committed to continuous improvement and providing the best possible 
                experience for both customers and salon partners.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect Salon?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of satisfied customers who trust Nail Nav for their nail care needs.
            </p>
            <motion.a
              href="/search"
              className="bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Search
            </motion.a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}