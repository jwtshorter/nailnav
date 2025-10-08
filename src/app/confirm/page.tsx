'use client'

import { useEffect } from 'react'

export default function ConfirmRedirect() {
  useEffect(() => {
    // Redirect to the proper auth/confirm route with all parameters preserved
    const currentUrl = window.location.href
    const newUrl = currentUrl.replace('/confirm', '/auth/confirm')
    window.location.href = newUrl
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to email confirmation...</p>
      </div>
    </div>
  )
}