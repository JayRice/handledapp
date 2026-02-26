// app/api/conversations/[conversationId]/messages/route.ts
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type MsgCursor = { created_at: string; id: string }

function parseCursor(raw: string | null): MsgCursor | null {
    if (!raw) return null
    try {
        const json = JSON.parse(Buffer.from(raw, "base64").toString("utf8"))
        if (typeof json?.created_at === "string" && typeof json?.id === "string") {
            return { created_at: json.created_at, id: json.id }
        }
        return null
    } catch {
        return null
    }
}

function clampLimit(limitRaw: string | null, def = 50) {
    const n = Number(limitRaw ?? String(def))
    if (!Number.isFinite(n)) return def
    return Math.max(1, Math.min(200, Math.floor(n)))
}

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

    // 2) Org scope
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
    const limit = clampLimit(url.searchParams.get("limit"), 50)
    const cursor = parseCursor(url.searchParams.get("cursor"))

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

    // 5) Fetch messages (newest first), keyset pagination
    // Order: created_at DESC, id DESC
    let query = supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(limit)

    if (cursor) {
        // (created_at < cursor.created_at) OR (created_at = cursor.created_at AND id < cursor.id)
        query = query.or(
            `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
        )
    }

    const { data: messages, error: msgError } = await query
    if (msgError) {
        return NextResponse.json({ error: msgError.message }, { status: 500 })
    }

    // 6) Return oldest->newest for UI
    const ordered = (messages ?? []).slice().reverse()

    // nextCursor should point to the OLDEST item we just returned (so next page gets older than that)
    const next =
        ordered.length > 0
            ? Buffer.from(
                JSON.stringify({ created_at: ordered[0].created_at, id: ordered[0].id } satisfies MsgCursor),
                "utf8"
            ).toString("base64")
            : null

    return NextResponse.json(
        {
            conversationId,
            messages: ordered,
            nextCursor: next,
        },
        { status: 200 }
    )
}