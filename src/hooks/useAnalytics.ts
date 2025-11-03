import { useCallback } from 'react'

export const useAnalytics = (salonId?: number, salonName?: string) => {
  const trackEvent = useCallback((eventType: 'website_click' | 'phone_click') => {
    // TODO: Send to analytics backend
    console.log('Analytics event:', {
      type: eventType,
      salon_id: salonId,
      salon_name: salonName,
      timestamp: new Date().toISOString()
    })
    
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventType, {
        event_category: 'salon_engagement',
        event_label: salonName,
        value: salonId
      })
    }
  }, [salonId, salonName])

  return { trackEvent }
}
