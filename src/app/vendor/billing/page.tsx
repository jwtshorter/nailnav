'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  Store, 
  ArrowLeft,
  Crown,
  Star,
  Zap,
  Eye,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  CreditCard,
  Shield,
  Sparkles,
  Target,
  BarChart3,
  Globe,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

interface VendorApplication {
  id: string
  salon_name: string
  business_address: string
  city: string
  state: string
  email: string
  phone?: string
  status: string
  draft_data?: any
}

interface BillingPlan {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  badge?: string
  popular?: boolean
}

const billingPlans: BillingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Listing',
    price: 0,
    interval: 'monthly',
    features: [
      'Basic salon profile',
      'Standard search results',
      'Contact information display',
      'Operating hours',
      'Service menu',
      'Customer reviews'
    ]
  },
  {
    id: 'featured',
    name: 'Featured Listing',
    price: 29,
    interval: 'monthly',
    badge: 'Most Popular',
    popular: true,
    features: [
      'Everything in Basic',
      'Featured in search results',
      'Priority placement',
      'Enhanced profile badge',
      'Photo gallery (up to 10 photos)',
      'Social media links',
      'Customer testimonials section',
      'Basic analytics'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Listing',
    price: 59,
    interval: 'monthly',
    features: [
      'Everything in Featured',
      'Top of search results',
      'Highlighted with special styling',
      'Unlimited photos',
      'Video showcase',
      'Advanced analytics',
      'Customer booking integration',
      'Promotional posts',
      'Priority customer support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'monthly',
    badge: 'Best Value',
    features: [
      'Everything in Premium',
      'Multiple salon locations',
      'Custom branding options',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced reporting dashboard',
      'White-label options'
    ]
  }
]

const addOnServices = [
  {
    id: 'booking-system',
    name: 'Advanced Booking System',
    price: 19,
    interval: 'monthly',
    description: 'Integrated appointment booking with calendar sync, automated reminders, and customer management.',
    features: ['Online appointment booking', 'Calendar synchronization', 'SMS & email reminders', 'Customer database', 'Booking analytics']
  },
  {
    id: 'marketing-boost',
    name: 'Marketing Boost',
    price: 39,
    interval: 'monthly',
    description: 'Enhanced marketing tools to reach more customers and grow your business.',
    features: ['Social media promotion', 'Email marketing campaigns', 'Google Ads integration', 'Customer retention tools', 'Marketing analytics']
  },
  {
    id: 'review-management',
    name: 'Review Management Pro',
    price: 15,
    interval: 'monthly',
    description: 'Advanced review management and reputation monitoring across all platforms.',
    features: ['Review monitoring', 'Response templates', 'Reputation alerts', 'Review analytics', 'Review generation tools']
  }
]

export default function VendorBillingPage() {
  const [application, setApplication] = useState<VendorApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string>('basic')
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    loadVendorData()
  }, [])

  const loadVendorData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      window.location.href = '/vendor/login'
      return
    }

    try {
      let { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error && session.user.email) {
        const { data: dataByEmail, error: emailError } = await supabase
          .from('vendor_applications')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (!emailError && dataByEmail) {
          data = { ...dataByEmail, user_id: session.user.id }
        } else {
          throw emailError || error
        }
      } else if (error) {
        throw error
      }

      setApplication(data)
      
      // Load current billing plan if exists
      if (data.draft_data?.billing_plan) {
        setSelectedPlan(data.draft_data.billing_plan)
      }
      
      if (data.draft_data?.add_ons) {
        setSelectedAddOns(data.draft_data.add_ons)
      }
      
    } catch (error) {
      console.error('Error loading vendor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    const plan = billingPlans.find(p => p.id === selectedPlan)
    const addOnTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOnServices.find(a => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)
    
    const subtotal = (plan?.price || 0) + addOnTotal
    const yearlyDiscount = billingInterval === 'yearly' ? subtotal * 0.2 : 0
    const total = billingInterval === 'yearly' ? subtotal * 12 - yearlyDiscount : subtotal
    
    return {
      subtotal,
      yearlyDiscount,
      total,
      monthlyTotal: total / (billingInterval === 'yearly' ? 12 : 1)
    }
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    )
  }

  const handleCheckout = () => {
    // In a real implementation, this would integrate with Stripe or similar
    alert('Checkout functionality would be implemented here with Stripe/payment processor')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Application Found</h2>
          <a href="/vendor/register" className="text-primary-600 hover:underline">Submit Application</a>
        </div>
      </div>
    )
  }

  const { subtotal, yearlyDiscount, total, monthlyTotal } = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <a 
                href="/vendor/dashboard"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </a>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Billing for</p>
              <p className="font-medium">{application.salon_name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade Your Listing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get more visibility, attract more customers, and grow your nail salon business with our enhanced listing options.
          </p>
          
          {/* Billing Interval Toggle */}
          <div className="flex items-center justify-center mt-8">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingInterval === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingInterval === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {billingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-900">
                  ${billingInterval === 'yearly' ? (plan.price * 12 * 0.8).toFixed(0) : plan.price}
                  <span className="text-lg text-gray-600 font-normal">
                    /{billingInterval === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                {billingInterval === 'yearly' && plan.price > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Save ${(plan.price * 12 * 0.2).toFixed(0)} per year
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedPlan === plan.id
                    ? 'bg-blue-600 text-white'
                    : plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : plan.price === 0 ? 'Current Plan' : 'Select Plan'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Add-on Services */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Add-on Services</h2>
            <p className="text-gray-600">Enhance your listing with additional features and tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOnServices.map((addOn) => (
              <motion.div
                key={addOn.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-lg p-6 ${
                  selectedAddOns.includes(addOn.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{addOn.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ${billingInterval === 'yearly' ? (addOn.price * 12 * 0.8).toFixed(0) : addOn.price}
                    </div>
                    <div className="text-sm text-gray-600">/{billingInterval === 'yearly' ? 'year' : 'month'}</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{addOn.description}</p>

                <ul className="space-y-2 mb-6">
                  {addOn.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleAddOnToggle(addOn.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    selectedAddOns.includes(addOn.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {selectedAddOns.includes(addOn.id) ? 'Added' : 'Add to Plan'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Billing Summary */}
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Billing Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {billingPlans.find(p => p.id === selectedPlan)?.name}
                </span>
                <span className="font-medium">
                  ${billingPlans.find(p => p.id === selectedPlan)?.price || 0}/{billingInterval === 'yearly' ? 'year' : 'month'}
                </span>
              </div>

              {selectedAddOns.map(addOnId => {
                const addOn = addOnServices.find(a => a.id === addOnId)
                return addOn ? (
                  <div key={addOnId} className="flex justify-between">
                    <span className="text-gray-600">{addOn.name}</span>
                    <span className="font-medium">${addOn.price}/{billingInterval === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                ) : null
              })}

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}/{billingInterval === 'yearly' ? 'year' : 'month'}</span>
                </div>

                {billingInterval === 'yearly' && yearlyDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Yearly discount (20%)</span>
                    <span>-${yearlyDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}/{billingInterval === 'yearly' ? 'year' : 'month'}</span>
                </div>

                {billingInterval === 'yearly' && (
                  <p className="text-sm text-gray-600 mt-2">
                    Effective monthly rate: ${monthlyTotal.toFixed(2)}/month
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Checkout</span>
            </button>

            <div className="flex items-center justify-center space-x-4 mt-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Upgrade?</h2>
            <p className="text-gray-600">See how upgraded listings perform better</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3x More Views</h3>
              <p className="text-gray-600">Featured listings get 3 times more profile views than basic listings</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">5x More Inquiries</h3>
              <p className="text-gray-600">Premium listings receive 5 times more customer inquiries and bookings</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Higher Trust</h3>
              <p className="text-gray-600">Featured badges increase customer trust and booking confidence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}