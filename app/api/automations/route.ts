import {NextRequest, NextResponse} from "next/server";

import {supabaseAdmin} from "@/lib/supabase/supabaseAdmin"
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {Automation} from "@/types/handled";
export async function POST(request: NextRequest){

    try {

        const authSupabase = await createSupabaseServerClient()

        const {
            data: { user },
        } = await authSupabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('org_id')
            .eq('id', user.id)
            .maybeSingle()

        const body = await request.json()

        const {data, error } = await supabaseAdmin.from("automations").insert({...body, org_id: profile?.org_id} as Automation);

        if (error) throw error;

        console.log("Automation created: ", data);

        return NextResponse.json({ ok: true }, { status: 200 })

    }catch(error){

        console.log(error)
        return NextResponse.json({ error: 'Something went wrong internally' }, { status: 500 })
    }

}