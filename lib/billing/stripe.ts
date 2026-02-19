import Stripe from 'stripe'
import { logger } from '@/lib/utils/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_handled_monthly_78'

export interface CreateSubscriptionParams {
  organizationId: string
  organizationName: string
  email: string
}

export async function createCustomerAndSubscription(params: CreateSubscriptionParams) {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.organizationName,
      metadata: {
        organization_id: params.organizationId,
      },
    })

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: PRICE_ID }],
      trial_period_days: 14,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        organization_id: params.organizationId,
      },
    })

    logger.info('Created Stripe customer and subscription', {
      customerId: customer.id,
      subscriptionId: subscription.id,
      organizationId: params.organizationId,
    })

    return {
      customerId: customer.id,
      subscriptionId: subscription.id,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    }
  } catch (error) {
    logger.error('Failed to create Stripe subscription', {
      error: error instanceof Error ? error.message : 'Unknown error',
      organizationId: params.organizationId,
    })
    throw error
  }
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    logger.info('Created customer portal session', {
      customerId,
      sessionId: session.id,
    })

    return session.url
  } catch (error) {
    logger.error('Failed to create customer portal session', {
      error: error instanceof Error ? error.message : 'Unknown error',
      customerId,
    })
    throw error
  }
}

export function constructWebhookEvent(body: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    return event
  } catch (error) {
    logger.error('Failed to verify Stripe webhook signature', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    throw error
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)

    logger.info('Canceled Stripe subscription', {
      subscriptionId: subscription.id,
    })

    return subscription
  } catch (error) {
    logger.error('Failed to cancel subscription', {
      error: error instanceof Error ? error.message : 'Unknown error',
      subscriptionId,
    })
    throw error
  }
}
