// app/api/conversations/[conversationId]/messages/route.ts
import { NextResponse } from "next/server"
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {Conversation, ConversationInsert, MessageInsert} from "@/types/handled";
import {supabaseAdmin} from "@/lib/supabase/supabaseAdmin";
import {sendSMS} from "@/lib/telephony/twilio";

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

        const { data: message, error: messageError } = await supabaseAdmin
            .from("messages")
            .insert({
                conversation_id: conversation.id,
                sender: "us",
                org_id:  conversation.org_id,
                delivery_status: "delivered",
                text: input_message,
            } as MessageInsert);



        return NextResponse.json({
                ok: true,
                message: input_message,
                reference_key
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
