import { motion } from 'framer-motion'
import { CheckCircle, Languages } from 'lucide-react'

interface AmenitiesCardProps {
  parking: boolean
  accepts_walk_ins: boolean
  wheelchair_accessible: boolean
  kid_friendly: boolean
  is_verified: boolean
  languages_spoken: string[]
}

export default function AmenitiesCard({
  parking,
  accepts_walk_ins,
  wheelchair_accessible,
  kid_friendly,
  is_verified,
  languages_spoken
}: AmenitiesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg shadow-card p-6"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
      <div className="space-y-3">
        {parking && (
          <div className="flex items-center text-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span>Parking Available</span>
          </div>
        )}
        {accepts_walk_ins && (
          <div className="flex items-center text-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span>Walk-ins Welcome</span>
          </div>
        )}
        {wheelchair_accessible && (
          <div className="flex items-center text-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span>Wheelchair Accessible</span>
          </div>
        )}
        {kid_friendly && (
          <div className="flex items-center text-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span>Kid Friendly</span>
          </div>
        )}
        {is_verified && (
          <div className="flex items-center text-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span>Verified Business</span>
          </div>
        )}
        
        {/* Languages under amenities */}
        {languages_spoken && languages_spoken.length > 0 && (
          <div className="pt-3 border-t border-gray-200 mt-3">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Languages className="w-4 h-4 mr-2 text-primary-600" />
              Languages Spoken
            </h4>
            <div className="flex flex-wrap gap-2">
              {languages_spoken.map((language, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
