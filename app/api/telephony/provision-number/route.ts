import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient} from '@/lib/supabase/server'
import { supabaseAdmin} from '@/lib/supabase/supabaseAdmin'
import {getTwilioClient, provisionNumber} from '@/lib/telephony/twilio'
import { provisionNumberSchema } from '@/lib/validators/schemas'
import { logger } from '@/lib/utils/logger'
import {PhoneNumber} from "@/types/handled";
import {OnboardingData} from "@/app/onboarding/page";


const ADMIN_NUMBER = "+19016694100"

export async function POST(request: NextRequest) {
  try {
    const authSupabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await authSupabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json();
    // const validation = provisionNumberSchema.safeParse(body)
    //
    // if (!validation.success) {
    //   return NextResponse.json(
    //     { error: 'Invalid request', details: validation.error.errors },
    //     { status: 400 }
    //   )
    // }

    const {areaCode, forwardTo, countryCode} = body.onboardingData;

    const supabase = supabaseAdmin

    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .maybeSingle()


    const orgId = (profile as any)?.org_id


    if (!orgId) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    //const { phoneNumber, providerNumberId } = await provisionNumber(areaCode)

    const client = getTwilioClient();
    const numbers = await client.incomingPhoneNumbers.list({
      phoneNumber: ADMIN_NUMBER
    });
    const phoneNumber = ADMIN_NUMBER;
    const providerNumberId = numbers[0].sid;


    const { data: phoneRecord, error: phoneError } = await supabase
      .from('phone_numbers')
      .insert({
        org_id: orgId,
        provider: 'twilio',
        provider_number_id: providerNumberId,
        number: phoneNumber,
        forward_to_number: countryCode.trim() + forwardTo.trim(),
        is_active: true,
        created_at: new Date().toISOString(),
        status: "active"
      } as PhoneNumber)
      .select()
      .single()

    if (phoneError || !phoneRecord) {
      logger.error('Failed to store phone number in database', {
        error: phoneError?.message,
        organizationId: orgId,
      })
      return NextResponse.json({ error: 'Failed to save phone number' }, { status: 500 })
    }


    // const { error: automationError } = await supabase.from('automations').insert({
    //   organization_id: orgId,
    //
    // } as any)

    // if (automationError) {
    //   logger.warn('Failed to create automation settings', {
    //     error: automationError.message,
    //     organizationId: orgId,
    //   })
    // }

    logger.info('Successfully provisioned phone number', {
      organizationId: orgId,
      phoneNumber,
    })

    return NextResponse.json({
      phoneNumber,
      phoneNumberId: (phoneRecord as any).id,
    })
  } catch (error) {
    logger.error('Failed to provision phone number', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    return NextResponse.json(
      { error: 'Failed to provision phone number' },
      { status: 500 }
    )
  }
}
