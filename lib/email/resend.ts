import { Resend } from 'resend'
import { logger } from '@/lib/utils/logger'

const resend = new Resend(process.env.RESEND_API_KEY!)

export interface SendSupportEmailParams {
  organizationId: string
  assignedNumber?: string
  subject: string
  message: string
  fromEmail: string
}

export async function sendSupportEmail(params: SendSupportEmailParams) {
  try {
    const emailContent = `
Organization ID: ${params.organizationId}
${params.assignedNumber ? `Assigned Number: ${params.assignedNumber}` : ''}

From: ${params.fromEmail}

Message:
${params.message}
    `

    await resend.emails.send({
      from: 'Handled Support <support@handledapp.io>',
      to: [process.env.SUPPORT_EMAIL || 'support@handledapp.io'],
      subject: `Support Request: ${params.subject}`,
      text: emailContent,
    })

    logger.info('Sent support email', {
      organizationId: params.organizationId,
      subject: params.subject,
    })
  } catch (error) {
    logger.error('Failed to send support email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      organizationId: params.organizationId,
    })
    throw error
  }
}

export interface SendNotificationEmailParams {
  to: string
  subject: string
  message: string
}

export async function sendNotificationEmail(params: SendNotificationEmailParams) {
  try {
    await resend.emails.send({
      from: 'Handled <notifications@handledapp.io>',
      to: [params.to],
      subject: params.subject,
      text: params.message,
    })

    logger.info('Sent notification email', {
      to: params.to,
      subject: params.subject,
    })
  } catch (error) {
    logger.error('Failed to send notification email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: params.to,
    })
  }
}

export async function sendEmergencyAlert(ownerEmail: string, callerNumber: string, urgency: string) {
  await sendNotificationEmail({
    to: ownerEmail,
    subject: 'URGENT: Emergency Service Request Detected',
    message: `An emergency service request was detected from ${callerNumber}.

Urgency Level: ${urgency}

Please check your Handled inbox immediately and respond to this customer.

View conversation: ${process.env.NEXT_PUBLIC_APP_URL}/app/inbox`,
  })
}

export async function sendBillingFailureAlert(ownerEmail: string, organizationName: string) {
  await sendNotificationEmail({
    to: ownerEmail,
    subject: 'Payment Failed - Action Required',
    message: `Hello,

We were unable to process your payment for ${organizationName}'s Handled subscription.

Please update your payment method to continue using automated follow-ups.

Call forwarding will continue working, but automated SMS responses have been paused until payment is updated.

Update payment: ${process.env.NEXT_PUBLIC_APP_URL}/app/settings/billing

Questions? Reply to this email or contact support@handledapp.io.`,
  })
}
