import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: Request) {
    try {
        const { orgId } = await req.json()
        if (!orgId) return NextResponse.json({ error: "Missing orgId" }, { status: 400 })

        const sb = supabaseAdmin()
        const { data: billing, error } = await sb
            .from("billing")
            .select("stripe_customer_id")
            .eq("org_id", orgId)
            .maybeSingle()

        if (error) throw error
        if (!billing?.stripe_customer_id) {
            return NextResponse.json({ error: "No Stripe customer for this org" }, { status: 400 })
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL!
        const portal = await stripe.billingPortal.sessions.create({
            customer: billing.stripe_customer_id,
            return_url: `${appUrl}/app/settings/billing`,
        })

        return NextResponse.json({ url: portal.url })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 })
    }
}