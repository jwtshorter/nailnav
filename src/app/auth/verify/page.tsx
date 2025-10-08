'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function handleEmailVerification() {
      try {
        // Get the URL hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session using the tokens from email verification
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            throw error
          }

          setStatus('success')
          setMessage(`Email verified successfully! Welcome ${data.user?.email}`)
          
          // Redirect to vendor dashboard after 3 seconds
          setTimeout(() => {
            window.location.href = '/vendor/dashboard'
          }, 3000)
        } else if (type === 'recovery') {
          // Handle password recovery
          setStatus('success')
          setMessage('Password reset verified! You can now set a new password.')
          setTimeout(() => {
            window.location.href = '/auth/reset-password'
          }, 2000)
        } else {
          throw new Error('Invalid verification link or missing parameters')
        }
      } catch (error: any) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage(error.message || 'Email verification failed')
      }
    }

    handleEmailVerification()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Email...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                href="/vendor/dashboard"
                className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <p className="text-sm text-gray-500">
                Redirecting automatically in 3 seconds...
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                href="/vendor/register"
                className="block w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Try Registration Again
              </Link>
              <Link
                href="/vendor/login"
                className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Login Instead
              </Link>
            </div>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}