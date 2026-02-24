import { NextRequest } from "next/server";
import twilio from "twilio";
import {supabaseAdmin} from "@/lib/supabase/supabaseAdmin"
import {PhoneNumber} from "@/types/handled";
export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();

        const from = String(form.get("From") ?? "");
        // twillio phone
        const called = String(form.get("To") ?? "");
        console.log("twilio num:", called)


        const {data, error } = await supabaseAdmin.from("phone_numbers").select("*").eq("number", called).single()
        const phone = data as PhoneNumber;
        if (error) {throw error}
        const org_id = phone.org_id;

        console.log("org_id: ", org_id);



        const VoiceResponse = twilio.twiml.VoiceResponse;
        const twiml = new VoiceResponse();
        // tries to dial organizations phone, timeout in 20 seconds
        const dial = twiml.dial({
            timeout: 3, // seconds to ring business
            callerId: called,
            action: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/twilio/voice/dial-action`,
            method: "POST",
        });

        console.log("forward to: ", phone.forward_to_number)
        dial.number(phone.forward_to_number);

        // Return XML
        return new Response(twiml.toString(), {
            status: 200,
            headers: { "Content-Type": "text/xml" },
        });
    }catch(error){
        console.error(error);

    }
}
