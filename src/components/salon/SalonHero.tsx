import { CheckCircle, MapPin, Phone, Globe, ExternalLink, Navigation as NavigationIcon } from 'lucide-react'
import { renderStars } from '@/lib/utils/renderStars'

interface SalonHeroProps {
  salon: {
    name: string
    is_verified: boolean
    average_rating: number
    rating: number
    review_count: number
    address: string
    city: string
    state: string
    website?: string
    phone?: string
    cover_image_url?: string
  }
  defaultHeaderImage: string
  onWebsiteClick: () => void
  onPhoneClick: () => void
  onBack: () => void
}

export default function SalonHero({ salon, defaultHeaderImage, onWebsiteClick, onPhoneClick, onBack }: SalonHeroProps) {
  return (
    <div 
      className="relative bg-cover bg-center text-white py-16"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${salon.cover_image_url || defaultHeaderImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4">
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-white hover:text-primary-100 transition-colors"
        >
          <NavigationIcon className="w-5 h-5 mr-2 transform rotate-180" />
          Back
        </button>

        <div className="max-w-4xl">
          <div className="flex items-center mb-2">
            <h1 className="text-3xl md:text-4xl font-bold mr-3">{salon.name}</h1>
            {salon.is_verified && (
              <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <CheckCircle className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            )}
          </div>

          <div className="flex items-center mb-4">
            {renderStars(salon.average_rating || salon.rating)}
            <span className="ml-2 text-white text-opacity-90">
              {(salon.average_rating || salon.rating).toFixed(1)} ({salon.review_count} reviews)
            </span>
          </div>

          <div className="flex items-center text-white text-opacity-90 mb-6">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{salon.address}, {salon.city}, {salon.state}</span>
          </div>

          {/* Trackable CTA Buttons (without Claim button - moved to sidebar) */}
          <div className="flex flex-wrap gap-3">
            {salon.website && (
              <a
                href={salon.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onWebsiteClick}
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
              >
                <Globe className="w-5 h-5 mr-2" />
                Visit Website
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
            {salon.phone && (
              <a
                href={`tel:${salon.phone}`}
                onClick={onPhoneClick}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
