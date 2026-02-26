import { NextRequest, NextResponse } from 'next/server'
import {sendSMS} from "@/lib/telephony/twilio";
import {supabaseAdmin} from "@/lib/supabase/supabaseAdmin"
import {
    Automation,
    Call,
    CallStatus,
    Conversation,
    ConversationInsert,
    MessageInsert,
    PhoneNumber,
    Trigger
} from "@/types/handled";



function convert_to_status(dialCallStatus: string) : CallStatus {
    switch(dialCallStatus){
        case "no-answer":
            return  "missed"
        case "busy":
            return "busy"
        case "failed":
            return "failed"
        case "canceled":
            return "missed"
    }
    return "answered"
}

export async function POST(req: NextRequest) {

    try{
        const form = await req.formData();
        const rawDuration = form.get("DialCallDuration")
        const parsedDuration = Number(rawDuration)

        console.log(form)
        const callDuration = Number.isFinite(parsedDuration)
            ? parsedDuration
            : 0

        const callStatus = {
            dialCallStatus: String(form.get("DialCallStatus") ?? ""),
            dialSipResponseCode: String(form.get("DialSipResponseCode") ?? ""),
            dialCallSid: String(form.get("DialCallSid") ?? ""),
            callSid: String(form.get("CallSid") ?? ""),
            from: String(form.get("From") ?? ""),
            to: String(form.get("To") ?? ""),
            callDuration: callDuration
        };


        console.log(callStatus);

        const missed_call =  callStatus.dialCallStatus === "no-answer" ||
            callStatus.dialCallStatus === "busy" ||
            callStatus.dialCallStatus === "failed" ||
            callStatus.dialCallStatus === "canceled"


        const {data: phoneData, error: phoneError } = await supabaseAdmin.from("phone_numbers").select("*").eq("number", callStatus.to).single()

        const phone = phoneData as PhoneNumber;

        if (phoneError) {throw phoneError}



        const createdAt = new Date().toISOString();
        const {data: callData, error: callError } = await supabaseAdmin.from("calls").insert({
            phone_number_id: phone.id,
            caller_number: callStatus.from,
            caller_name: phone.label,
            created_at: createdAt,
            duration_seconds: callStatus.callDuration,
            org_id: phone.org_id,
            status: convert_to_status(callStatus.dialCallStatus),
            started_at: createdAt
        } as Call)

        // Dont stop flow but log the error
        if(callError){
            console.error(callError.message)
        }


        // Missed call detection
        if (missed_call) {



            const {data: org, error: orgErr} = await supabaseAdmin.from("organizations").select("*").eq("id", phone.org_id).single();

            if (orgErr){throw orgErr}
            const { data: missedCallAutomation, error: missedCallAutoError } = await supabaseAdmin
                .from("automations")
                .select("*")
                .eq("org_id", org.id)
                .eq("trigger", "missed_call")
                .order("delay_seconds", { ascending: true })
                .limit(1)
                .single();
            if (missedCallAutoError) throw missedCallAutoError;

            if (missedCallAutomation){
                await sendSMS(callStatus.to, callStatus.from, missedCallAutomation.message)
            }


            let final_conversation: Conversation;
            const {data: conversation, error: convoError } = await supabaseAdmin.from("conversations").select("*").eq("caller_number", callStatus.from).maybeSingle();


            if (convoError){throw convoError}

            final_conversation=conversation;
            if (!conversation){


                const { data: firstAuto, error: firstNoReplyEdit } = await supabaseAdmin
                    .from("automations")
                    .select("*")
                    .eq("org_id", org.id)
                    .neq("delay_seconds", 0)
                    .order("delay_seconds", { ascending: true })
                    .limit(1)
                    .single();

                const firstAutomation = firstAuto as Automation;

                const delayMs = firstAutomation.delay_seconds * 1000;

                const nextAutomationAt = new Date(Date.now() + delayMs).toISOString();
                // Create Conversation
                const { data: conversation, error: convoError } = await supabaseAdmin
                    .from("conversations")
                    .insert({
                        org_id: org.id,
                        caller_name: callStatus.from,
                        created_at: new Date().toISOString(),
                        last_message_preview: missedCallAutomation ? missedCallAutomation.message : null,
                        status: "new",
                        phone_number_id: phone.id,
                        caller_number: callStatus.from,
                        next_automation_at: firstAutomation ? nextAutomationAt : null,
                        automation_active: !!firstAutomation,
                        next_automation_id: firstAutomation.id || null
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
                    sender: "us",
                    automation_id: missedCallAutomation.id,
                    org_id: org.id,
                    delivery_status: "delivered",
                    text: missedCallAutomation.message,

                } as MessageInsert)

            if (messageError){throw messageError}

        }

        return new Response("OK", { status: 200 });
    }catch(err){
        console.error(err);
        return new Response("Application Error, call back later.", { status: 500 });

    }

}
