import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/stripe"
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin"

export async function POST(req: Request) {
    try {
        const { orgId, priceId } = await req.json()

        if (!orgId || !priceId) {
            return NextResponse.json({ error: "Missing orgId or priceId" }, { status: 400 })
        }

        const sb = supabaseAdmin

        // 1) Fetch existing billing row for org
        const { data: billing, error: billingErr } = await sb
            .from("billing")
            .select("org_id, stripe_customer_id")
            .eq("org_id", orgId)
            .maybeSingle()

        if (billingErr) throw billingErr

        // 2) Create Stripe customer if needed
        let customerId = billing?.stripe_customer_id ?? null

        if (!customerId) {
            const customer = await stripe.customers.create({
                metadata: { org_id: orgId },
            })
            customerId = customer.id

            // upsert billing row
            const { error: upsertErr } = await sb.from("billing").upsert({
                org_id: orgId,
                stripe_customer_id: customerId,
            })
            if (upsertErr) throw upsertErr
        }

        // 3) Create Checkout Session
        const appUrl = process.env.NEXT_PUBLIC_APP_URL!
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: true,
            success_url: `${appUrl}/app/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/app/billing/cancel`,
            subscription_data: {
                metadata: { org_id: orgId },
            },
            metadata: { org_id: orgId },
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 })
    }
}