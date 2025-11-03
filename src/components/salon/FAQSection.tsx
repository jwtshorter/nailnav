import { motion } from 'framer-motion'

interface FAQSectionProps {
  salonName: string
  faqSections: Array<{ question: string; answer: string }>
}

export default function FAQSection({ salonName, faqSections }: FAQSectionProps) {
  if (!faqSections || faqSections.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-card p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About {salonName}</h2>
      <div className="space-y-6">
        {faqSections.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
