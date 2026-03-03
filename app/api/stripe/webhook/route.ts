import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/stripe"
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin"
import Stripe from "stripe"

type InvoiceLoose = Stripe.Invoice & {
    subscription?: string | Stripe.Subscription | null
    lines?: { data?: any[] }
}

function getSubscriptionIdFromInvoice(invoice: InvoiceLoose) {
    const direct =
        typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id

    if (direct) return direct

    // fallback: try invoice lines
    const line = invoice.lines?.data?.find((l) => l?.subscription)
    const sub = line?.subscription
    return typeof sub === "string" ? sub : sub?.id ?? null
}
function mapStripeStatus(status: Stripe.Subscription.Status) {
    // Map to your billing_status enum values
    // Adjust these strings to match your Database enum exactly.
    switch (status) {
        case "trialing":
        case "active":
        case "past_due":
        case "canceled":
        case "unpaid":
        case "incomplete":
        case "incomplete_expired":
        case "paused":
            return status
        default:
            return "canceled"
    }
}

export async function POST(req: Request) {
    const sig = req.headers.get("stripe-signature")
    if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })

    const rawBody = await req.text()

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error("Webhook signature verify failed:", err?.message)
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const sb = supabaseAdmin

    try {
        switch (event.type) {
            // 1) Initial link / safety sync
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session

                const orgId =
                    (session.metadata?.org_id as string | undefined) ||
                    (session.subscription && typeof session.subscription === "string"
                        ? undefined
                        : undefined)

                // org_id should always be in metadata (we set it in checkout route)
                if (!orgId) break

                // persist stripe ids
                const stripeCustomerId =
                    typeof session.customer === "string" ? session.customer : session.customer?.id
                const stripeSubscriptionId =
                    typeof session.subscription === "string" ? session.subscription : session.subscription?.id

                await sb.from("billing").upsert({
                    org_id: orgId,
                    stripe_customer_id: stripeCustomerId ?? null,
                    stripe_subscription_id: stripeSubscriptionId ?? null,
                    updated_at: new Date().toISOString(),
                } as any)

                break
            }

            // 2) Subscription truth (created/updated/deleted)
            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const sub = event.data.object as Stripe.Subscription

                const orgId = (sub.metadata?.org_id as string | undefined) || null
                if (!orgId) break

                const priceId = sub.items.data[0]?.price?.id ?? null
                const subItemId = sub.items.data[0]?.id ?? null

                const currentPeriodEnd =
                    typeof (sub as any).current_period_end === "number"
                        ? new Date((sub as any).current_period_end * 1000).toISOString()
                        : null

                await sb.from("billing").upsert({
                    org_id: orgId,
                    stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
                    stripe_subscription_id: sub.id,
                    stripe_price_id: priceId,
                    stripe_subscription_item_id: subItemId,
                    status: mapStripeStatus(sub.status) as any,
                    cancel_at_period_end: sub.cancel_at_period_end ?? false,
                    trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
                    current_period_end: currentPeriodEnd,
                    canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
                    updated_at: new Date().toISOString(),
                } as any)

                break
            }

            // 3) Payment succeeded -> keep active (useful if status lags)
            case "invoice.payment_succeeded": {
                const invoice = event.data.object as Stripe.Invoice
                const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id
                if (!subId) break

                // Find org via subscription id
                const { data: billing, error } = await sb
                    .from("billing")
                    .select("org_id")
                    .eq("stripe_subscription_id", subId)
                    .maybeSingle()

                if (error) throw error
                if (!billing?.org_id) break

                // Pull current subscription for accurate status/period end
                const sub = await stripe.subscriptions.retrieve(subId)
                const priceId = sub.items.data[0]?.price?.id ?? null
                const subItemId = sub.items.data[0]?.id ?? null

                const currentPeriodEnd =
                    typeof (sub as any).current_period_end === "number"
                        ? new Date((sub as any).current_period_end * 1000).toISOString()
                        : null

                await sb.from("billing").upsert({
                    org_id: billing.org_id,
                    stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
                    stripe_subscription_id: sub.id,
                    stripe_price_id: priceId,
                    stripe_subscription_item_id: subItemId,
                    status: mapStripeStatus(sub.status) as any,
                    cancel_at_period_end: sub.cancel_at_period_end ?? false,
                    trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
                    current_period_end: currentPeriodEnd,
                    updated_at: new Date().toISOString(),
                } as any)

                break
            }

            // 4) Payment failed -> set past_due (restrict features)
            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice
                const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id
                if (!subId) break

                const { data: billing, error } = await sb
                    .from("billing")
                    .select("org_id")
                    .eq("stripe_subscription_id", subId)
                    .maybeSingle()

                if (error) throw error
                if (!billing?.org_id) break

                await sb.from("billing").upsert({
                    org_id: billing.org_id,
                    status: "past_due" as any,
                    updated_at: new Date().toISOString(),
                } as any)

                break
            }

            default:
                break
        }

        return NextResponse.json({ received: true })
    } catch (err: any) {
        console.error("Webhook handler error:", err)
        // Stripe wants 2xx if you handled; but if your DB failed, returning 500 makes Stripe retry.
        return NextResponse.json({ error: err?.message ?? "Webhook error" }, { status: 500 })
    }
}