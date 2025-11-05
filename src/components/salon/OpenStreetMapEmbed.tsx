import { motion } from 'framer-motion'

interface OpenStreetMapEmbedProps {
  latitude: number
  longitude: number
  delay?: number
}

export default function OpenStreetMapEmbed({ latitude, longitude, delay = 0.3 }: OpenStreetMapEmbedProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-lg shadow-card p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Where are they located?</h2>
      <div className="aspect-[16/9] h-64 rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`}
          allowFullScreen
        />
      </div>
      <div className="mt-2 text-sm text-center">
        <a 
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700"
        >
          View Larger Map
        </a>
      </div>
    </motion.section>
  )
}
