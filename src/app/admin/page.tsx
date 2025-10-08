'use client'

import { useEffect } from 'react'

export default function AdminIndex() {
  useEffect(() => {
    // Redirect to admin dashboard
    window.location.href = '/admin/dashboard'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to admin dashboard...</p>
      </div>
    </div>
  )
}