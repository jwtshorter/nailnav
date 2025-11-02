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
  Calendar,
  Trash2,
  BarChart3,
  DollarSign,
  MousePointer,
  Crown,
  Ban,
  TrendingUp
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
  const [activeTab, setActiveTab] = useState<'applications' | 'analytics'>('applications')

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    // Check for demo mode first
    const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || 
                       !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'
    
    if (isDemoMode) {
      // Demo mode - check localStorage for demo session
      const demoSession = localStorage.getItem('demo_user_session')
      if (!demoSession) {
        console.log('No demo session found, redirecting to login')
        window.location.href = '/vendor/login'
        return
      }
      
      try {
        const session = JSON.parse(demoSession)
        if (session.expires_at < Date.now()) {
          console.log('Demo session expired, redirecting to login')
          localStorage.removeItem('demo_user_session')
          window.location.href = '/vendor/login'
          return
        }
        
        // Check if this is an admin user (demo)
        const isAdmin = session.user.email.toLowerCase().includes('admin') || 
                       session.user.email.toLowerCase().includes('support')
        
        if (!isAdmin) {
          console.log('Demo user not admin, redirecting to vendor dashboard')
          window.location.href = '/vendor/dashboard'
          return
        }
        
        // Create demo current user for admin
        const demoUser = {
          ...session.user,
          salon_name: 'Admin Panel',
          status: 'approved',
          role: 'admin'
        }
        
        console.log('Demo mode: Admin access granted')
        setCurrentUser(demoUser)
        loadDemoApplications()
        return
      } catch (error) {
        console.error('Error parsing demo session:', error)
        window.location.href = '/vendor/login'
        return
      }
    }
    
    // Real Supabase mode
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

  const deleteApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to permanently delete this application? This action cannot be undone.')) {
      return
    }

    setProcessing(true)
    try {
      const { error } = await supabase
        .from('vendor_applications')
        .delete()
        .eq('id', applicationId)

      if (error) throw error

      // Update local state
      setApplications(prev => prev.filter(app => app.id !== applicationId))

      alert('Application deleted successfully!')
      setSelectedApplication(null)
      setAdminNotes('')
    } catch (error) {
      console.error('Error deleting application:', error)
      alert('Failed to delete application. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const loadDemoApplications = () => {
    // Create some demo vendor applications for the admin to manage
    const demoApplications = [
      {
        id: 'demo-app-1',
        salon_name: 'Bella Nails Studio',
        business_address: '123 Fashion Ave',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10001',
        owner_name: 'Maria Garcia',
        phone: '(555) 123-4567',
        email: 'maria@bellanails.com',
        website: 'https://bellanails.com',
        status: 'pending' as const,
        admin_notes: '',
        created_at: '2024-01-15',
        updated_at: '2024-01-15'
      },
      {
        id: 'demo-app-2',
        salon_name: 'Luxe Nail Bar',
        business_address: '456 Trendy St',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        postal_code: '90210',
        owner_name: 'Sarah Chen',
        phone: '(555) 987-6543',
        email: 'sarah@luxenailbar.com',
        website: 'https://luxenailbar.com',
        status: 'approved' as const,
        admin_notes: 'Great application with complete documentation.',
        created_at: '2024-01-10',
        updated_at: '2024-01-12'
      },
      {
        id: 'demo-app-3',
        salon_name: 'Nail Art Express',
        business_address: '789 Creative Blvd',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        postal_code: '33101',
        owner_name: 'Jessica Rodriguez',
        phone: '(555) 456-7890',
        email: 'jessica@nailartexpress.com',
        website: 'https://nailartexpress.com',
        status: 'rejected' as const,
        admin_notes: 'Application needs more documentation.',
        created_at: '2024-01-08',
        updated_at: '2024-01-09'
      }
    ]
    
    setApplications(demoApplications)
    setLoading(false)
  }

  const handleSignOut = async () => {
    // Check if demo mode
    const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || 
                       !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'
    
    if (isDemoMode) {
      localStorage.removeItem('demo_user_session')
    } else {
      await supabase.auth.signOut()
    }
    
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

        {/* Applications Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-xl font-semibold text-gray-900">Vendor Applications</h2>
                <p className="mt-2 text-sm text-gray-700">
                  Review and manage vendor applications for the NailNav platform.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                          Salon
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Owner
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Location
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Applied
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {applications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium text-gray-900">{application.salon_name}</div>
                                <div className="text-gray-500">{application.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>
                              <div className="text-gray-900">{application.owner_name}</div>
                              <div className="text-gray-500">{application.phone}</div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>
                              <div className="text-gray-900">{application.city}, {application.state}</div>
                              <div className="text-gray-500">{application.country}</div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {getStatusBadge(application.status)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(application.created_at).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <button
                              onClick={() => setSelectedApplication(application)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Review Application: {selectedApplication.salon_name}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Salon Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.salon_name}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Owner</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.owner_name}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.email}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.phone}</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Business Address</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedApplication.business_address}, {selectedApplication.city}, {selectedApplication.state} {selectedApplication.postal_code}, {selectedApplication.country}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.website || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Status</label>
                        <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700">
                        Admin Notes
                      </label>
                      <textarea
                        id="adminNotes"
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Enter notes about this application..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                      />
                      {selectedApplication.admin_notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          Previous notes: {selectedApplication.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', adminNotes)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Approve'}
                </button>
                
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', adminNotes)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Reject'}
                </button>
                
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => deleteApplication(selectedApplication.id)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-50 text-base font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApplication(null)
                    setAdminNotes('')
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}