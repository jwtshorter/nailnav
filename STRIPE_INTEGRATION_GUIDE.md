# Stripe Payment Integration Guide for NailNav

## Overview
This guide provides complete instructions for integrating Stripe payments into your NailNav platform for vendor subscription management.

## Prerequisites
- Stripe Account (https://dashboard.stripe.com)
- Environment variables configured
- Supabase database with vendor tiers

## Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to https://stripe.com and create an account
2. Complete business verification
3. Get your API keys from https://dashboard.stripe.com/apikeys

### 1.2 Get API Keys
```bash
# Test Keys (for development)
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_...
STRIPE_SECRET_KEY_TEST=sk_test_...

# Live Keys (for production)
STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_...
STRIPE_SECRET_KEY_LIVE=sk_live_...
```

### 1.3 Create Products in Stripe Dashboard
```bash
# Premium Tier Product
Product Name: NailNav Premium
Description: Enhanced listing with 10 photos and booking features
Price: $29.99/month
Currency: USD
Billing: Recurring monthly

# Featured Tier Product  
Product Name: NailNav Featured
Description: Top placement with unlimited photos and analytics
Price: $99.99/month
Currency: USD
Billing: Recurring monthly
```

## Step 2: Environment Configuration

### 2.1 Update .env.local
```bash
# Add to your .env.local file
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Product IDs (get from Stripe Dashboard)
STRIPE_PREMIUM_PRICE_ID=price_premium_monthly_id
STRIPE_FEATURED_PRICE_ID=price_featured_monthly_id
```

### 2.2 Install Stripe Dependencies
```bash
cd /home/user/webapp
npm install stripe @stripe/stripe-js
```

## Step 3: Database Schema Updates

### 3.1 Add Subscription Tables
```sql
-- Add to your Supabase database
CREATE TABLE IF NOT EXISTS vendor_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_product_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  status VARCHAR(50) NOT NULL, -- active, canceled, past_due, etc.
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_vendor_subscriptions_vendor_id ON vendor_subscriptions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_subscriptions_stripe_customer_id ON vendor_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_vendor_subscriptions_status ON vendor_subscriptions(status);

-- Add RLS policies
ALTER TABLE vendor_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own subscriptions" ON vendor_subscriptions
  FOR SELECT USING (vendor_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  ));

CREATE POLICY "System can manage all subscriptions" ON vendor_subscriptions
  FOR ALL USING (auth.role() = 'service_role');
```

### 3.2 Add Columns to Salons Table
```sql
-- Add subscription tracking to salons
ALTER TABLE salons ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE salons ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'free';
ALTER TABLE salons ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS photo_limit INTEGER DEFAULT 1;

-- Create index
CREATE INDEX IF NOT EXISTS idx_salons_stripe_customer_id ON salons(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_salons_subscription_status ON salons(subscription_status);
```

## Step 4: Stripe API Routes

### 4.1 Create Checkout Session API Route
Create `/src/app/api/stripe/create-checkout-session/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { priceId, salonId, userId } = await request.json()

    // Get salon details
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('*')
      .eq('id', salonId)
      .eq('owner_id', userId)
      .single()

    if (salonError || !salon) {
      return NextResponse.json({ error: 'Salon not found' }, { status: 404 })
    }

    // Create or get Stripe customer
    let customerId = salon.stripe_customer_id
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: salon.email || undefined,
        name: salon.name,
        metadata: {
          salon_id: salonId,
          user_id: userId,
        }
      })
      customerId = customer.id

      // Update salon with customer ID
      await supabase
        .from('salons')
        .update({ stripe_customer_id: customerId })
        .eq('id', salonId)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/billing`,
      metadata: {
        salon_id: salonId,
        user_id: userId,
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

### 4.2 Create Customer Portal API Route
Create `/src/app/api/stripe/create-portal-session/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { salonId, userId } = await request.json()

    // Get salon with Stripe customer ID
    const { data: salon, error } = await supabase
      .from('salons')
      .select('stripe_customer_id')
      .eq('id', salonId)
      .eq('owner_id', userId)
      .single()

    if (error || !salon?.stripe_customer_id) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: salon.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
```

### 4.3 Create Webhook Handler
Create `/src/app/api/stripe/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const salonId = session.metadata?.salon_id
  if (!salonId) return

  // Update salon subscription status
  await supabase
    .from('salons')
    .update({ 
      subscription_status: 'active',
      stripe_customer_id: session.customer as string
    })
    .eq('id', salonId)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  // Get salon by customer ID
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!salon) return

  // Determine tier based on price
  let tierName = 'free'
  let photoLimit = 1
  
  if (subscription.items.data[0].price.id === process.env.STRIPE_PREMIUM_PRICE_ID) {
    tierName = 'premium'
    photoLimit = 10
  } else if (subscription.items.data[0].price.id === process.env.STRIPE_FEATURED_PRICE_ID) {
    tierName = 'featured'
    photoLimit = 100
  }

  // Update salon
  await supabase
    .from('salons')
    .update({
      subscription_status: subscription.status,
      subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
      photo_limit: photoLimit
    })
    .eq('id', salon.id)

  // Update tier
  const { data: tier } = await supabase
    .from('vendor_tiers')
    .select('id')
    .eq('name', tierName)
    .single()

  if (tier) {
    await supabase
      .from('salons')
      .update({ tier_id: tier.id })
      .eq('id', salon.id)
  }

  // Upsert subscription record
  await supabase
    .from('vendor_subscriptions')
    .upsert({
      vendor_id: salon.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_product_id: subscription.items.data[0].price.product as string,
      stripe_price_id: subscription.items.data[0].price.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString()
    })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  // Revert salon to free tier
  await supabase
    .from('salons')
    .update({ 
      subscription_status: 'canceled',
      photo_limit: 1
    })
    .eq('stripe_customer_id', customerId)

  // Update subscription record
  await supabase
    .from('vendor_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Handle successful payment (renewal, etc.)
  console.log('Payment succeeded:', invoice.id)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Handle failed payment
  console.log('Payment failed:', invoice.id)
  
  const customerId = invoice.customer as string
  
  // Update salon status to past_due
  await supabase
    .from('salons')
    .update({ subscription_status: 'past_due' })
    .eq('stripe_customer_id', customerId)
}
```

## Step 5: Frontend Integration

### 5.1 Create Stripe Context
Create `/src/contexts/StripeContext.tsx`:

```typescript
'use client'

import { createContext, useContext } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeContextType {
  stripe: Promise<Stripe | null>
}

const StripeContext = createContext<StripeContextType>({ stripe: stripePromise })

export const useStripe = () => useContext(StripeContext)

export const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <StripeContext.Provider value={{ stripe: stripePromise }}>
      {children}
    </StripeContext.Provider>
  )
}
```

### 5.2 Update Billing Page
Update your existing `/src/app/vendor/billing/page.tsx`:

```typescript
// Add to the existing billing page
const handleUpgrade = async (priceId: string) => {
  try {
    setLoading(true)
    
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        salonId: salon.id,
        userId: user.id
      }),
    })

    const { sessionId } = await response.json()
    
    if (sessionId) {
      const stripe = await (await import('@stripe/stripe-js')).loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      )
      
      await stripe?.redirectToCheckout({ sessionId })
    }
  } catch (error) {
    console.error('Upgrade error:', error)
    alert('Failed to start upgrade process')
  } finally {
    setLoading(false)
  }
}

const handleManageBilling = async () => {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        salonId: salon.id,
        userId: user.id
      }),
    })

    const { url } = await response.json()
    
    if (url) {
      window.location.href = url
    }
  } catch (error) {
    console.error('Portal error:', error)
    alert('Failed to open billing portal')
  }
}
```

## Step 6: Webhook Configuration

### 6.1 Set Up Stripe Webhook
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Use URL: `https://your-domain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`  
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy webhook signing secret to your environment variables

## Step 7: Testing

### 7.1 Test Mode Setup
```bash
# Use test API keys
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Test card numbers
# Visa: 4242424242424242
# Visa (debit): 4000056655665556
# Mastercard: 5555555555554444
# Declined: 4000000000000002
```

### 7.2 Test Scenarios
1. **Successful Subscription**: Create subscription with test card
2. **Failed Payment**: Use declined test card
3. **Subscription Changes**: Upgrade/downgrade in Stripe dashboard
4. **Cancellation**: Cancel subscription and verify tier downgrade
5. **Webhook Events**: Check webhook logs in Stripe dashboard

## Step 8: Production Deployment

### 8.1 Switch to Live Keys
```bash
# Update environment variables with live keys
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### 8.2 Security Checklist
- [ ] Webhook endpoint secured with signature verification
- [ ] API keys stored as environment variables only
- [ ] Database access properly secured with RLS
- [ ] Error handling doesn't expose sensitive information
- [ ] Subscription status checked before granting features

## Features Enabled

### Free Tier (1 Photo)
- Basic listing
- Contact information
- 1 photo upload
- Basic search visibility

### Premium Tier ($29.99/month, 10 Photos)
- Enhanced listing
- Up to 10 photos
- Online booking
- Priority search placement
- Review responses

### Featured Tier ($99.99/month, Unlimited Photos)
- Top search placement
- Unlimited photos
- Advanced analytics
- Custom branding
- Calendar integration
- Priority support

This integration provides a complete subscription system with automatic tier management based on payment status.