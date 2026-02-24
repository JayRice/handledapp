// app/api/conversations/[conversationId]/messages/route.ts
import { NextResponse } from "next/server"
import {createSupabaseServerClient} from "@/lib/supabase/server";

export async function GET(
    req: Request,
    ctx: { params: Promise<{ conversationId: string }> }
) {
    const { conversationId } = await ctx.params
    const supabase = await createSupabaseServerClient()

    // 1) Auth
    const { data: auth, error: authError } = await supabase.auth.getUser()
    if (authError || !auth?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2) Org scope (from profile)
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", auth.user.id)
        .single()

    if (profileError || !profile?.org_id) {
        return NextResponse.json({ error: "No org found" }, { status: 400 })
    }

    // 3) Parse query params
    const url = new URL(req.url)
    const limitRaw = url.searchParams.get("limit");
    const before = url.searchParams.get("before") // ISO string, optional

    const limit = (() => {
        const n = Number(limitRaw ?? "50")
        if (!Number.isFinite(n)) return 50
        return Math.max(1, Math.min(200, Math.floor(n)))
    })()

    // 4) Verify conversation belongs to org
    const { data: convo, error: convoError } = await supabase
        .from("conversations")
        .select("id, org_id")
        .eq("id", conversationId)
        .single()

    if (convoError || !convo) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (convo.org_id !== profile.org_id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // 5) Fetch messages (latest first)
    let query = supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(limit)

    if (before) {
        query = query.lt("created_at", before)
    }

    const { data: messages, error: msgError } = await query

    if (msgError) {
        return NextResponse.json({ error: msgError.message }, { status: 500 })
    }

    // 6) Return oldest->newest for easier UI rendering
    const ordered = (messages ?? []).slice().reverse()

    return NextResponse.json(
        {
            conversationId,
            messages: ordered,
            nextCursor:
                ordered.length > 0 ? ordered[0].created_at : null,
        },
        { status: 200 }
    )
}
