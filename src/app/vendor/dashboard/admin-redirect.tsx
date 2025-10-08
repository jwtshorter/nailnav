'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminRedirectCheck() {
  useEffect(() => {
    async function checkAdminStatus() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Check if user is admin by email - for tlshorter@gmail.com specifically
        if (session.user.email === 'tlshorter@gmail.com') {
          console.log('Detected admin email, redirecting to admin dashboard')
          window.location.href = '/admin/dashboard'
          return
        }
        
        // Check by vendor application
        try {
          const { data: adminApp } = await supabase
            .from('vendor_applications')
            .select('salon_name, status')
            .or(`user_id.eq.${session.user.id},email.eq.${session.user.email}`)
            .single()
          
          if (adminApp && adminApp.salon_name?.toLowerCase().includes('admin') && adminApp.status === 'approved') {
            console.log('Detected admin application, redirecting to admin dashboard')
            window.location.href = '/admin/dashboard'
          }
        } catch (error) {
          console.log('No admin application found')
        }
      }
    }
    
    checkAdminStatus()
  }, [])

  return null // This component doesn't render anything
}