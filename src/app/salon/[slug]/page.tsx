'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Footer from '@/components/mobile-first/Footer'
import NavigationComponent from '@/components/mobile-first/Navigation'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Clock, 
  CheckCircle, 
  Camera,
  Calendar,
  DollarSign,
  MessageSquare,
  Share2,
  Heart,
  Navigation,
  Store
} from 'lucide-react'

interface SalonService {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  available: boolean
}

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  serviceType: string
  date: string
  verified: boolean
}

interface SalonDetails {
  id: string
  name: string
  slug: string
  description: string
  address: string
  city: string
  state: string
  phone?: string
  email?: string
  website?: string
  price_range: string
  price_from?: number
  currency: string
  specialties: string[]
  languages_spoken: string[]
  is_verified: boolean
  is_featured: boolean
  accepts_walk_ins: boolean
  parking_available: boolean
  operating_hours: Record<string, { open: string; close: string }>
  logo_url?: string
  cover_image_url?: string
  gallery_images: string[]
  average_rating: number
  review_count: number
  services: SalonService[]
  reviews: Review[]
  latitude: number
  longitude: number
}

export default function SalonDetailPage({ params }: { params: { slug: string } }) {
  const [salon, setSalon] = useState<SalonDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    loadSalonDetails(params.slug)
  }, [params.slug])

  const loadSalonDetails = async (slug: string) => {
    setLoading(true)
    
    // First check localStorage for auto-created salons
    const salonListings = JSON.parse(localStorage.getItem('salonListings') || '[]')
    const autoCreatedSalon = salonListings.find((salon: any) => salon.slug === slug)
    
    if (autoCreatedSalon) {
      // Convert auto-created salon to SalonDetails format
      const convertedSalon: SalonDetails = {
        id: autoCreatedSalon.id.toString(),
        name: autoCreatedSalon.name,
        slug: autoCreatedSalon.slug,
        description: autoCreatedSalon.description,
        address: autoCreatedSalon.address.street,
        city: autoCreatedSalon.address.city,
        state: autoCreatedSalon.address.state,
        phone: '(555) 000-0000', // Default phone
        email: autoCreatedSalon.contact.email,
        website: `https://${autoCreatedSalon.slug}.com`,
        price_range: 'mid-range',
        price_from: 25,
        currency: 'USD',
        specialties: autoCreatedSalon.services || ['Manicure', 'Pedicure', 'Gel Polish'],
        languages_spoken: ['en'],
        is_verified: autoCreatedSalon.verified || true,
        is_featured: false,
        accepts_walk_ins: true,
        parking_available: true,
        operating_hours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '20:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '10:00', close: '18:00' }
        },
        cover_image_url: autoCreatedSalon.images?.[0] || '/api/placeholder/600/400',
        gallery_images: autoCreatedSalon.images || [
          '/api/placeholder/600/400',
          '/api/placeholder/600/400',
          '/api/placeholder/600/400'
        ],
        latitude: 34.0522,
        longitude: -118.2437,
        average_rating: autoCreatedSalon.rating || 4.5,
        review_count: autoCreatedSalon.reviewCount || 0,
        services: [
          {
            id: '1',
            name: 'Classic Manicure',
            description: 'Traditional nail care with cuticle treatment and polish',
            price: 35,
            duration: 45,
            category: 'Manicures',
            available: true
          },
          {
            id: '2', 
            name: 'Gel Manicure',
            description: 'Long-lasting gel polish application',
            price: 45,
            duration: 60,
            category: 'Manicures', 
            available: true
          },
          {
            id: '3',
            name: 'Spa Pedicure',
            description: 'Relaxing foot treatment with massage',
            price: 55,
            duration: 75,
            category: 'Pedicures',
            available: true
          }
        ],
        reviews: autoCreatedSalon.reviewCount > 0 ? [] : [ // Start with no reviews for new salons
          {
            id: '1',
            customerName: 'Welcome Customer',
            rating: 5,
            comment: `Just opened! Looking forward to trying ${autoCreatedSalon.name}. The salon looks great!`,
            serviceType: 'New Listing',
            date: autoCreatedSalon.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
            verified: false
          }
        ]
      }
      
      setSalon(convertedSalon)
      setLoading(false)
      return
    }
    
    // Fallback to mock data based on the slug
    const mockSalons: Record<string, SalonDetails> = {
      'elegant-nails-spa': {
        id: '1',
        name: 'Elegant Nails Spa',
        slug: 'elegant-nails-spa',
        description: 'Full-service nail salon offering premium manicures, pedicures, and nail art in a relaxing spa environment. We pride ourselves on cleanliness, professionalism, and using only the highest quality products.',
        address: '123 Main Street',
        city: 'Los Angeles',
        state: 'CA',
        phone: '(555) 123-4567',
        email: 'info@elegantnails.com',
        website: 'https://elegantnails.com',
        price_range: 'mid-range',
        price_from: 35,
        currency: 'USD',
        specialties: ['Gel Manicures', 'Nail Art', 'Spa Pedicures', 'French Manicures'],
        languages_spoken: ['en', 'es'],
        is_verified: true,
        is_featured: true,
        accepts_walk_ins: true,
        parking_available: true,
        operating_hours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '20:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '10:00', close: '18:00' }
        },
        cover_image_url: '/images/salon-elegant-cover.jpg',
        gallery_images: [
          '/images/salon-elegant-1.jpg',
          '/images/salon-elegant-2.jpg',
          '/images/salon-elegant-3.jpg'
        ],
        latitude: 34.0522,
        longitude: -118.2437,
        average_rating: 4.8,
        review_count: 127,
        services: [
          {
            id: '1',
            name: 'Classic Manicure',
            description: 'Traditional nail care with cuticle treatment, shaping, and polish application',
            price: 35,
            duration: 45,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'Gel Manicure',
            description: 'Long-lasting gel polish that stays chip-free for up to 3 weeks',
            price: 55,
            duration: 60,
            category: 'Manicures',
            available: true
          },
          {
            id: '3',
            name: 'Spa Pedicure',
            description: 'Relaxing foot treatment with exfoliation, massage, and polish',
            price: 65,
            duration: 75,
            category: 'Pedicures',
            available: true
          },
          {
            id: '4',
            name: 'Nail Art Design',
            description: 'Custom artistic designs and decorations for special occasions',
            price: 25,
            duration: 30,
            category: 'Nail Art',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Sarah M.',
            rating: 5,
            comment: 'Amazing service! My gel manicure lasted exactly 3 weeks as promised. The salon is so clean and relaxing.',
            serviceType: 'Gel Manicure',
            date: '2024-09-15',
            verified: true
          },
          {
            id: '2',
            customerName: 'Jessica L.',
            rating: 4,
            comment: 'Love the nail art here! Very creative and skilled technicians. Will definitely be back.',
            serviceType: 'Nail Art',
            date: '2024-09-10',
            verified: true
          },
          {
            id: '3',
            customerName: 'Maria G.',
            rating: 5,
            comment: 'Best pedicure in the city! Staff speaks Spanish which made me feel so comfortable.',
            serviceType: 'Spa Pedicure',
            date: '2024-09-05',
            verified: true
          }
        ]
      },

      'quick-nails-express': {
        id: '3',
        name: 'Quick Nails Express',
        slug: 'quick-nails-express',
        description: 'Fast and affordable nail services for busy lifestyles. Walk-ins welcome! We specialize in quick, quality service without compromising on care.',
        address: '789 Downtown Blvd',
        city: 'Miami',
        state: 'FL',
        phone: '(555) 456-7890',
        price_range: 'budget',
        price_from: 20,
        currency: 'USD',
        specialties: ['Quick Service', 'Walk-ins Welcome', 'Affordable Prices'],
        languages_spoken: ['en', 'es'],
        is_verified: false,
        is_featured: false,
        accepts_walk_ins: true,
        parking_available: false,
        operating_hours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '21:00' },
          saturday: { open: '07:00', close: '21:00' },
          sunday: { open: '09:00', close: '19:00' }
        },
        gallery_images: [],
        latitude: 25.7617,
        longitude: -80.1918,
        average_rating: 4.2,
        review_count: 45,
        services: [
          {
            id: '1',
            name: 'Express Manicure',
            description: 'Quick 30-minute manicure perfect for busy schedules',
            price: 25,
            duration: 30,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'Basic Pedicure',
            description: 'Affordable pedicure with essential care and polish',
            price: 35,
            duration: 45,
            category: 'Pedicures',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Lisa K.',
            rating: 4,
            comment: 'Perfect for a quick touch-up. In and out in 30 minutes with a great manicure!',
            serviceType: 'Express Manicure',
            date: '2024-09-18',
            verified: true
          }
        ]
      },
      
      'luxe-nail-lounge': {
        id: '2',
        name: 'Luxe Nail Lounge',
        slug: 'luxe-nail-lounge',
        description: 'Premium luxury nail salon offering high-end treatments with top-tier products and personalized service in Beverly Hills. Experience true luxury nail care.',
        address: '456 Beverly Drive',
        city: 'Beverly Hills',
        state: 'CA',
        phone: '(555) 987-6543',
        email: 'hello@luxenaillounge.com',
        website: 'https://luxenaillounge.com',
        price_range: 'premium',
        price_from: 65,
        currency: 'USD',
        specialties: ['Premium Gel Services', 'Luxury Treatments', 'VIP Experience', 'Russian Manicure'],
        languages_spoken: ['en', 'ru'],
        is_verified: true,
        is_featured: true,
        accepts_walk_ins: false,
        parking_available: true,
        operating_hours: {
          monday: { open: '10:00', close: '20:00' },
          tuesday: { open: '10:00', close: '20:00' },
          wednesday: { open: '10:00', close: '20:00' },
          thursday: { open: '10:00', close: '20:00' },
          friday: { open: '10:00', close: '21:00' },
          saturday: { open: '09:00', close: '21:00' },
          sunday: { open: '11:00', close: '19:00' }
        },
        cover_image_url: 'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8',
        gallery_images: [
          'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8',
          'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121',
          'https://page.gensparksite.com/v1/base64_upload/fd5b1d89ee755b0b188cab2569983b82'
        ],
        latitude: 34.0736,
        longitude: -118.4004,
        average_rating: 4.9,
        review_count: 89,
        services: [
          {
            id: '1',
            name: 'Luxury Gel Manicure',
            description: 'Premium gel manicure with luxury products and extended hand massage',
            price: 85,
            duration: 75,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'Russian Manicure',
            description: 'Precise dry manicure technique for perfect cuticle work',
            price: 95,
            duration: 90,
            category: 'Manicures',
            available: true
          },
          {
            id: '3',
            name: 'VIP Pedicure Experience',
            description: 'Ultimate luxury pedicure with champagne and premium treatments',
            price: 120,
            duration: 105,
            category: 'Pedicures',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Alexandra V.',
            rating: 5,
            comment: 'Absolutely the best nail salon in Beverly Hills! Worth every penny for the luxury experience.',
            serviceType: 'VIP Pedicure Experience',
            date: '2024-09-20',
            verified: true
          }
        ]
      },
      
      'trendy-nails-studio': {
        id: '3',
        name: 'Trendy Nails Studio',
        slug: 'trendy-nails-studio',
        description: 'Modern nail art studio specializing in creative designs, acrylic extensions, and the latest nail trends. Perfect for those seeking unique and artistic nail looks.',
        address: '789 Creative Blvd',
        city: 'Miami',
        state: 'FL',
        phone: '(305) 555-0123',
        email: 'studio@trendynails.com',
        website: 'https://trendynailsstudio.com',
        price_range: 'mid-range',
        price_from: 45,
        currency: 'USD',
        specialties: ['Nail Art', 'Acrylic Extensions', 'Creative Designs', '3D Nail Art'],
        languages_spoken: ['en', 'es'],
        is_verified: true,
        is_featured: false,
        accepts_walk_ins: true,
        parking_available: false,
        operating_hours: {
          monday: { open: '10:00', close: '19:00' },
          tuesday: { open: '10:00', close: '19:00' },
          wednesday: { open: '10:00', close: '19:00' },
          thursday: { open: '10:00', close: '20:00' },
          friday: { open: '10:00', close: '20:00' },
          saturday: { open: '09:00', close: '20:00' },
          sunday: { open: '12:00', close: '18:00' }
        },
        cover_image_url: 'https://page.gensparksite.com/v1/base64_upload/fd5b1d89ee755b0b188cab2569983b82',
        gallery_images: [
          'https://page.gensparksite.com/v1/base64_upload/fd5b1d89ee755b0b188cab2569983b82',
          'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121'
        ],
        latitude: 25.7617,
        longitude: -80.1918,
        average_rating: 4.7,
        review_count: 156,
        services: [
          {
            id: '1',
            name: 'Custom Nail Art',
            description: 'Hand-painted designs and creative artwork tailored to your style',
            price: 60,
            duration: 75,
            category: 'Nail Art',
            available: true
          },
          {
            id: '2',
            name: 'Acrylic Full Set',
            description: 'Full set of acrylic extensions with shape and length customization',
            price: 75,
            duration: 120,
            category: 'Extensions',
            available: true
          },
          {
            id: '3',
            name: '3D Nail Design',
            description: 'Dimensional nail art with gems, charms, and sculpted elements',
            price: 85,
            duration: 90,
            category: 'Nail Art',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Isabella R.',
            rating: 5,
            comment: 'Most creative nail art in Miami! They brought my vision to life perfectly.',
            serviceType: 'Custom Nail Art',
            date: '2024-09-18',
            verified: true
          }
        ]
      },
      
      'pure-beauty-nails': {
        id: '4',
        name: 'Pure Beauty Nails',
        slug: 'pure-beauty-nails',
        description: 'Classic nail salon focusing on timeless elegance with French manicures, spa treatments, and natural nail care in a serene environment.',
        address: '321 Beauty Lane',
        city: 'San Francisco',
        state: 'CA',
        phone: '(415) 555-0987',
        email: 'info@purebeautynails.com',
        website: 'https://purebeautynails.com',
        price_range: 'mid-range',
        price_from: 40,
        currency: 'USD',
        specialties: ['French Manicure', 'Spa Pedicure', 'Natural Nail Care', 'Classic Styles'],
        languages_spoken: ['en', 'zh'],
        is_verified: false,
        is_featured: false,
        accepts_walk_ins: true,
        parking_available: true,
        operating_hours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '19:00' },
          saturday: { open: '08:00', close: '19:00' },
          sunday: { open: '10:00', close: '17:00' }
        },
        cover_image_url: 'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121',
        gallery_images: [
          'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121'
        ],
        latitude: 37.7749,
        longitude: -122.4194,
        average_rating: 4.6,
        review_count: 92,
        services: [
          {
            id: '1',
            name: 'Classic French Manicure',
            description: 'Timeless French tips with perfect white and nude polish application',
            price: 45,
            duration: 50,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'Relaxing Spa Pedicure',
            description: 'Soothing foot treatment with essential oils and massage',
            price: 60,
            duration: 70,
            category: 'Pedicures',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Linda C.',
            rating: 4,
            comment: 'Great for classic manicures. Clean facility and friendly staff.',
            serviceType: 'Classic French Manicure',
            date: '2024-09-12',
            verified: true
          }
        ]
      },
      
      'glamour-nail-bar': {
        id: '5',
        name: 'Glamour Nail Bar',
        slug: 'glamour-nail-bar',
        description: 'Trendy nail bar in Manhattan specializing in dip powder nails, nail extensions, and glamorous designs for the fashion-forward clientele.',
        address: '567 Fashion Ave',
        city: 'New York',
        state: 'NY',
        phone: '(212) 555-0456',
        email: 'book@glamournailbar.com',
        website: 'https://glamournailbar.com',
        price_range: 'premium',
        price_from: 55,
        currency: 'USD',
        specialties: ['Dip Powder', 'Nail Extensions', 'Glamorous Designs', 'Fashion Nails'],
        languages_spoken: ['en', 'ko'],
        is_verified: true,
        is_featured: false,
        accepts_walk_ins: false,
        parking_available: false,
        operating_hours: {
          monday: { open: '10:00', close: '20:00' },
          tuesday: { open: '10:00', close: '20:00' },
          wednesday: { open: '10:00', close: '20:00' },
          thursday: { open: '10:00', close: '21:00' },
          friday: { open: '10:00', close: '21:00' },
          saturday: { open: '09:00', close: '21:00' },
          sunday: { open: '11:00', close: '19:00' }
        },
        cover_image_url: 'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8',
        gallery_images: [
          'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8'
        ],
        latitude: 40.7589,
        longitude: -73.9851,
        average_rating: 4.5,
        review_count: 78,
        services: [
          {
            id: '1',
            name: 'Dip Powder Manicure',
            description: 'Long-lasting dip powder system for strong, durable nails',
            price: 65,
            duration: 60,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'Glamour Extension Set',
            description: 'Full set of extensions with glamorous design and length',
            price: 95,
            duration: 120,
            category: 'Extensions',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Ashley K.',
            rating: 5,
            comment: 'Best dip powder nails in NYC! They last for weeks without chipping.',
            serviceType: 'Dip Powder Manicure',
            date: '2024-09-16',
            verified: true
          }
        ]
      },
      
      'serenity-spa-nails': {
        id: '6',
        name: 'Serenity Spa Nails',
        slug: 'serenity-spa-nails',
        description: 'Wellness-focused nail spa offering organic treatments, non-toxic polishes, and holistic nail care in a peaceful, zen-like environment.',
        address: '890 Wellness Way',
        city: 'Austin',
        state: 'TX',
        phone: '(512) 555-0789',
        email: 'relax@serenityspa.com',
        website: 'https://serenityspa.com',
        price_range: 'premium',
        price_from: 50,
        currency: 'USD',
        specialties: ['Organic Treatments', 'Wellness', 'Non-toxic Polishes', 'Holistic Care'],
        languages_spoken: ['en'],
        is_verified: true,
        is_featured: false,
        accepts_walk_ins: true,
        parking_available: true,
        operating_hours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '20:00' },
          friday: { open: '09:00', close: '20:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '10:00', close: '18:00' }
        },
        cover_image_url: 'https://page.gensparksite.com/v1/base64_upload/fd5b1d89ee755b0b188cab2569983b82',
        gallery_images: [
          'https://page.gensparksite.com/v1/base64_upload/fd5b1d89ee755b0b188cab2569983b82'
        ],
        latitude: 30.2672,
        longitude: -97.7431,
        average_rating: 4.7,
        review_count: 134,
        services: [
          {
            id: '1',
            name: 'Organic Manicure',
            description: 'Chemical-free manicure using organic and non-toxic products',
            price: 55,
            duration: 60,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'Wellness Pedicure',
            description: 'Therapeutic foot treatment with essential oils and healing touch',
            price: 70,
            duration: 80,
            category: 'Pedicures',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Emma W.',
            rating: 5,
            comment: 'Love that they use non-toxic products! Great for sensitive skin and nails.',
            serviceType: 'Organic Manicure',
            date: '2024-09-14',
            verified: true
          }
        ]
      },
      
      'modern-nails-boutique': {
        id: '7',
        name: 'Modern Nails Boutique',
        slug: 'modern-nails-boutique',
        description: 'Contemporary nail boutique featuring the latest trends, minimalist designs, and premium gel polish collections in a stylish modern setting.',
        address: '234 Modern St',
        city: 'Seattle',
        state: 'WA',
        phone: '(206) 555-0234',
        email: 'hello@modernnails.com',
        website: 'https://modernnailsboutique.com',
        price_range: 'mid-range',
        price_from: 48,
        currency: 'USD',
        specialties: ['Contemporary Art', 'Gel Polish', 'Minimalist Designs', 'Trendy Styles'],
        languages_spoken: ['en'],
        is_verified: false,
        is_featured: false,
        accepts_walk_ins: true,
        parking_available: true,
        operating_hours: {
          monday: { open: '10:00', close: '19:00' },
          tuesday: { open: '10:00', close: '19:00' },
          wednesday: { open: '10:00', close: '19:00' },
          thursday: { open: '10:00', close: '20:00' },
          friday: { open: '10:00', close: '20:00' },
          saturday: { open: '09:00', close: '20:00' },
          sunday: { open: '11:00', close: '18:00' }
        },
        cover_image_url: 'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121',
        gallery_images: [
          'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121'
        ],
        latitude: 47.6062,
        longitude: -122.3321,
        average_rating: 4.4,
        review_count: 67,
        services: [
          {
            id: '1',
            name: 'Modern Gel Manicure',
            description: 'Contemporary gel application with trendy color selections',
            price: 50,
            duration: 55,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'Minimalist Nail Art',
            description: 'Simple, elegant designs perfect for professional settings',
            price: 40,
            duration: 45,
            category: 'Nail Art',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Rachel T.',
            rating: 4,
            comment: 'Love the modern aesthetic and clean designs. Perfect for work.',
            serviceType: 'Minimalist Nail Art',
            date: '2024-09-11',
            verified: true
          }
        ]
      },
      
      'royal-touch-nails': {
        id: '8',
        name: 'Royal Touch Nails',
        slug: 'royal-touch-nails',
        description: 'Luxury nail salon offering VIP experiences, exclusive treatments, and royal-level service in the heart of Las Vegas. The ultimate in nail luxury.',
        address: '789 Luxury Blvd',
        city: 'Las Vegas',
        state: 'NV',
        phone: '(702) 555-0789',
        email: 'vip@royaltouchnails.com',
        website: 'https://royaltouchnails.com',
        price_range: 'premium',
        price_from: 75,
        currency: 'USD',
        specialties: ['Luxury Service', 'VIP Experience', 'Exclusive Treatments', 'Royal Care'],
        languages_spoken: ['en', 'fr'],
        is_verified: true,
        is_featured: true,
        accepts_walk_ins: false,
        parking_available: true,
        operating_hours: {
          monday: { open: '10:00', close: '22:00' },
          tuesday: { open: '10:00', close: '22:00' },
          wednesday: { open: '10:00', close: '22:00' },
          thursday: { open: '10:00', close: '22:00' },
          friday: { open: '10:00', close: '23:00' },
          saturday: { open: '09:00', close: '23:00' },
          sunday: { open: '11:00', close: '21:00' }
        },
        cover_image_url: 'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8',
        gallery_images: [
          'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8'
        ],
        latitude: 36.1699,
        longitude: -115.1398,
        average_rating: 4.8,
        review_count: 203,
        services: [
          {
            id: '1',
            name: 'Royal VIP Manicure',
            description: 'Ultimate luxury manicure with champagne service and premium products',
            price: 120,
            duration: 90,
            category: 'Manicures',
            available: true
          },
          {
            id: '2',
            name: 'Exclusive Diamond Treatment',
            description: 'Signature treatment with diamond-infused products and gold accents',
            price: 200,
            duration: 120,
            category: 'Luxury Treatments',
            available: true
          }
        ],
        reviews: [
          {
            id: '1',
            customerName: 'Victoria L.',
            rating: 5,
            comment: 'Absolutely phenomenal! The VIP treatment made me feel like royalty.',
            serviceType: 'Royal VIP Manicure',
            date: '2024-09-19',
            verified: true
          }
        ]
      }
    }

    // Simulate API delay
    setTimeout(() => {
      const salonData = mockSalons[slug]
      setSalon(salonData || null)
      setLoading(false)
    }, 800)
  }

  const formatPrice = (price: number, currency = 'USD'): string => {
    const symbol = currency === 'USD' ? '$' : currency
    return `${symbol}${price}`
  }

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getCurrentStatus = (hours: Record<string, { open: string; close: string }>) => {
    const now = new Date()
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const currentDay = days[now.getDay()]
    const currentTime = now.toTimeString().substring(0, 5)
    
    const todayHours = hours[currentDay]
    if (!todayHours) return { isOpen: false, message: 'Closed today' }
    
    if (currentTime >= todayHours.open && currentTime <= todayHours.close) {
      return { isOpen: true, message: `Open until ${todayHours.close}` }
    }
    
    return { isOpen: false, message: `Opens at ${todayHours.open}` }
  }

  const handleContact = (type: 'phone' | 'email' | 'directions' | 'website') => {
    if (!salon) return
    
    switch (type) {
      case 'phone':
        if (salon.phone) window.location.href = `tel:${salon.phone}`
        break
      case 'email':
        if (salon.email) window.location.href = `mailto:${salon.email}`
        break
      case 'website':
        if (salon.website) window.open(salon.website, '_blank')
        break
      case 'directions':
        const address = encodeURIComponent(`${salon.address}, ${salon.city}, ${salon.state}`)
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-gray-300 rounded-lg"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Salon Not Found</h1>
          <p className="text-gray-600 mb-6">The salon you're looking for doesn't exist.</p>
          <button
            onClick={() => {
              // Check if user came from admin dashboard
              const referrer = document.referrer
              if (referrer.includes('/admin/dashboard')) {
                window.location.href = '/admin/dashboard'
              } else {
                window.history.back()
              }
            }}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // This should not happen given the checks above, but TypeScript requires it
  if (!salon) return null

  const status = getCurrentStatus(salon.operating_hours)

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationComponent />
      
      {/* Header Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary-500 to-accent-500">
        {salon.cover_image_url ? (
          <img 
            src={salon.cover_image_url} 
            alt={salon.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Camera className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Back Button */}
        <button
          onClick={() => {
            // Check if user came from admin dashboard
            const referrer = document.referrer
            if (referrer.includes('/admin/dashboard')) {
              window.location.href = '/admin/dashboard'
            } else {
              window.history.back()
            }
          }}
          className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-full"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <Navigation className="w-5 h-5 transform rotate-180" />
        </button>

        {/* Share Button */}
        <button
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 -mt-6 relative z-10">
        {/* Salon Info Card */}
        <motion.div 
          className="bg-white rounded-lg shadow-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-900 mr-3">{salon.name}</h1>
                {salon.is_verified && (
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">Verified</span>
                  </div>
                )}
              </div>

              <div className="flex items-center mb-3">
                {renderStars(salon.average_rating)}
                <span className="ml-2 text-gray-600">
                  {salon.average_rating.toFixed(1)} ({salon.review_count} reviews)
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{salon.city}, {salon.state}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <Clock className="w-4 h-4 mr-2" />
                <span className={status.isOpen ? 'text-green-600' : 'text-red-600'}>
                  {status.message}
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <span>${salon.price_from || 0} and up - {salon.price_range.replace('-', ' ')}</span>
              </div>
            </div>

            <button className="p-2 text-gray-400 hover:text-primary-500">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Specialties and Features */}
          <div className="mb-6">
            {/* Traditional specialties */}
            <div className="flex flex-wrap gap-2 mb-4">
              {salon.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>

            {/* Enhanced filters/features - Temporarily disabled for build
            TODO: Add filters property to SalonDetails interface 
            This section is temporarily disabled to prevent build errors
            */}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <motion.button
              onClick={() => handleContact('directions')}
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-3 rounded-lg font-medium"
              style={{ minHeight: '44px' }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Directions
            </motion.button>

            {salon.website && (
              <motion.button
                onClick={() => handleContact('website')}
                className="flex items-center justify-center bg-purple-500 text-white px-4 py-3 rounded-lg font-medium"
                style={{ minHeight: '44px' }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-4 h-4 mr-2" />
                Website
              </motion.button>
            )}

            <motion.button
              onClick={() => {
                // Track booking button click
                console.log('Book button clicked for salon:', salon.slug)
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'booking_click', {
                    salon_name: salon.name,
                    salon_slug: salon.slug
                  })
                }
                // Navigate to booking page
                window.location.href = `/salon/${salon.slug}/book`
              }}
              className="flex items-center justify-center bg-primary-500 text-white px-4 py-3 rounded-lg font-medium"
              style={{ minHeight: '44px' }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book
            </motion.button>
          </div>
          
          {/* Claim Business Button - Only show if salon is not verified */}
          {!salon.is_verified && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Are you the owner of {salon.name}?</h4>
                  <p className="text-xs text-blue-700 mt-1">Claim your business to manage your listing, respond to reviews, and update information.</p>
                </div>
                <motion.button
                  onClick={() => {
                    // Store salon info for claiming
                    localStorage.setItem('claimingSalon', JSON.stringify({
                      id: salon.id,
                      name: salon.name,
                      slug: salon.slug,
                      address: salon.address,
                      city: salon.city,
                      state: salon.state
                    }))
                    window.location.href = '/vendor/claim'
                  }}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap"
                  whileTap={{ scale: 0.95 }}
                >
                  <Store className="w-4 h-4 mr-2" />
                  Claim Business
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Overview Section */}
        <motion.div 
          className="bg-white rounded-lg shadow-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About {salon.name}</h2>
            <div className="space-y-6">
                <div>
                  <p className="text-gray-600 leading-relaxed mb-6">{salon.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Expanded features list - only show selected features */}
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">{salon.accepts_walk_ins ? 'Walk-ins Welcome' : 'By Appointment Only'}</span>
                    </div>
                    
                    {salon.parking_available && (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm">Parking Available</span>
                      </div>
                    )}
                    
                    {salon.languages_spoken.length > 1 && (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm">Multilingual Staff</span>
                      </div>
                    )}
                    
                    {salon.is_verified && (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm">Verified Business</span>
                      </div>
                    )}
                    
                    {/* Additional features based on salon data */}
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">Online Booking Available</span>
                    </div>
                    
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">Credit Cards Accepted</span>
                    </div>
                    
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">Sanitized Equipment</span>
                    </div>
                    
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm">Professional Staff</span>
                    </div>
                    
                    {salon.price_range === 'premium' && (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm">Luxury Experience</span>
                      </div>
                    )}
                    
                    {salon.average_rating >= 4.5 && (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm">Highly Rated</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Hours of Operation</h3>
                  <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                    {Object.entries(salon.operating_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize font-medium">{day}</span>
                        <span className="text-gray-600">
                          {hours.open} - {hours.close}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {salon.gallery_images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {salon.gallery_images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${salon.name} gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
          </div>
        </motion.div>

        {/* Services Section */}
        <motion.div 
          className="bg-white rounded-lg shadow-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Services & Pricing</h2>
            <div className="space-y-4">
                
                {/* Check for real menu items from vendor application */}
                {salon?.services && salon.services.length > 0 ? (
                  <div className="space-y-6">
                    {/* Group services by category - Only show services with $ figures */}
                    {Object.entries(
                      salon.services
                        .filter(item => item.available && item.price > 0)
                        .reduce((acc, item) => {
                          if (!acc[item.category]) acc[item.category] = []
                          acc[item.category].push(item)
                          return acc
                        }, {} as Record<string, SalonService[]>)
                    ).map(([category, services]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
                          {category}
                        </h4>
                        <div className="space-y-3">
                          {services.map((service, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{service.name}</h5>
                                  {service.description && (
                                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className="font-semibold text-primary-600">
                                    ${service.price.toFixed(2)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDuration(service.duration)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
                                  Book Now
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Default services if no custom menu - Only show services with prices */
                  salon.services.filter(service => service.price > 0).map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-semibold text-primary-600">
                            {formatPrice(service.price)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDuration(service.duration)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {service.category}
                        </span>
                        <button className="text-sm text-primary-600 font-medium">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div 
          className="bg-white rounded-lg shadow-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <button className="text-primary-600 font-medium hover:text-primary-700">Write Review</button>
            </div>
            <div className="space-y-6">

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {renderStars(salon.average_rating)}
                      <span className="ml-2 text-2xl font-bold">{salon.average_rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-600">{salon.review_count} reviews</span>
                  </div>
                </div>

                {/* Google Reviews Integration */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6" />
                      <h4 className="font-semibold text-gray-900">Google Reviews</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Verified</span>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/${encodeURIComponent(salon.name + ' ' + salon.address + ' ' + salon.city + ' ' + salon.state)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View on Google
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Google Reviews Rating Summary */}
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{salon.average_rating.toFixed(1)}</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(salon.average_rating)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Based on {salon.review_count}+ Google reviews
                      </div>
                    </div>
                    
                    {/* Google Review Highlights */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Service Quality</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cleanliness</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-18 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">4.9</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Value</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-14 h-2 bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">4.6</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Google Reviews */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-3">Recent Google Reviews</h5>
                    <div className="space-y-3">
                      <div className="border-l-2 border-blue-500 pl-3">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              M
                            </div>
                            <div>
                              <div className="font-medium text-sm">Maria S.</div>
                              <div className="flex items-center">
                                {renderStars(5)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Excellent service! The gel manicure lasted exactly 3 weeks. Very clean salon and friendly staff."
                        </p>
                      </div>
                      
                      <div className="border-l-2 border-green-500 pl-3">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              J
                            </div>
                            <div>
                              <div className="font-medium text-sm">Jessica L.</div>
                              <div className="flex items-center">
                                {renderStars(5)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">1 week ago</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Amazing nail art! They really listened to what I wanted and exceeded my expectations."
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(salon.name + ' ' + salon.address + ' ' + salon.city + ' ' + salon.state)}/reviews`, '_blank')}
                      className="w-full mt-4 py-2 px-4 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      View All Google Reviews
                    </button>
                  </div>
                </div>

                {/* Platform Reviews */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Platform Reviews</h4>
                  {salon.reviews.slice(0, showAllReviews ? undefined : 3).map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="font-medium">{review.customerName}</span>
                            {review.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                            )}
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        {review.serviceType}
                      </span>
                    </div>
                  ))}
                </div>

                {salon.reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full py-3 text-primary-600 font-medium border border-primary-200 rounded-lg hover:bg-primary-50"
                  >
                    {showAllReviews ? 'Show Less' : `See All ${salon.reviews.length} Reviews`}
                  </button>
                )}
              </div>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}