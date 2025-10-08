'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, TrendingUp, DollarSign, MapPin, Search, Filter, Download,
  Crown, Shield, Eye, Phone, Calendar, Star, AlertTriangle, CheckCircle,
  XCircle, Clock, BarChart3, PieChart, Activity, Settings
} from 'lucide-react'

interface AdminStats {
  totalSalons: number
  activeSalons: number
  premiumSalons: number
  featuredSalons: number
  totalRevenue: number
  monthlyRevenue: number
  totalBookings: number
  totalViews: number
  averageRating: number
  conversionRate: number
}

interface SalonData {
  id: string
  name: string
  owner: string
  tier: 'free' | 'premium' | 'featured'
  status: 'active' | 'pending' | 'suspended'
  revenue: number
  bookings: number
  views: number
  rating: number
  joinDate: string
  lastActive: string
}

interface AdminConsoleProps {
  userRole: 'admin' | 'super_admin'
}

export const AdminConsole = ({ userRole }: AdminConsoleProps) => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [salons, setSalons] = useState<SalonData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'salons' | 'revenue' | 'analytics'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState<'all' | 'free' | 'premium' | 'featured'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all')

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // Mock data for demonstration - replace with actual API calls
      const mockStats: AdminStats = {
        totalSalons: 1247,
        activeSalons: 1189,
        premiumSalons: 342,
        featuredSalons: 89,
        totalRevenue: 156780,
        monthlyRevenue: 18540,
        totalBookings: 8934,
        totalViews: 234561,
        averageRating: 4.6,
        conversionRate: 3.8
      }

      const mockSalons: SalonData[] = Array.from({ length: 50 }, (_, i) => ({
        id: `salon-${i + 1}`,
        name: `Salon ${i + 1}`,
        owner: `Owner ${i + 1}`,
        tier: ['free', 'premium', 'featured'][Math.floor(Math.random() * 3)] as any,
        status: ['active', 'pending', 'suspended'][Math.floor(Math.random() * 3)] as any,
        revenue: Math.floor(Math.random() * 5000),
        bookings: Math.floor(Math.random() * 200),
        views: Math.floor(Math.random() * 1000) + 100,
        rating: 3.5 + Math.random() * 1.5,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }))

      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats(mockStats)
      setSalons(mockSalons)
    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSalons = salons.filter(salon => {
    const matchesSearch = salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salon.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = filterTier === 'all' || salon.tier === filterTier
    const matchesStatus = filterStatus === 'all' || salon.status === filterStatus
    
    return matchesSearch && matchesTier && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'suspended': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'featured': return <Crown className="w-4 h-4 text-yellow-500" />
      case 'premium': return <Shield className="w-4 h-4 text-purple-500" />
      default: return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'featured': return 'bg-yellow-100 text-yellow-800'
      case 'premium': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportData = async () => {
    try {
      const csvData = [
        ['Salon Name', 'Owner', 'Tier', 'Status', 'Revenue', 'Bookings', 'Views', 'Rating', 'Join Date'],
        ...filteredSalons.map(salon => [
          salon.name,
          salon.owner,
          salon.tier,
          salon.status,
          salon.revenue.toString(),
          salon.bookings.toString(),
          salon.views.toString(),
          salon.rating.toFixed(1),
          new Date(salon.joinDate).toLocaleDateString()
        ])
      ]

      const csvContent = csvData.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `salon-data-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export data')
    }
  }

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="mt-6 h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <span>Admin Console</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Platform management and analytics dashboard
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
            {userRole === 'super_admin' ? 'Super Admin' : 'Admin'}
          </span>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'salons', label: 'Salons', icon: Users },
            { id: 'revenue', label: 'Revenue', icon: DollarSign },
            { id: 'analytics', label: 'Analytics', icon: PieChart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Salons</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSalons.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12% this month</span>
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
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+8.3% vs last month</span>
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
                  <p className="text-sm text-gray-600">Premium Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.premiumSalons + stats.featuredSalons}</p>
                </div>
                <Crown className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+15.2% this month</span>
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
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                </div>
                <Activity className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+2.1% this month</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tier Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Free Tier</span>
                  <span className="font-medium">{stats.totalSalons - stats.premiumSalons - stats.featuredSalons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Premium</span>
                  <span className="font-medium text-purple-600">{stats.premiumSalons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Featured</span>
                  <span className="font-medium text-yellow-600">{stats.featuredSalons}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Views</span>
                  <span className="font-medium">{stats.totalViews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-medium">{stats.totalBookings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">{stats.averageRating}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">5 new salon registrations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">3 premium upgrades</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">$2,840 in revenue today</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Salons Tab */}
      {selectedTab === 'salons' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search salons or owners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Tiers</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="featured">Featured</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Salons Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Salon</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tier</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Bookings</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSalons.slice(0, 20).map((salon) => (
                    <tr key={salon.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{salon.name}</div>
                          <div className="text-sm text-gray-600">{salon.owner}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTierColor(salon.tier)}`}>
                          {getTierIcon(salon.tier)}
                          <span className="capitalize">{salon.tier}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(salon.status)}
                          <span className="text-sm capitalize">{salon.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">${salon.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4">{salon.bookings}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{salon.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(salon.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredSalons.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No salons found matching your criteria.</p>
              </div>
            )}
            
            {filteredSalons.length > 20 && (
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing 20 of {filteredSalons.length} results
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {selectedTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">All time</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Recurring</h3>
              <p className="text-3xl font-bold text-blue-600">${stats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">Per month</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average per Salon</h3>
              <p className="text-3xl font-bold text-purple-600">
                ${Math.round(stats.totalRevenue / stats.totalSalons).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">Lifetime value</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Chart</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Revenue visualization would be implemented here</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {selectedTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">User acquisition chart</p>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Engagement metrics</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminConsole