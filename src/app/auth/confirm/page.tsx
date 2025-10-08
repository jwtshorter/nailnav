'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function handleEmailConfirmation() {
      try {
        console.log('Processing email confirmation...')
        
        // Get URL parameters (both hash and query string)
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        
        // Try to get token and type from either URL params or hash
        let token = urlParams.get('token') || hashParams.get('access_token')
        let type = urlParams.get('type') || hashParams.get('type')
        let refreshToken = hashParams.get('refresh_token')
        
        console.log('URL params:', { token: token?.substring(0, 20) + '...', type, refreshToken: refreshToken?.substring(0, 20) + '...' })
        
        if (type === 'signup' && token && refreshToken) {
          console.log('Processing signup confirmation with tokens')
          
          // Set the session using the tokens from email verification
          const { data, error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: refreshToken
          })

          if (error) {
            throw error
          }

          setStatus('success')
          setMessage(`Email verified successfully! Welcome ${data.user?.email}`)
          
          // Redirect to appropriate dashboard
          setTimeout(() => {
            // Check if user is admin
            checkUserTypeAndRedirect(data.user)
          }, 500)
          
        } else if (type === 'email_change' || type === 'signup') {
          console.log('Processing email confirmation via token exchange')
          
          // Try the exchangeCodeForSession method for newer Supabase versions
          if (token) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(token)
            
            if (error) {
              throw error
            }
            
            setStatus('success')
            setMessage(`Email verified successfully! Welcome ${data.user?.email}`)
            
            setTimeout(() => {
              checkUserTypeAndRedirect(data.user)
            }, 500)
          } else {
            throw new Error('No verification token found')
          }
        } else {
          throw new Error('Invalid confirmation link or missing parameters')
        }
      } catch (error: any) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage(error.message || 'Email verification failed. The link may be expired or invalid.')
      }
    }

    handleEmailConfirmation()
  }, [])

  const checkUserTypeAndRedirect = async (user: any) => {
    try {
      // Check if user is admin
      const { data: adminApp } = await supabase
        .from('vendor_applications')
        .select('salon_name, status')
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .single()
      
      if (adminApp && adminApp.salon_name?.toLowerCase().includes('admin') && adminApp.status === 'approved') {
        window.location.href = '/admin/dashboard'
      } else {
        window.location.href = '/vendor/dashboard'
      }
    } catch (error) {
      console.log('Could not determine user type, defaulting to vendor dashboard')
      window.location.href = '/vendor/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Confirming Email...
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email Confirmed!
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
                Redirecting automatically...
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Confirmation Failed
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