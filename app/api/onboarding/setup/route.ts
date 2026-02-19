import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'
import { formatE164 } from '@/lib/utils/phone'

export async function POST(request: NextRequest) {
  try {
    const authSupabase = await createClient()

    const {
      data: { user },
    } = await authSupabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      businessName,
      ownerName,
      ownerEmail,
      forwardingNumber,
      trade,
      timezone,
      tonePreset,
    } = body

    if (!businessName || !ownerName || !ownerEmail || !forwardingNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const formattedPhone = formatE164(forwardingNumber)
    if (!formattedPhone) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: businessName,
        owner_name: ownerName,
        owner_email: ownerEmail,
        owner_phone: formattedPhone,
        trade: trade || null,
        timezone: timezone || 'America/New_York',
        tone_preset: tonePreset || 'professional',
      } as any)
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

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      organization_id: (org as any).id,
      role: 'owner',
    } as any)

    if (profileError) {
      logger.error('Failed to create profile', {
        error: profileError.message,
        userId: user.id,
      })
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      )
    }

    logger.info('Successfully completed onboarding setup', {
      organizationId: (org as any).id,
      userId: user.id,
    })

    return NextResponse.json({
      organizationId: (org as any).id,
      forwardToNumber: formattedPhone,
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
