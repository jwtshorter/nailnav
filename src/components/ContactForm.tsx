'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MessageSquare, User, Phone, CheckCircle } from 'lucide-react'

interface ContactFormProps {
  salonId: string
  salonName: string
  onSubmitted?: () => void
  className?: string
}

export const ContactForm = ({ 
  salonId, 
  salonName, 
  onSubmitted,
  className = ''
}: ContactFormProps) => {
  const [formData, setFormData] = useState({
    visitor_name: '',
    visitor_email: '',
    visitor_phone: '',
    subject: '',
    message: '',
    service_interest: '',
    preferred_contact_method: 'email' as 'email' | 'phone' | 'either'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Basic validation
    if (!formData.visitor_name.trim() || !formData.visitor_email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.visitor_email)) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salon_id: salonId,
          ...formData
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      setIsSubmitted(true)
      onSubmitted?.()
    } catch (err) {
      console.error('Contact form error:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isSubmitted) {
    return (
      <motion.div 
        className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Message Sent Successfully!
        </h3>
        <p className="text-green-700">
          Thank you for contacting {salonName}. They will get back to you soon via your preferred contact method.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <MessageSquare className="w-6 h-6 text-primary-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">
          Contact {salonName}
        </h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name */}
        <div>
          <label htmlFor="visitor_name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="visitor_name"
              name="visitor_name"
              value={formData.visitor_name}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="visitor_email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              id="visitor_email"
              name="visitor_email"
              value={formData.visitor_email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="your@email.com"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Phone (Optional) */}
        <div>
          <label htmlFor="visitor_phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-gray-500">(Optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              id="visitor_phone"
              name="visitor_phone"
              value={formData.visitor_phone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        {/* Service Interest */}
        <div>
          <label htmlFor="service_interest" className="block text-sm font-medium text-gray-700 mb-2">
            Service Interest
          </label>
          <select
            id="service_interest"
            name="service_interest"
            value={formData.service_interest}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select a service...</option>
            <option value="manicure">Manicure</option>
            <option value="pedicure">Pedicure</option>
            <option value="gel-nails">Gel Nails</option>
            <option value="acrylic-nails">Acrylic Nails</option>
            <option value="nail-art">Nail Art</option>
            <option value="extensions">Extensions</option>
            <option value="general-inquiry">General Inquiry</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Subject */}
      <div className="mb-4">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Brief subject line..."
        />
      </div>

      {/* Message */}
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical"
          placeholder="Tell us about your needs, questions, or booking request..."
        />
      </div>

      {/* Preferred Contact Method */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How would you like to be contacted?
        </label>
        <div className="flex space-x-4">
          {[
            { value: 'email', label: 'Email', icon: Mail },
            { value: 'phone', label: 'Phone', icon: Phone },
            { value: 'either', label: 'Either', icon: MessageSquare }
          ].map(({ value, label, icon: Icon }) => (
            <label key={value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="preferred_contact_method"
                value={value}
                checked={formData.preferred_contact_method === value}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <Icon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <Send className="w-5 h-5" />
        <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
      </motion.button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Your contact information will only be shared with {salonName} and will not be used for marketing purposes.
      </p>
    </motion.form>
  )
}

export default ContactForm