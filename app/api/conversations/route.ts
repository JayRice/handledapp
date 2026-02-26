// app/api/conversations/route.ts
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type ConvoCursor = { last_message_at: string; id: string }

function parseCursor(raw: string | null): ConvoCursor | null {
    if (!raw) return null
    try {
        const json = JSON.parse(Buffer.from(raw, "base64").toString("utf8"))
        if (typeof json?.last_message_at === "string" && typeof json?.id === "string") {
            return { last_message_at: json.last_message_at, id: json.id }
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

export async function GET(req: Request) {
    const supabase = await createSupabaseServerClient()

    const { data: auth, error: authError } = await supabase.auth.getUser()
    if (authError || !auth?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", auth.user.id)
        .single()

    if (profileError || !profile?.org_id) {
        return NextResponse.json({ error: "No org found" }, { status: 400 })
    }

    const url = new URL(req.url)
    const limit = clampLimit(url.searchParams.get("limit"), 50)
    const cursor = parseCursor(url.searchParams.get("cursor"))

    // Note: if last_message_at can be NULL, decide whether to exclude or push to end.
    // Here we assume it's NOT null for active conversations.
    let query = supabase
        .from("conversations")
        .select("*")
        .eq("org_id", profile.org_id)
        .order("last_message_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(limit)

    if (cursor) {
        // (last_message_at < cursor.last_message_at) OR (last_message_at = cursor.last_message_at AND id < cursor.id)
        query = query.or(
            `last_message_at.lt.${cursor.last_message_at},and(last_message_at.eq.${cursor.last_message_at},id.lt.${cursor.id})`
        )
    }

    const { data: items, error } = await query
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const next =
        items && items.length > 0
            ? Buffer.from(
                JSON.stringify({
                    last_message_at: items[items.length - 1].last_message_at,
                    id: items[items.length - 1].id,
                } satisfies ConvoCursor),
                "utf8"
            ).toString("base64")
            : null

    return NextResponse.json(
        {
            items: items ?? [],
            nextCursor: next,
        },
        { status: 200 }
    )
}