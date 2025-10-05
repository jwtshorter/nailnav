import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata, Viewport } from 'next'
import { TranslationProvider } from '../contexts/TranslationContext'
import { AuthProvider } from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Nail Nav - Find the Perfect Nail Salon',
    default: 'Nail Nav - Find the Perfect Nail Salon Near You'
  },
  description: 'Discover the best nail salons in your area. Compare prices, read reviews, and book appointments at top-rated nail salons. Mobile-first directory for nail care services.',
  keywords: ['nail salon', 'manicure', 'pedicure', 'nail art', 'gel nails', 'acrylic nails', 'beauty salon'],
  authors: [{ name: 'Nail Nav Team' }],
  creator: 'Nail Nav',
  publisher: 'Nail Nav',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nailnav.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
      'vi-VN': '/vi-VN',
    },
  },
  openGraph: {
    title: 'Nail Nav - Find the Perfect Nail Salon Near You',
    description: 'Discover the best nail salons in your area. Compare prices, read reviews, and book appointments.',
    url: 'https://nailnav.com',
    siteName: 'Nail Nav',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nail Nav - Nail Salon Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nail Nav - Find the Perfect Nail Salon Near You',
    description: 'Discover the best nail salons in your area. Compare prices, read reviews, and book appointments.',
    images: ['/twitter-image.jpg'],
    creator: '@nailnavapp',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nail Nav',
    startupImage: [
      {
        url: '/startup-image-768x1024.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'Nail Nav',
    'msapplication-TileColor': '#ec4899',
    'theme-color': '#ec4899',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ec4899' },
    { media: '(prefers-color-scheme: dark)', color: '#db2777' },
  ],
  colorScheme: 'light',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="//supabase.co" />
        
        {/* Tan Garland Font */}
        <link href="https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap" rel="stylesheet" />
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .loading-skeleton {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `
        }} />
      </head>
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        {/* Skip navigation for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>

        {/* Main app container with safe area support */}
        <div className="min-h-full safe-area-top safe-area-bottom safe-area-left safe-area-right">
          <AuthProvider>
            <TranslationProvider>
              {children}
            </TranslationProvider>
          </AuthProvider>
        </div>

        {/* Service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />

        {/* PWA install prompt */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                
                // Show custom install banner
                const installBanner = document.createElement('div');
                installBanner.className = 'pwa-banner';
                installBanner.innerHTML = \`
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-semibold">Install Nail Nav App</h3>
                      <p class="text-sm opacity-90">Get quick access to find nail salons</p>
                    </div>
                    <div class="flex space-x-2">
                      <button id="install-btn" class="bg-white text-primary-600 px-4 py-2 rounded font-medium">Install</button>
                      <button id="dismiss-btn" class="text-white opacity-75">✕</button>
                    </div>
                  </div>
                \`;
                
                document.body.appendChild(installBanner);
                
                document.getElementById('install-btn').addEventListener('click', () => {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then(() => {
                    deferredPrompt = null;
                    installBanner.remove();
                  });
                });
                
                document.getElementById('dismiss-btn').addEventListener('click', () => {
                  installBanner.remove();
                });
              });
            `,
          }}
        />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Nail Nav",
              "description": "Find the perfect nail salon near you",
              "url": "https://nailnav.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://nailnav.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/nailnavapp",
                "https://facebook.com/nailnavapp",
                "https://instagram.com/nailnavapp"
              ]
            }),
          }}
        />
      </body>
    </html>
  )
}