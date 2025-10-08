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
  Settings,
  LogOut,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface VendorApplication {
  id: string
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
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  admin_notes: string
  created_at: string
  updated_at: string
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<VendorApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      window.location.href = '/vendor/login'
      return
    }

    // Check if user is admin by looking at their vendor application
    const { data: adminApp } = await supabase
      .from('vendor_applications')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'approved')
      .single()

    if (!adminApp || !adminApp.salon_name?.toLowerCase().includes('admin')) {
      // Not an admin, redirect to regular vendor dashboard
      window.location.href = '/vendor/dashboard'
      return
    }

    setCurrentUser({ ...session.user, isAdmin: true })
    await loadVendorApplications()
  }

  const loadVendorApplications = async () => {
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

  const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected', notes: string) => {
    setProcessing(true)
    try {
      const { error } = await supabase
        .from('vendor_applications')
        .update({ 
          status,
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)

      if (error) throw error

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status, admin_notes: notes }
            : app
        )
      )

      alert(`Application ${status} successfully!`)
      setSelectedApplication(null)
      setAdminNotes('')
    } catch (error) {
      console.error('Error updating application:', error)
      alert('Failed to update application. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/vendor/login'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        )
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FileText className="w-3 h-3 mr-1" />
            Draft
          </span>
        )
      default:
        return null
    }
  }

  const getStatusCounts = () => {
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      draft: applications.filter(app => app.status === 'draft').length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">NailNav System Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">{statusCounts.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">{statusCounts.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Vendor Applications</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salon Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{application.salon_name}</div>
                        <div className="text-sm text-gray-500">{application.city}, {application.state}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{application.owner_name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Application Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Review Application</h3>
                <button
                  onClick={() => {setSelectedApplication(null); setAdminNotes('')}}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salon Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.salon_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.owner_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.phone || 'Not provided'}</p>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedApplication.business_address}<br />
                    {selectedApplication.city}, {selectedApplication.state} {selectedApplication.postal_code}<br />
                    {selectedApplication.country}
                  </p>
                </div>

                {/* Website */}
                {selectedApplication.website && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <a 
                      href={selectedApplication.website} 
                      target="_blank" 
                      className="mt-1 text-sm text-primary-600 hover:underline"
                    >
                      {selectedApplication.website}
                    </a>
                  </div>
                )}

                {/* Current Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Status</label>
                  <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                </div>

                {/* Admin Notes */}
                {selectedApplication.admin_notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Previous Admin Notes</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedApplication.admin_notes}</p>
                  </div>
                )}

                {/* New Admin Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Add notes about your decision..."
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  {selectedApplication.status !== 'approved' && (
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', adminNotes)}
                      disabled={processing}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {processing ? 'Processing...' : 'Approve'}
                    </button>
                  )}
                  
                  {selectedApplication.status !== 'rejected' && (
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', adminNotes)}
                      disabled={processing}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {processing ? 'Processing...' : 'Reject'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => {setSelectedApplication(null); setAdminNotes('')}}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}