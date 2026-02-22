import twilio from 'twilio'
import { logger } from '@/lib/utils/logger'

export function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured')
  }

  return twilio(accountSid, authToken)
}

export interface ProvisionNumberResult {
  phoneNumber: string;
  providerNumberId: string;
}

export async function provisionNumber(areaCode: string): Promise<ProvisionNumberResult> {
  try {
    const client = getTwilioClient()

    const availableNumbers = await client.availablePhoneNumbers('US').local.list({
      areaCode: parseInt(areaCode, 10),
      limit: 1,
    })

    if (!availableNumbers || availableNumbers.length === 0) {
      throw new Error(`No available numbers in area code ${areaCode}`)
    }

    const selectedNumber = availableNumbers[0].phoneNumber

    const purchasedNumber = await client.incomingPhoneNumbers.create({
      phoneNumber: selectedNumber,
      voiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/twilio/voice`,
      voiceMethod: 'POST',
      smsUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/twilio/sms`,
      smsMethod: 'POST',
      statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/twilio/status`,
      statusCallbackMethod: 'POST',
    })

    logger.info('Provisioned Twilio number', {
      phoneNumber: purchasedNumber.phoneNumber,
      sid: purchasedNumber.sid,
    })

    return {
      phoneNumber: purchasedNumber.phoneNumber,
      providerNumberId: purchasedNumber.sid,
    }
  } catch (error) {
    logger.error('Failed to provision Twilio number', {
      error: error instanceof Error ? error.message : 'Unknown error',
      areaCode,
    })
    throw error
  }
}

export async function sendSMS(
  from: string,
  to: string,
  body: string
): Promise<{ messageId: string; status: string }> {
  try {
    const client = getTwilioClient()

    const message = await client.messages.create({
      from,
      to,
      body,
      statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/twilio/status`,
    })

    logger.info('Sent SMS via Twilio', {
      messageId: message.sid,
      from,
      to: to.substring(0, 7) + '***',
    })

    return {
      messageId: message.sid,
      status: message.status,
    }
  } catch (error) {
    logger.error('Failed to send SMS via Twilio', {
      error: error instanceof Error ? error.message : 'Unknown error',
      from,
      to: to.substring(0, 7) + '***',
    })
    throw error
  }
}

export function verifyWebhookSignature(
  signature: string,
  url: string,
  params: Record<string, any>
): boolean {
  try {
    const authToken = process.env.TWILIO_AUTH_TOKEN
    if (!authToken) {
      throw new Error('TWILIO_AUTH_TOKEN not configured')
    }

    const validator = twilio.validateRequest(authToken, signature, url, params)
    return validator
  } catch (error) {
    logger.error('Failed to verify Twilio webhook signature', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return false
  }
}

export function generateVoiceResponse(forwardToNumber: string): string {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${process.env.TWILIO_PHONE_NUMBER || ''}" timeout="30">
    <Number>${forwardToNumber}</Number>
  </Dial>
</Response>`

  return twiml
}
