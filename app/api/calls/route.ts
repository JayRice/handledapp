// app/api/conversations/route.ts
import { NextResponse } from "next/server"
import { createSupabaseServerClient  } from "@/lib/supabase/server"

export async function GET() {
    const supabase = await createSupabaseServerClient()

    // If you're using Supabase auth cookies:
    const { data: auth, error: authError } = await supabase.auth.getUser()
    if (authError || !auth?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Example: get org_id from profiles
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", auth.user.id)
        .single()

    if (profileError || !profile?.org_id) {
        return NextResponse.json({ error: "No org found" }, { status: 400 })
    }

    const { data, error } = await supabase
        .from("calls")
        .select("*")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false })
        .limit(50)

    if (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
}
