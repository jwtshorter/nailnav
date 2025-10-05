// NailNav Frontend JavaScript
// This file handles client-side interactions and enhancements

document.addEventListener('DOMContentLoaded', function() {
  console.log('NailNav app loaded successfully!')
  
  // Initialize PWA features
  initPWA()
  
  // Initialize analytics
  initAnalytics()
  
  // Initialize location services
  initLocationServices()
})

// PWA Installation and Features
function initPWA() {
  // Check if app is running as PWA
  const isPWA = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
  
  if (isPWA) {
    console.log('Running as PWA')
    document.body.classList.add('pwa-mode')
  }
  
  // Handle app update notifications
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      showUpdateNotification()
    })
  }
}

// Analytics and Tracking
function initAnalytics() {
  // Track page views
  trackPageView()
  
  // Track user interactions
  document.addEventListener('click', function(event) {
    const target = event.target.closest('[data-track]')
    if (target) {
      const action = target.getAttribute('data-track')
      trackEvent('user_interaction', { action })
    }
  })
}

// Location Services
function initLocationServices() {
  if ('geolocation' in navigator) {
    // Store location permission status
    navigator.permissions.query({name: 'geolocation'}).then(function(result) {
      console.log('Geolocation permission:', result.state)
      
      result.onchange = function() {
        console.log('Geolocation permission changed to:', this.state)
      }
    })
  }
}

// Utility Functions
function trackPageView() {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_TRACKING_ID', {
      page_title: document.title,
      page_location: window.location.href
    })
  }
}

function trackEvent(eventName, parameters = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters)
  }
  
  // Also send to our analytics API
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event: eventName,
      parameters,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    })
  }).catch(console.error)
}

function showUpdateNotification() {
  const notification = document.createElement('div')
  notification.className = 'fixed bottom-4 left-4 right-4 bg-primary-600 text-white p-4 rounded-lg shadow-lg z-50'
  notification.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-semibold">App Updated!</h3>
        <p class="text-sm opacity-90">New features are available</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white opacity-75">✕</button>
    </div>
  `
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 5000)
}

// Export functions for use in other scripts
window.NailNav = {
  trackEvent,
  trackPageView
}