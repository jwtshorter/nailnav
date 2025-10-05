import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { 
    autoRefreshToken: true, 
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: { 
    params: { 
      eventsPerSecond: 2 
    } 
  }
})

// Server-side client for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Salon {
  id: string
  owner_id?: string
  tier_id: string
  name: string
  slug: string
  description?: string
  address: string
  city: string
  state: string
  country: string
  postal_code?: string
  latitude: number
  longitude: number
  phone?: string
  email?: string
  website?: string
  price_range?: 'budget' | 'mid-range' | 'premium'
  price_from?: number
  currency: string
  specialties?: string[]
  services_offered?: string[]
  languages_spoken: string[]
  accepts_walk_ins: boolean
  parking_available: boolean
  operating_hours?: Record<string, { open: string; close: string }>
  logo_url?: string
  cover_image_url?: string
  gallery_images?: string[]
  is_published: boolean
  is_verified: boolean
  is_featured: boolean
  verification_date?: string
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  view_count: number
  contact_form_submissions: number
  created_at: string
  updated_at: string
}

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  parent_id?: string
  description?: string
  icon?: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface ServiceType {
  id: string
  category_id: string
  name: string
  slug: string
  description?: string
  duration_minutes?: number
  price_range_low?: number
  price_range_high?: number
  specialization_level?: 'basic' | 'standard' | 'advanced'
  trend_status?: 'stable' | 'growing' | 'trending' | 'declining'
  filtering_priority?: 'high' | 'medium' | 'low'
  keywords?: string[]
  created_at: string
}

export interface SalonService {
  id: string
  salon_id: string
  service_type_id: string
  price?: number
  duration_minutes?: number
  description?: string
  is_available: boolean
  requires_appointment: boolean
  online_booking_enabled: boolean
  real_time_availability: boolean
  created_at: string
  service_type?: ServiceType
}

export interface Review {
  id: string
  salon_id: string
  user_id?: string
  rating: number
  title?: string
  content?: string
  service_type?: string
  is_verified: boolean
  is_moderated: boolean
  is_published: boolean
  moderator_notes?: string
  reviewer_anonymous_id: string
  photos?: string[]
  helpful_count: number
  not_helpful_count: number
  created_at: string
}

export interface VendorTier {
  id: string
  name: 'free' | 'premium' | 'featured'
  display_name: string
  price_monthly: number
  features: Record<string, any>
  max_services?: number
  booking_enabled: boolean
  calendar_integration: boolean
  analytics_enabled: boolean
  created_at: string
}

export interface ProductBrand {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  website?: string
  is_premium: boolean
  specialization?: 'gel' | 'acrylic' | 'dip' | 'natural'
  created_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  user_type: 'customer' | 'vendor' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
}

// Extended salon type with related data
export interface SalonWithDetails extends Salon {
  reviews?: Review[]
  salon_services?: SalonService[]
  average_rating?: number
  review_count?: number
  vendor_tier?: VendorTier
  distance_meters?: number
}

// Search filters interface
export interface SalonSearchFilters {
  city?: string
  services?: string[]
  priceRange?: string[]
  specialties?: string[]
  languages?: string[]
  isVerified?: boolean
  acceptsWalkIns?: boolean
  hasParking?: boolean
  location?: {
    lat: number
    lng: number
    radius: number
  }
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  hasMore: boolean
}

// Authentication helpers
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}

// Database helpers
export const db = {
  salons: {
    async getAll(filters?: SalonSearchFilters) {
      let query = supabase
        .from('salons')
        .select(`
          *,
          vendor_tier:vendor_tiers(*),
          salon_services(
            *,
            service_type:service_types(*)
          ),
          reviews(rating, is_published)
        `)
        .eq('is_published', true)

      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }

      if (filters?.isVerified) {
        query = query.eq('is_verified', true)
      }

      if (filters?.acceptsWalkIns) {
        query = query.eq('accepts_walk_ins', true)
      }

      if (filters?.hasParking) {
        query = query.eq('parking_available', true)
      }

      return query
    },

    async getById(id: string) {
      return supabase
        .from('salons')
        .select(`
          *,
          vendor_tier:vendor_tiers(*),
          salon_services(
            *,
            service_type:service_types(*)
          ),
          reviews(*)
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single()
    },

    async getBySlug(slug: string) {
      return supabase
        .from('salons')
        .select(`
          *,
          vendor_tier:vendor_tiers(*),
          salon_services(
            *,
            service_type:service_types(*)
          ),
          reviews(*)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single()
    },

    async incrementViewCount(id: string) {
      return supabase.rpc('increment_salon_view_count', { salon_id: id })
    }
  },

  reviews: {
    async create(reviewData: Partial<Review>) {
      return supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single()
    },

    async getBySalonId(salonId: string, published = true) {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('salon_id', salonId)
        .order('created_at', { ascending: false })

      if (published) {
        query = query.eq('is_published', true)
      }

      return query
    }
  },

  serviceTypes: {
    async getAll() {
      return supabase
        .from('service_types')
        .select(`
          *,
          category:service_categories(*)
        `)
        .order('name')
    },

    async getByCategory(categoryId: string) {
      return supabase
        .from('service_types')
        .select('*')
        .eq('category_id', categoryId)
        .order('name')
    }
  },

  serviceCategories: {
    async getAll() {
      return supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
    }
  }
}