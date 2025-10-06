'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Users, 
  Store, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Globe,
  Calendar
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface VendorApplication {
  id: string
  user_id: string
  salon_name: string
  business_address: string
  city: string
  state: string
  country: string
  postal_code: string
  owner_name: string
  email: string
  phone: string
  website: string
  status: string
  admin_notes: string
  draft_data: any
  created_at: string
  updated_at: string
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<VendorApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    checkAdminAccess()
    loadApplications()
  }, [])

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      window.location.href = '/admin/login'
      return
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      await supabase.auth.signOut()
      window.location.href = '/admin/login'
    }
  }

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveApplication = async (applicationId: string) => {
    setIsProcessing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Call the approve function
      const { error } = await supabase.rpc('approve_vendor_application', {
        application_id: applicationId,
        admin_user_id: session.user.id
      })

      if (error) throw error

      // Reload applications
      await loadApplications()
      setSelectedApplication(null)
      
    } catch (error) {
      console.error('Error approving application:', error)
      alert('Failed to approve application. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectApplication = async (applicationId: string) => {
    if (!adminNotes.trim()) {
      alert('Please provide a rejection reason.')
      return
    }

    setIsProcessing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Call the reject function
      const { error } = await supabase.rpc('reject_vendor_application', {
        application_id: applicationId,
        admin_user_id: session.user.id,
        rejection_reason: adminNotes
      })

      if (error) throw error

      // Reload applications
      await loadApplications()
      setSelectedApplication(null)
      setAdminNotes('')
      
    } catch (error) {
      console.error('Error rejecting application:', error)
      alert('Failed to reject application. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </span>
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
                <p className="text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
                <p className="text-gray-600">Approved</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {applications.filter(app => app.status === 'rejected').length}
                </p>
                <p className="text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
                <p className="text-gray-600">Total Applications</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Vendor Applications</h2>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Applications</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No applications found.
                  </div>
                ) : (
                  filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedApplication?.id === application.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedApplication(application)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {application.salon_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.owner_name} • {application.email}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {application.city}, {application.state}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Applied {new Date(application.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getStatusBadge(application.status)}
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-1">
            {selectedApplication ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Application Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedApplication.salon_name}</h4>
                    <p className="text-sm text-gray-600">Owner: {selectedApplication.owner_name}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedApplication.email}</span>
                    </div>
                    {selectedApplication.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedApplication.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{selectedApplication.business_address}, {selectedApplication.city}, {selectedApplication.state}</span>
                    </div>
                    {selectedApplication.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a href={selectedApplication.website} target="_blank" className="text-blue-600 hover:underline">
                          {selectedApplication.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Applied {new Date(selectedApplication.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="font-medium text-gray-900 mb-2">Status</p>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                  
                  {selectedApplication.status === 'pending' && (
                    <div className="pt-4 space-y-3">
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add admin notes (required for rejection)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        rows={3}
                      />
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveApplication(selectedApplication.id)}
                          disabled={isProcessing}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectApplication(selectedApplication.id)}
                          disabled={isProcessing || !adminNotes.trim()}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {selectedApplication.admin_notes && (
                    <div className="pt-4 border-t">
                      <p className="font-medium text-gray-900 mb-2">Admin Notes</p>
                      <p className="text-sm text-gray-600">{selectedApplication.admin_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Select an application to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}