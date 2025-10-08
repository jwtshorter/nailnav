'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, TrendingUp, Users, Eye, Phone, MapPin, Clock, Star, 
  Calendar, Download, Filter, Crown, ArrowUp, ArrowDown, Minus 
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalViews: number
    totalContacts: number
    totalBookings: number
    averageRating: number
    viewsChange: number
    contactsChange: number
    bookingsChange: number
    ratingChange: number
  }
  viewsOverTime: Array<{
    date: string
    views: number
    contacts: number
    bookings: number
  }>
  topServices: Array<{
    name: string
    bookings: number
    revenue: number
    change: number
  }>
  customerInsights: {
    newCustomers: number
    returningCustomers: number
    averageBookingValue: number
    peakHours: Array<{
      hour: number
      bookings: number
    }>
  }
  geographicData: Array<{
    location: string
    views: number
    conversions: number
  }>
  competitorAnalysis: Array<{
    name: string
    rating: number
    priceRange: string
    marketShare: number
  }>
}

interface AdvancedAnalyticsProps {
  salonId: string
  tierName: string
  dateRange: string
  onUpgrade?: () => void
}

export const AdvancedAnalytics = ({ 
  salonId, 
  tierName, 
  dateRange,
  onUpgrade 
}: AdvancedAnalyticsProps) => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'contacts' | 'bookings'>('views')
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    loadAnalyticsData()
  }, [salonId, dateRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Mock data for demonstration - replace with actual API call
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 2847,
          totalContacts: 156,
          totalBookings: 89,
          averageRating: 4.7,
          viewsChange: 12.5,
          contactsChange: -3.2,
          bookingsChange: 8.7,
          ratingChange: 0.2
        },
        viewsOverTime: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 200) + 50,
          contacts: Math.floor(Math.random() * 20) + 5,
          bookings: Math.floor(Math.random() * 10) + 2
        })),
        topServices: [
          { name: 'Gel Manicure', bookings: 45, revenue: 1575, change: 15.2 },
          { name: 'Classic Pedicure', bookings: 32, revenue: 960, change: -2.1 },
          { name: 'Acrylic Full Set', bookings: 28, revenue: 1960, change: 22.8 },
          { name: 'Nail Art', bookings: 15, revenue: 450, change: 8.3 }
        ],
        customerInsights: {
          newCustomers: 67,
          returningCustomers: 43,
          averageBookingValue: 65,
          peakHours: [
            { hour: 9, bookings: 3 },
            { hour: 10, bookings: 8 },
            { hour: 11, bookings: 12 },
            { hour: 12, bookings: 15 },
            { hour: 13, bookings: 18 },
            { hour: 14, bookings: 22 },
            { hour: 15, bookings: 25 },
            { hour: 16, bookings: 20 },
            { hour: 17, bookings: 16 },
            { hour: 18, bookings: 10 }
          ]
        },
        geographicData: [
          { location: 'Downtown', views: 856, conversions: 34 },
          { location: 'Suburbs North', views: 642, conversions: 28 },
          { location: 'Suburbs South', views: 534, conversions: 19 },
          { location: 'East District', views: 423, conversions: 15 },
          { location: 'West District', views: 392, conversions: 12 }
        ],
        competitorAnalysis: [
          { name: 'Luxury Nails Spa', rating: 4.8, priceRange: '$$$', marketShare: 24 },
          { name: 'Quick Nails Express', rating: 4.2, priceRange: '$', marketShare: 18 },
          { name: 'Elegant Nail Studio', rating: 4.6, priceRange: '$$', marketShare: 15 },
          { name: 'Premium Nail Bar', rating: 4.5, priceRange: '$$$', marketShare: 12 }
        ]
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setData(mockData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    setExportLoading(true)
    try {
      // Create CSV data
      const csvData = [
        ['Date', 'Views', 'Contacts', 'Bookings'],
        ...data!.viewsOverTime.map(item => [
          item.date,
          item.views.toString(),
          item.contacts.toString(),
          item.bookings.toString()
        ])
      ]

      const csvContent = csvData.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-${salonId}-${dateRange}.csv`
      link.click()
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export data')
    } finally {
      setExportLoading(false)
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  // Check if analytics are available for this tier
  const hasAnalytics = tierName === 'premium' || tierName === 'featured'
  const hasAdvancedAnalytics = tierName === 'featured'

  if (!hasAnalytics) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Advanced Analytics
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get detailed insights about your salon's performance, customer behavior, and market position with our premium analytics suite.
          </p>
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Crown className="w-5 h-5" />
              <span>Upgrade to Premium</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <p className="text-gray-600">Failed to load analytics data</p>
          <button
            onClick={loadAnalyticsData}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          {hasAdvancedAnalytics && <Crown className="w-5 h-5 text-yellow-500" />}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportData}
            disabled={exportLoading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exportLoading ? 'Exporting...' : 'Export Data'}</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            {getChangeIcon(data.overview.viewsChange)}
            <span className={`ml-1 ${getChangeColor(data.overview.viewsChange)}`}>
              {Math.abs(data.overview.viewsChange)}% vs last period
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.totalContacts.toLocaleString()}</p>
            </div>
            <Phone className="w-8 h-8 text-green-500" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            {getChangeIcon(data.overview.contactsChange)}
            <span className={`ml-1 ${getChangeColor(data.overview.contactsChange)}`}>
              {Math.abs(data.overview.contactsChange)}% vs last period
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.totalBookings.toLocaleString()}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            {getChangeIcon(data.overview.bookingsChange)}
            <span className={`ml-1 ${getChangeColor(data.overview.bookingsChange)}`}>
              {Math.abs(data.overview.bookingsChange)}% vs last period
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.averageRating.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            {getChangeIcon(data.overview.ratingChange)}
            <span className={`ml-1 ${getChangeColor(data.overview.ratingChange)}`}>
              {Math.abs(data.overview.ratingChange).toFixed(1)} vs last period
            </span>
          </div>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="views">Views</option>
              <option value="contacts">Contacts</option>
              <option value="bookings">Bookings</option>
            </select>
          </div>
        </div>
        
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would be implemented here with a charting library like Chart.js or Recharts</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
          <div className="space-y-4">
            {data.topServices.map((service, index) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">{service.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {service.bookings} bookings
                  </p>
                  <div className="flex items-center text-sm">
                    {getChangeIcon(service.change)}
                    <span className={`ml-1 ${getChangeColor(service.change)}`}>
                      {Math.abs(service.change)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Geographic Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Insights</h3>
          <div className="space-y-4">
            {data.geographicData.map((location, index) => (
              <div key={location.location} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{location.location}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {location.views} views
                  </p>
                  <p className="text-xs text-gray-600">
                    {((location.conversions / location.views) * 100).toFixed(1)}% conversion
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Advanced Analytics (Featured Tier Only) */}
      {hasAdvancedAnalytics ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Crown className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Competitive Analysis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Competitor</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Rating</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Price Range</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Market Share</th>
                </tr>
              </thead>
              <tbody>
                {data.competitorAnalysis.map((competitor) => (
                  <tr key={competitor.name} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{competitor.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{competitor.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{competitor.priceRange}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${competitor.marketShare}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{competitor.marketShare}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6"
        >
          <div className="text-center">
            <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unlock Advanced Analytics
            </h3>
            <p className="text-gray-600 mb-4">
              Get competitive analysis, customer journey mapping, and market insights with Featured tier.
            </p>
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upgrade to Featured
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdvancedAnalytics