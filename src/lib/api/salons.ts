import { supabase, db, type SalonWithDetails, type SalonSearchFilters, type ApiResponse, type PaginatedResponse } from '../supabase'

export class SalonService {
  /**
   * Search salons with filters and location
   */
  static async searchSalons(filters: SalonSearchFilters & {
    page?: number
    limit?: number
  } = {}): Promise<ApiResponse<PaginatedResponse<SalonWithDetails>>> {
    try {
      const {
        city,
        services,
        priceRange,
        specialties,
        languages,
        isVerified,
        acceptsWalkIns,
        hasParking,
        location,
        page = 1,
        limit = 20
      } = filters

      const offset = (page - 1) * limit

      // Use the stored procedure for complex location-based search
      if (location) {
        const { data, error } = await supabase.rpc('search_salons_by_location', {
          search_lat: location.lat,
          search_lng: location.lng,
          search_radius_km: Math.round((location.radius || 50000) / 1000), // Convert meters to km
          search_city: city,
          search_services: services,
          search_verified: isVerified,
          search_walk_ins: acceptsWalkIns,
          search_parking: hasParking,
          limit_count: limit,
          offset_count: offset
        })

        if (error) throw error

        // Get total count for pagination
        const { count } = await supabase
          .from('salons')
          .select('id', { count: 'exact', head: true })
          .eq('is_published', true)

        return {
          data: {
            data: data || [],
            count: count || 0,
            page,
            limit,
            hasMore: (count || 0) > offset + limit
          }
        }
      }

      // Regular database query for non-location searches
      const { data, error, count } = await db.salons.getAll(filters)

      if (error) throw error

      // Calculate averages and review counts for each salon
      const salonsWithStats = await Promise.all(
        (data || []).map(async (salon) => {
          const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('salon_id', salon.id)
            .eq('is_published', true)

          const average_rating = reviews?.length 
            ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2))
            : 0

          return {
            ...salon,
            average_rating,
            review_count: reviews?.length || 0
          } as SalonWithDetails
        })
      )

      return {
        data: {
          data: salonsWithStats,
          count: count || 0,
          page,
          limit,
          hasMore: (count || 0) > offset + limit
        }
      }
    } catch (error) {
      console.error('Error searching salons:', error)
      return {
        error: 'Failed to search salons'
      }
    }
  }

  /**
   * Get featured salons for homepage
   */
  static async getFeaturedSalons(limit = 8): Promise<ApiResponse<SalonWithDetails[]>> {
    try {
      const { data, error } = await supabase.rpc('get_featured_salons', {
        limit_count: limit
      })

      if (error) throw error

      return {
        data: data || []
      }
    } catch (error) {
      console.error('Error fetching featured salons:', error)
      return {
        error: 'Failed to fetch featured salons'
      }
    }
  }

  /**
   * Get salon by slug with full details
   */
  static async getSalonBySlug(slug: string): Promise<ApiResponse<SalonWithDetails>> {
    try {
      const { data, error } = await db.salons.getBySlug(slug)

      if (error) throw error
      if (!data) return { error: 'Salon not found' }

      // Calculate average rating and review count
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('salon_id', data.id)
        .eq('is_published', true)

      const average_rating = reviews?.length 
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2))
        : 0

      const salonWithStats: SalonWithDetails = {
        ...data,
        average_rating,
        review_count: reviews?.length || 0
      }

      return {
        data: salonWithStats
      }
    } catch (error) {
      console.error('Error fetching salon:', error)
      return {
        error: 'Failed to fetch salon details'
      }
    }
  }

  /**
   * Get salon by ID with full details
   */
  static async getSalonById(id: string): Promise<ApiResponse<SalonWithDetails>> {
    try {
      const { data, error } = await db.salons.getById(id)

      if (error) throw error
      if (!data) return { error: 'Salon not found' }

      // Calculate average rating and review count
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('salon_id', data.id)
        .eq('is_published', true)

      const average_rating = reviews?.length 
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2))
        : 0

      const salonWithStats: SalonWithDetails = {
        ...data,
        average_rating,
        review_count: reviews?.length || 0
      }

      return {
        data: salonWithStats
      }
    } catch (error) {
      console.error('Error fetching salon:', error)
      return {
        error: 'Failed to fetch salon details'
      }
    }
  }

  /**
   * Increment salon view count
   */
  static async incrementViewCount(salonId: string): Promise<ApiResponse<number>> {
    try {
      const { data, error } = await supabase.rpc('increment_salon_view_count', {
        salon_id: salonId
      })

      if (error) throw error

      return {
        data: data || 0
      }
    } catch (error) {
      console.error('Error incrementing view count:', error)
      return {
        error: 'Failed to update view count'
      }
    }
  }

  /**
   * Get popular salons (high ratings, many reviews)
   */
  static async getPopularSalons(limit = 10): Promise<ApiResponse<SalonWithDetails[]>> {
    try {
      let query = supabase
        .from('salons')
        .select(`
          *,
          vendor_tier:vendor_tiers(*),
          reviews!inner(rating, is_published)
        `)
        .eq('is_published', true)
        .eq('reviews.is_published', true)

      const { data, error } = await query

      if (error) throw error

      // Group by salon and calculate stats
      const salonStats: { [key: string]: { salon: any, ratings: number[], count: number } } = {}

      data?.forEach(item => {
        const salonId = item.id
        if (!salonStats[salonId]) {
          salonStats[salonId] = {
            salon: item,
            ratings: [],
            count: 0
          }
        }
        if (item.reviews?.rating) {
          salonStats[salonId].ratings.push(item.reviews.rating)
          salonStats[salonId].count++
        }
      })

      // Calculate averages and sort by popularity
      const salonsWithStats = Object.values(salonStats)
        .map(({ salon, ratings, count }) => ({
          ...salon,
          average_rating: ratings.length ? Number((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2)) : 0,
          review_count: count,
          popularity_score: ratings.length * (ratings.reduce((sum, r) => sum + r, 0) / ratings.length || 0)
        }))
        .filter(salon => salon.review_count >= 3) // Minimum 3 reviews to be considered popular
        .sort((a, b) => b.popularity_score - a.popularity_score)
        .slice(0, limit)

      return {
        data: salonsWithStats
      }
    } catch (error) {
      console.error('Error fetching popular salons:', error)
      return {
        error: 'Failed to fetch popular salons'
      }
    }
  }

  /**
   * Get nearby salons by coordinates
   */
  static async getNearbySalons(
    lat: number, 
    lng: number, 
    radiusKm = 25, 
    limit = 20
  ): Promise<ApiResponse<SalonWithDetails[]>> {
    try {
      const { data, error } = await supabase.rpc('search_salons_by_location', {
        search_lat: lat,
        search_lng: lng,
        search_radius_km: radiusKm,
        limit_count: limit,
        offset_count: 0
      })

      if (error) throw error

      return {
        data: data || []
      }
    } catch (error) {
      console.error('Error fetching nearby salons:', error)
      return {
        error: 'Failed to fetch nearby salons'
      }
    }
  }
}

export default SalonService