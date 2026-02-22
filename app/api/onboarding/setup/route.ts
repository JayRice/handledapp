import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient} from '@/lib/supabase/server'
import { supabaseAdmin} from '@/lib/supabase/supabaseAdmin'

import { logger } from '@/lib/utils/logger'
import { formatE164 } from '@/lib/utils/phone'
import {Organization, Profile} from "@/types/handled";
import {ProfileInsert} from "@/types/db";

export async function POST(request: NextRequest) {
  try {
    const authSupabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await authSupabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log("bodY: ", body)
    const {
      businessName,
      trade,
      timezone,
    } = body.onboardingData

    if (!businessName) {
      console.log("missing required fields")
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // const {data: profile, error: profError} = await authSupabase.from("profiles").select("*").eq("id", user.id);
    //
    // if (profError) {
    //   logger.error('Failed to create profile', {
    //     error: profError.message,
    //     userId: user.id,
    //   })
    //   return NextResponse.json(
    //       { error: 'Failed to create profile' },
    //       { status: 500 }
    //   )
    // }


    const supabase = supabaseAdmin


    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: businessName,
        trade: trade.toLowerCase() || null,
        timezone: timezone || 'America/New_York',
      } as Organization)
      .select()
      .single()

    if (orgError || !org) {
      logger.error('Failed to create organization', {
        error: orgError?.message,
        userId: user.id,
      })
      return NextResponse.json(
        { error: 'Failed to create organization' },
        { status: 500 }
      )
    }

    console.log("org id: ", (org as Organization).id)
    const { error: profileError } = await supabase.from('profiles').update({
      org_id: (org as Organization).id,
      role: 'owner',
    } as ProfileInsert).eq("id", user.id)

    if (profileError) {
      logger.error('Failed to update profile', {
        error: profileError.message,
        userId: user.id,
      })
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    logger.info('Successfully completed onboarding setup', {
      organizationId: (org as any).id,
      userId: user.id,
    })

    return NextResponse.json({
      organizationId: (org as any).id,
    })
  } catch (error) {
    logger.error('Onboarding setup error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
