import { NextRequest, NextResponse } from 'next/server'
import {createSupabaseServerClient} from "@/lib/supabase/server";
import { supabaseAdmin} from '@/lib/supabase/supabaseAdmin'

import {logger} from "@/lib/utils/logger";

import {Profile} from "@/types/handled"

export async function POST(request: NextRequest){
    try {
        const authSupabase = await createSupabaseServerClient()

        const {
            data: { user },
        } = await authSupabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }



        const body = await request.json()
        const {
            name
        } = body
        if (!name) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }
        const {error} = await supabaseAdmin.from("profiles").insert({
            id: user.id,
            name: name,
            email: user.email,
            phone: user.phone,
            created_at: (new Date()).toISOString(),
        } as Profile);

        if (error){
            logger.error('Failed to create profile', {
                error: error?.message,
                userId: user.id,
            })
            return NextResponse.json(
                { error: 'Failed to create profile' },
                { status: 500 }
            )
        }




        return NextResponse.json({
            ok: true
        }, {status: 200})
    } catch (error) {
        logger.error('Profile setup error', {
            error: error instanceof Error ? error.message : 'Unknown error',
        })

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}