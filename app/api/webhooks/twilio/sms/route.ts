import { NextRequest, NextResponse } from 'next/server'
import {sendSMS} from "@/lib/telephony/twilio";
import {supabaseAdmin} from "../../../../../lib/supabase/supabaseAdmin";
import {Conversation, ConversationInsert, MessageInsert, PhoneNumber} from "../../../../../types/handled";

export async function POST(req:NextRequest , res: NextResponse) {
    const formData = await req.formData()


    const to = String(formData.get("To") ?? "");     // Twilio number they dialed/texted
    const from = String(formData.get("From") ?? "");
    const body = formData.get("Body")
    const zipCode = formData.get("FromZip")


    const {data: phoneData, error: phoneError } = await supabaseAdmin.from("phone_numbers").select("*").eq("number", to).single()

    const phone = phoneData as PhoneNumber;

    if (phoneError) {throw phoneError}

    const {data: org, error: orgErr} = await supabaseAdmin.from("organizations").select("*").eq("id", phone.org_id).single();

    if (orgErr){throw orgErr}

    // const TEMPLATE = `Hey, this is ${}`

    const {data: conversation, error: convoError } = await supabaseAdmin.from("conversations").select("*").eq("caller_number", from).eq("org_id", org.id).maybeSingle();

    if (convoError) {throw convoError}
    console.log("conversation: ", conversation)

    let final_conversation: Conversation;

    final_conversation=conversation;

    if (!conversation){

        // Create Conversation
        const { data: conversation, error: convoError } = await supabaseAdmin
            .from("conversations")
            .insert({
                org_id: org.id,
                caller_name: "UNKNOWN_CALLER",
                created_at: new Date().toISOString(),
                last_message_preview: body,
                status: "new",
                phone_number_id: phone.id,
                caller_number: from,
            } as ConversationInsert)
            .select("*")
            .single();

        final_conversation = conversation;

        if (convoError) {throw convoError}

        console.log("new conversation created: ", conversation);

    }

    console.log("Creating Message");
    const { data: message, error: messageError } = await supabaseAdmin
        .from("messages")
        .insert({
            conversation_id: final_conversation.id,
            sender: "them",
            org_id: org.id,
            delivery_status: "delivered",
            text: body,

        } as MessageInsert)

    if (messageError){throw messageError}



    return new Response("OK", { status: 200 })

}