import { supabase } from '@/lib/supabase'
import { Salon, SalonWithDetails, SalonSearchFilters, PaginatedResponse } from '@/lib/supabase'

export class SalonService {
  // Find nearby salons with geographic search
  static async findNearby(
    lat: number, 
    lng: number, 
    radius: number = 25000,
    limit: number = 20
  ): Promise<Salon[]> {
    const { data, error } = await supabase.rpc('find_nearby_salons', { 
      lat, 
      lng, 
      radius_meters: radius,
      result_limit: limit
    })
    
    if (error) throw error
    return data || []
  }

  // Search salons with comprehensive filters
  static async search(
    filters: SalonSearchFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<SalonWithDetails>> {
    let query = supabase
      .from('salons')
      .select(`
        *,
        salon_services!inner (
          id,
          price,
          duration_minutes,
          is_available,
          service_type:service_types (
            name,
            category_id,
            slug
          )
        ),
        reviews (
          rating
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`)
    }

    if (filters.services?.length) {
      query = query.overlaps('services_offered', filters.services)
    }

    if (filters.specialties?.length) {
      query = query.overlaps('specialties', filters.specialties)
    }

    if (filters.languages?.length) {
      query = query.overlaps('languages_spoken', filters.languages)
    }

    if (filters.isVerified) {
      query = query.eq('is_verified', true)
    }

    if (filters.acceptsWalkIns) {
      query = query.eq('accepts_walk_ins', true)
    }

    if (filters.hasParking) {
      query = query.eq('parking_available', true)
    }

    if (filters.priceRange?.length) {
      query = query.in('price_range', filters.priceRange)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)

    if (error) throw error

    // Calculate average ratings
    const salonsWithDetails: SalonWithDetails[] = (data || []).map(salon => ({
      ...salon,
      average_rating: salon.reviews?.length 
        ? salon.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / salon.reviews.length
        : 0,
      review_count: salon.reviews?.length || 0
    }))

    return {
      data: salonsWithDetails,
      count: count || 0,
      page,
      limit,
      hasMore: (count || 0) > to + 1
    }
  }

  // Get salon by slug with full details
  static async getBySlug(slug: string): Promise<SalonWithDetails | null> {
    const { data, error } = await supabase
      .from('salons')
      .select(`
        *,
        salon_services (
          *,
          service_type:service_types (*)
        ),
        reviews (
          *
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    // Calculate average rating
    const averageRating = data.reviews?.length 
      ? data.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / data.reviews.length
      : 0

    return {
      ...data,
      average_rating: averageRating,
      review_count: data.reviews?.length || 0
    }
  }

  // Get featured salons with rotation algorithm
  static async getFeatured(limit: number = 6): Promise<Salon[]> {
    const { data, error } = await supabase
      .from('salons')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // Get popular salons based on view count and ratings
  static async getPopular(limit: number = 8): Promise<SalonWithDetails[]> {
    const { data, error } = await supabase
      .from('salons')
      .select(`
        *,
        reviews (
          rating
        )
      `)
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(limit)

    if (error) throw error

    return (data || []).map(salon => ({
      ...salon,
      average_rating: salon.reviews?.length 
        ? salon.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / salon.reviews.length
        : 0,
      review_count: salon.reviews?.length || 0
    }))
  }

  // Increment view count for analytics
  static async incrementViewCount(salonId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_salon_views', { 
      salon_id: salonId 
    })
    
    if (error) console.error('Failed to increment view count:', error)
  }

  // Track analytics event
  static async trackEvent(
    salonId: string,
    eventType: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        salon_id: salonId,
        event_type: eventType,
        metadata,
        device_type: this.getDeviceType(),
        session_id: this.getSessionId()
      })

    if (error) console.error('Failed to track event:', error)
  }

  // Real-time subscription for salon updates
  static subscribeToUpdates(callback: (salon: Salon) => void) {
    return supabase
      .channel('salon-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'salons' 
      }, callback)
      .subscribe()
  }

  // Helper methods
  private static getDeviceType(): string {
    if (typeof window === 'undefined') return 'server'
    
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private static getSessionId(): string {
    if (typeof window === 'undefined') return ''
    
    let sessionId = sessionStorage.getItem('nailnav_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('nailnav_session_id', sessionId)
    }
    return sessionId
  }
}

// Helper functions for database operations
export const createFindNearbySalonsFunction = `
CREATE OR REPLACE FUNCTION find_nearby_salons(
  lat DECIMAL,
  lng DECIMAL,
  radius_meters INTEGER DEFAULT 25000,
  result_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  slug VARCHAR,
  address TEXT,
  city VARCHAR,
  state VARCHAR,
  country VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  phone VARCHAR,
  price_range VARCHAR,
  price_from DECIMAL,
  specialties TEXT[],
  languages_spoken TEXT[],
  is_verified BOOLEAN,
  distance_meters DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.slug,
    s.address,
    s.city,
    s.state,
    s.country,
    s.latitude,
    s.longitude,
    s.phone,
    s.price_range,
    s.price_from,
    s.specialties,
    s.languages_spoken,
    s.is_verified,
    ST_Distance(
      s.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)
    ) as distance_meters
  FROM salons s
  WHERE s.is_published = true
    AND ST_DWithin(
      s.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326),
      radius_meters
    )
  ORDER BY distance_meters
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;
`;

export const createIncrementViewsFunction = `
CREATE OR REPLACE FUNCTION increment_salon_views(salon_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE salons 
  SET view_count = view_count + 1,
      updated_at = now()
  WHERE id = salon_id;
END;
$$ LANGUAGE plpgsql;
`;