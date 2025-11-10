# Stripe Payment Integration Guide

Complete guide to integrating Stripe payments for salon subscriptions and featured listings.

---

## Table of Contents
1. [Overview](#overview)
2. [Stripe Account Setup](#stripe-account-setup)
3. [Installation](#installation)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Pricing Plans](#pricing-plans)
7. [Backend Implementation](#backend-implementation)
8. [Frontend Implementation](#frontend-implementation)
9. [Testing](#testing)
10. [Webhook Configuration](#webhook-configuration)
11. [Going Live](#going-live)

---

## Overview

### What We're Building
- **Featured Badge Subscriptions**: $29/month for highlighted salon listings
- **Premium Listings**: $49/month for top placement + extra features
- **One-time Payments**: Option for annual subscriptions at discounted rate
- **Subscription Management**: Allow salons to upgrade/downgrade/cancel

### Stripe Features We'll Use
- **Stripe Checkout**: Pre-built payment page
- **Stripe Customer Portal**: Self-service subscription management
- **Webhooks**: Receive real-time payment events
- **Test Mode**: Safe testing environment

---

## Stripe Account Setup

### Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click "Start now" or "Sign up"
3. Fill in:
   - Email address
   - Full name
   - Country (Australia or USA)
   - Password
4. Verify your email

### Step 2: Access Dashboard

1. Log into https://dashboard.stripe.com
2. You'll start in **Test mode** (toggle in top right)
3. Keep Test mode ON for now

### Step 3: Get API Keys

1. In Stripe Dashboard, click **Developers** → **API keys**
2. You'll see:
   - **Publishable key**: Starts with `pk_test_...` (safe to expose in frontend)
   - **Secret key**: Starts with `sk_test_...` (keep secret, server-side only)
3. Copy both keys

**Important**: 
- Test keys start with `pk_test_` and `sk_test_`
- Live keys start with `pk_live_` and `sk_live_`
- NEVER commit secret keys to git

---

## Installation

### Install Stripe Libraries

```bash
cd /home/user/webapp
npm install stripe @stripe/stripe-js
```

**What these do:**
- `stripe`: Server-side Stripe SDK (for API routes)
- `@stripe/stripe-js`: Client-side Stripe SDK (for frontend)

---

## Environment Configuration

### Add Stripe Keys to `.env.local`

```bash
cd /home/user/webapp
```

Edit `.env.local` and add:

```env
# Stripe Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Your domain (for redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Replace with your actual keys from Stripe Dashboard**

**Important**: 
- Keys starting with `NEXT_PUBLIC_` are exposed to browser
- Other keys are server-only
- Never commit `.env.local` to git (it's in .gitignore)

---

## Database Setup

### Create Subscriptions Table

Run this SQL in Supabase:

```sql
-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id BIGSERIAL PRIMARY KEY,
  salon_id BIGINT REFERENCES public.salons(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL, -- active, canceled, past_due, etc.
  plan_type TEXT NOT NULL, -- featured_badge, premium_listing
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  canceled_at TIMESTAMPTZ,
  trial_end TIMESTAMPTZ
);

-- Payment history table
CREATE TABLE IF NOT EXISTS public.payment_history (
  id BIGSERIAL PRIMARY KEY,
  salon_id BIGINT REFERENCES public.salons(id) ON DELETE CASCADE,
  subscription_id BIGINT REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_invoice_id TEXT,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- succeeded, pending, failed
  payment_method TEXT, -- card, bank, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_subscriptions_salon ON public.subscriptions(salon_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_payment_history_salon ON public.payment_history(salon_id);

-- RLS Policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Salons can view their own subscriptions
CREATE POLICY "Salons can view own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (
    salon_id IN (
      SELECT id FROM salons WHERE user_id = auth.uid()
    )
  );

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Similar policies for payment_history
CREATE POLICY "Salons can view own payment history"
  ON public.payment_history FOR SELECT
  TO authenticated
  USING (
    salon_id IN (
      SELECT id FROM salons WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payment history"
  ON public.payment_history FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();
```

---

## Pricing Plans

### Create Products in Stripe Dashboard

1. Go to **Products** → **Add product**

#### Product 1: Featured Badge

- **Name**: Featured Badge
- **Description**: Stand out with a featured badge on your listing
- **Price**: $29 USD / month (or AUD equivalent)
- **Billing period**: Monthly
- **Click** "Add product"
- **Copy the Price ID**: Starts with `price_...`

#### Product 2: Premium Listing

- **Name**: Premium Listing
- **Description**: Top placement + featured badge + priority support
- **Price**: $49 USD / month (or AUD equivalent)
- **Billing period**: Monthly
- **Click** "Add product"
- **Copy the Price ID**: Starts with `price_...`

### Save Price IDs

Add these to your `.env.local`:

```env
STRIPE_FEATURED_BADGE_PRICE_ID=price_YOUR_FEATURED_ID
STRIPE_PREMIUM_LISTING_PRICE_ID=price_YOUR_PREMIUM_ID
```

---

## Backend Implementation

I'll create all the necessary backend files for you. Here's what we need:

### 1. Stripe Client Initialization

**File**: `src/lib/stripe/server.ts`

```typescript
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})
```

### 2. Checkout Session API

**File**: `src/app/api/stripe/checkout/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { priceId, salonId } = await request.json()

    // Verify user is authenticated
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user owns the salon
    const { data: salon } = await supabase
      .from('salons')
      .select('id, name, email, user_id')
      .eq('id', salonId)
      .single()

    if (!salon || salon.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if customer already exists
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('salon_id', salonId)
      .single()

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: existingSub?.stripe_customer_id,
      customer_email: !existingSub ? salon.email : undefined,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      metadata: {
        salon_id: salonId.toString(),
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          salon_id: salonId.toString(),
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

### 3. Webhook Handler

**File**: `src/app/api/stripe/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSuccess(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const salonId = session.metadata?.salon_id
  
  if (!salonId) return

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  )

  // Create or update subscription record
  await supabase
    .from('subscriptions')
    .upsert({
      salon_id: parseInt(salonId),
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0].price.id,
      status: subscription.status,
      plan_type: getPlanTypeFromPrice(subscription.items.data[0].price.id),
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })

  // Update salon as featured if it's a featured/premium plan
  await supabase
    .from('salons')
    .update({ is_featured: true })
    .eq('id', parseInt(salonId))
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const salonId = subscription.metadata?.salon_id

  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  // Remove featured status
  if (salonId) {
    await supabase
      .from('salons')
      .update({ is_featured: false })
      .eq('id', parseInt(salonId))
  }
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  const subscription = await supabase
    .from('subscriptions')
    .select('salon_id, id')
    .eq('stripe_subscription_id', invoice.subscription as string)
    .single()

  if (!subscription.data) return

  // Record payment
  await supabase.from('payment_history').insert({
    salon_id: subscription.data.salon_id,
    subscription_id: subscription.data.id,
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: invoice.payment_intent as string,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    paid_at: new Date(invoice.status_transitions.paid_at! * 1000).toISOString(),
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Log failed payment - you might want to send email notifications
  console.error('Payment failed for invoice:', invoice.id)
}

function getPlanTypeFromPrice(priceId: string): string {
  if (priceId === process.env.STRIPE_FEATURED_BADGE_PRICE_ID) {
    return 'featured_badge'
  }
  if (priceId === process.env.STRIPE_PREMIUM_LISTING_PRICE_ID) {
    return 'premium_listing'
  }
  return 'unknown'
}
```

### 4. Customer Portal API

**File**: `src/app/api/stripe/portal/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { salonId } = await request.json()

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get subscription with customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('salon_id', salonId)
      .single()

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/vendor/subscription`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
```

---

## Frontend Implementation

### 1. Stripe Client

**File**: `src/lib/stripe/client.ts`

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    )
  }
  return stripePromise
}
```

### 2. Pricing Page

**File**: `src/app/pricing/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { getStripe } from '@/lib/stripe/client'

const plans = [
  {
    name: 'Featured Badge',
    price: '$29',
    period: '/month',
    description: 'Stand out from the competition',
    features: [
      'Featured badge on your listing',
      'Priority in search results',
      'Highlighted in city pages',
      'Badge visible to all visitors',
      'Cancel anytime',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_FEATURED_BADGE_PRICE_ID!,
    popular: true,
  },
  {
    name: 'Premium Listing',
    price: '$49',
    period: '/month',
    description: 'Maximum visibility and features',
    features: [
      'Everything in Featured Badge',
      'Top placement in listings',
      'Featured in homepage carousel',
      'Priority customer support',
      'Advanced analytics',
      'Social media promotion',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_LISTING_PRICE_ID!,
    popular: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId)

      // TODO: Get actual salon ID from user session
      const salonId = 1 // Replace with actual salon ID

      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, salonId }),
      })

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to start subscription. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Get more bookings with featured listings
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                plan.popular ? 'border-2 border-primary-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={loading !== null}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
              >
                {loading === plan.priceId ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>All plans include a 14-day money-back guarantee</p>
          <p className="mt-2">Cancel anytime, no questions asked</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
```

### 3. Success Page

**File**: `src/app/payment/success/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your subscription has been activated. Your listing is now featured!
          </p>

          <div className="space-y-4">
            <a
              href="/vendor/dashboard"
              className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Go to Dashboard
            </a>
            
            <a
              href="/vendor/subscription"
              className="block w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Manage Subscription
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
```

### 4. Cancel Page

**File**: `src/app/payment/cancel/page.tsx`

```typescript
'use client'

import { XCircle } from 'lucide-react'
import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <XCircle className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Canceled
          </h1>
          
          <p className="text-gray-600 mb-8">
            No charges were made. You can try again anytime.
          </p>

          <div className="space-y-4">
            <a
              href="/pricing"
              className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              View Plans Again
            </a>
            
            <a
              href="/"
              className="block w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
```

---

## Testing

### Stripe Test Cards

Use these test card numbers in Test mode:

#### Successful Payments
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

#### Declined Cards
```
Insufficient funds: 4000 0000 0000 9995
Card declined: 4000 0000 0000 0002
Expired card: 4000 0000 0000 0069
Processing error: 4000 0000 0000 0119
```

#### 3D Secure (SCA Testing)
```
Requires auth: 4000 0027 6000 3184
```

### Testing Workflow

#### Test 1: Successful Subscription
1. Go to `/pricing`
2. Click "Subscribe Now" on Featured Badge
3. Use test card: `4242 4242 4242 4242`
4. Complete payment
5. Should redirect to success page
6. Check Stripe Dashboard → Customers (should see new customer)
7. Check Stripe Dashboard → Subscriptions (should see active subscription)
8. Check database → `subscriptions` table (should have new record)

#### Test 2: Failed Payment
1. Go to `/pricing`
2. Click "Subscribe Now"
3. Use declined card: `4000 0000 0000 0002`
4. Should see error message
5. Should NOT create subscription

#### Test 3: Webhook Events
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
4. Make a test payment
5. Watch terminal for webhook events
6. Check database for subscription updates

#### Test 4: Customer Portal
1. Subscribe to a plan (test 1)
2. Go to `/vendor/subscription`
3. Click "Manage Subscription"
4. Should open Stripe Customer Portal
5. Try:
   - Update payment method
   - Cancel subscription
   - Download invoices

#### Test 5: Subscription Cancellation
1. In Customer Portal, cancel subscription
2. Check webhook receives `customer.subscription.deleted`
3. Check database: status should be 'canceled'
4. Check salon: `is_featured` should be false

---

## Webhook Configuration

### Local Testing (Development)

Use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
# Mac: brew install stripe/stripe-cli/stripe
# Windows: Download from https://github.com/stripe/stripe-cli/releases

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# You'll get a webhook secret like: whsec_xxxxx
# Add this to .env.local as STRIPE_WEBHOOK_SECRET
```

### Production Setup

1. Deploy your app to production
2. Get your production webhook URL: `https://yourdomain.com/api/stripe/webhook`
3. In Stripe Dashboard:
   - Go to **Developers** → **Webhooks**
   - Click "Add endpoint"
   - Enter your webhook URL
   - Select events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Click "Add endpoint"
4. Copy the **Signing secret** (starts with `whsec_`)
5. Add to production environment variables as `STRIPE_WEBHOOK_SECRET`

---

## Going Live

### Pre-Launch Checklist

- [ ] Get live API keys from Stripe Dashboard
- [ ] Update `.env.local` with live keys
- [ ] Create live products/prices in Stripe
- [ ] Update price IDs in environment variables
- [ ] Configure live webhook endpoint
- [ ] Test with real card (small amount)
- [ ] Set up webhook monitoring/alerts
- [ ] Configure Stripe email receipts
- [ ] Add terms of service & refund policy
- [ ] Enable Stripe fraud protection (Radar)

### Switch to Live Mode

1. In Stripe Dashboard, toggle from "Test mode" to "Live mode"
2. Get live API keys (start with `pk_live_` and `sk_live_`)
3. Create products in live mode (same as test mode)
4. Update environment variables:

```env
# Production .env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_SECRET
STRIPE_FEATURED_BADGE_PRICE_ID=price_YOUR_LIVE_ID
STRIPE_PREMIUM_LISTING_PRICE_ID=price_YOUR_LIVE_ID
```

### Monitoring

Check these regularly:
- **Stripe Dashboard** → **Payments** (for transactions)
- **Stripe Dashboard** → **Subscriptions** (for active subs)
- **Stripe Dashboard** → **Webhooks** (for webhook delivery)
- **Your database** → `subscriptions` and `payment_history` tables

---

## Troubleshooting

### Common Issues

**Issue**: "No such price"
- **Solution**: Make sure you're using correct price ID for test/live mode

**Issue**: Webhooks not firing
- **Solution**: Check webhook secret is correct, verify endpoint URL is accessible

**Issue**: "Customer already exists"
- **Solution**: This is fine - Stripe reuses customers automatically

**Issue**: Payment succeeds but subscription not created
- **Solution**: Check webhook handler logs, verify database permissions

**Issue**: "Invalid API key"
- **Solution**: Make sure you're using correct key for test/live mode

### Getting Help

- **Stripe Docs**: https://stripe.com/docs
- **Stripe Support**: Dashboard → Help
- **Stripe Community**: https://github.com/stripe/stripe-node/discussions

---

## Summary

You now have:
- ✅ Complete Stripe integration
- ✅ Subscription management
- ✅ Webhook handling
- ✅ Test mode setup
- ✅ Production deployment guide

**Next Steps:**
1. Get Stripe account and API keys
2. Run database migrations
3. Install npm packages
4. Add environment variables
5. Test with test cards
6. Deploy and go live!

---

**Estimated Setup Time**: 2-3 hours
**Difficulty**: Medium
**Stripe Experience Required**: None (this guide is complete)
