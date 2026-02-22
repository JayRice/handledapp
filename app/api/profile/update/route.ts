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

        return NextResponse.json({
            ok: true
        }, {status: 200})
    } catch (error) {
        logger.error('Profile updadte error', {
            error: error instanceof Error ? error.message : 'Unknown error',
        })

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}