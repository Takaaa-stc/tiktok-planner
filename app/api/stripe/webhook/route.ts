import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan

      if (!userId || !plan) break

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      const periodEnd = subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        plan,
        status: subscription.status,
        current_period_end: periodEnd,
      }, { onConflict: 'user_id' })

      await supabase
        .from('profiles')
        .update({ plan })
        .eq('id', userId)

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.user_id

      if (!userId) break

      const plan = subscription.metadata?.plan || 'free'
      const status = subscription.status

      const updatedPeriodEnd = subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null

      await supabase.from('subscriptions').update({
        plan: status === 'active' ? plan : 'free',
        status,
        current_period_end: updatedPeriodEnd,
      }).eq('stripe_subscription_id', subscription.id)

      if (status === 'active') {
        await supabase
          .from('profiles')
          .update({ plan })
          .eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.user_id

      if (!userId) break

      await supabase.from('subscriptions').update({
        plan: 'free',
        status: 'canceled',
      }).eq('stripe_subscription_id', subscription.id)

      await supabase
        .from('profiles')
        .update({ plan: 'free' })
        .eq('id', userId)

      break
    }
  }

  return NextResponse.json({ received: true })
}
