import { NextRequest, NextResponse } from 'next/server'
import {sendSMS} from "@/lib/telephony/twilio";

export async function POST(req:NextRequest , res: NextResponse) {
    const formData = await req.formData()


    const to = String(formData.get("To") ?? "");     // Twilio number they dialed/texted
    const from = String(formData.get("From") ?? "");
    const body = formData.get("Body")
    const zipCode = formData.get("FromZip")


    console.log(from, body, zipCode, to)

    await sendSMS(to, from , `Lead at ${ (new Date()).toDateString()}: ${body}`);

    return new Response("OK", { status: 200 })

}