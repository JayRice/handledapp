// app/api/conversations/[conversationId]/messages/route.ts
import {Conversation, ConversationInsert, ConversationUpdate, MessageInsert} from "@/types/handled";
import {sendSMS} from "@/lib/telephony/twilio";

import {createSupabaseServerClient} from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {GhostConversationType} from "@/lib/types/ghost";


export async function POST(
    req: Request,
    ctx: { params: Promise<{ conversationId: string }> }
) {

    try {
        const { conversationId } = await ctx.params
        const supabase = await createSupabaseServerClient()

        const body = await req.json();

        const {input_message, reference_key} = body;

        console.log("reference_key: ", reference_key);
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

        // 4) Verify conversation belongs to org
        const { data: convo, error: convoError } = await supabase
            .from("conversations")
            .select("*")
            .eq("id", conversationId)
            .single()

        const conversation : Conversation = convo as Conversation;

        if (convoError || !conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
        }

        if (conversation.org_id !== profile.org_id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const {data: phone, error: phoneError} = await supabase.from("phone_numbers").select("number").eq("id", conversation.phone_number_id).single()


        if (phoneError){throw phoneError}

        console.log(phone, conversation.caller_number)
        if (phone && conversation.caller_number){
            console.log("sending message")
            await sendSMS(phone.number, conversation.caller_number, input_message)
        }

        console.log("Creating Message");

        const { data: message, error: messageError } = await supabase
            .from("messages")
            .insert({
                conversation_id: conversation.id,
                sender: "us",
                org_id:  conversation.org_id,
                delivery_status: "delivered",
                text: input_message,
            } as MessageInsert)
            .select("id, conversation_id").single();



        return NextResponse.json({
                ok: true,
                message: message,
                reference_key,
            },
            { status: 200 })
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {
                ok: true,
                message: "Something went wrong internally, try again later.",
            },
            { status: 500 })
    }

}




function jsonError(message: string, status = 400, details?: unknown) {
    console.error("JSON Error: ", message)
    return NextResponse.json(
        { ok: false, error: message, details: details ?? null },
        { status }
    )
}

function pickAllowedUpdate(body: any): GhostConversationType {
    const allowedKeys: (keyof GhostConversationType)[] = [
         "status",
         "unread",
         "automation_active",
         "metadata",
         "caller_name"
    ]

    const out: GhostConversationType = {}
    for (const k of allowedKeys) {
        if (body?.[k] !== undefined) out[k] = body[k]
    }
    return out
}

export async function PATCH(
    req: Request,
    ctx: { params: Promise<{ conversationId: string }> }
) {
    try {
        const { conversationId } = await ctx.params

        if (!conversationId) return jsonError("Missing conversation id", 400)

        const cookieStore = await cookies()
        const supabase = await createSupabaseServerClient()

        // 1) Auth check
        const { data: authData, error: authErr } = await supabase.auth.getUser()
        if (authErr) return jsonError(authErr.message, 401)
        const user = authData.user
        if (!user) return jsonError("Unauthorized", 401)

        // 2) Parse body
        let body: any = null
        try {
            body = await req.json()
        } catch {
            return jsonError("Invalid JSON body", 400)
        }

        const update = pickAllowedUpdate(body)
        if (Object.keys(update).length === 0) {
            return jsonError("No valid fields provided to update", 400)
        }

        // 3) Get user's org (scoping)
        const { data: profile, error: profileErr } = await supabase
            .from("profiles")
            .select("org_id")
            .eq("id", user.id)
            .single()

        if (profileErr) return jsonError(profileErr.message, 500)
        if (!profile?.org_id) return jsonError("User has no organization", 403)

        // 4) Update scoped to org + id
        const { data: conversation, error: updErr } = await supabase
            .from("conversations")
            .update(update)
            .eq("id", conversationId)
            .eq("org_id", profile.org_id)
            .select("*")
            .single()


        if (updErr) {
            throw updErr.message
        }

        if (update.caller_name){

            console.log("updating call: ", conversation.caller_number, update.caller_name)
            const {data: clData, error: clError} = await supabase
                .from("calls")
                .update({caller_name: update.caller_name})
                .eq("caller_number", conversation.caller_number)

            if (clError) {throw clError.message}
        }




        if (!conversation) return jsonError("Conversation not found", 404)

        return NextResponse.json({ ok: true, data: conversation, conversation_id: conversationId })
    } catch (e: any) {
        console.error(e)
        return jsonError("Server error", 500, e?.message ?? e)
    }
}
