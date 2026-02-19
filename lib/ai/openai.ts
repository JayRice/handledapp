import OpenAI from 'openai'
import { logger } from '@/lib/utils/logger'
import { getFallbackTemplate } from './templates'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const AI_TIMEOUT = 5000

interface GenerateMessageOptions {
  businessName: string
  trade?: string
  tonePreset: 'professional' | 'friendly'
  messageType: 'initial' | 'followup_1' | 'followup_2'
}

export async function generateMessage(options: GenerateMessageOptions): Promise<string> {
  try {
    const systemPrompt = `You are an AI assistant helping a ${options.trade || 'service'} business respond to missed calls via SMS. Generate a brief, ${options.tonePreset} text message (max 160 characters) that asks what the caller needs help with and their ZIP code.`

    const userPrompt = getPromptForType(options.messageType, options.businessName)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT)

    const completion = await openai.chat.completions.create(
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      { signal: controller.signal }
    )

    clearTimeout(timeoutId)

    const generatedMessage = completion.choices[0]?.message?.content?.trim()

    if (!generatedMessage) {
      throw new Error('Empty response from OpenAI')
    }

    logger.info('Generated message with AI', {
      messageType: options.messageType,
      length: generatedMessage.length,
    })

    return generatedMessage
  } catch (error) {
    logger.warn('AI generation failed, using fallback template', {
      error: error instanceof Error ? error.message : 'Unknown error',
      messageType: options.messageType,
    })

    return getFallbackTemplate(options.messageType, options.tonePreset, options.businessName)
  }
}

function getPromptForType(type: string, businessName: string): string {
  switch (type) {
    case 'initial':
      return `Generate a message for ${businessName} asking what service they need and their ZIP code.`
    case 'followup_1':
      return `Generate a 2-hour follow-up message asking if they still need help.`
    case 'followup_2':
      return `Generate a final check-in message for the next business morning.`
    default:
      return `Generate a helpful service business message.`
  }
}

interface ClassifyIntentResult {
  serviceType?: string
  urgency: 'low' | 'medium' | 'high'
  zipCode?: string
  isEmergency: boolean
  summary?: string
}

export async function classifyIntent(
  messageHistory: string[],
  trade?: string
): Promise<ClassifyIntentResult> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT)

    const systemPrompt = `You are analyzing customer messages for a ${trade || 'service'} business. Extract: service type, urgency level, ZIP code if mentioned, and whether it's an emergency. Respond in JSON format.`

    const completion = await openai.chat.completions.create(
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Analyze these messages:\n${messageHistory.join('\n')}\n\nRespond with JSON: {"serviceType": "string", "urgency": "low|medium|high", "zipCode": "string", "isEmergency": boolean, "summary": "brief summary"}`,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 150,
      },
      { signal: controller.signal }
    )

    clearTimeout(timeoutId)

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')

    logger.info('Classified intent with AI', {
      urgency: result.urgency,
      isEmergency: result.isEmergency,
    })

    return {
      serviceType: result.serviceType,
      urgency: result.urgency || 'medium',
      zipCode: result.zipCode,
      isEmergency: result.isEmergency || false,
      summary: result.summary,
    }
  } catch (error) {
    logger.warn('AI classification failed, using defaults', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    return {
      urgency: 'medium',
      isEmergency: detectEmergencyKeywords(messageHistory.join(' ')),
    }
  }
}

export function detectEmergencyKeywords(text: string): boolean {
  const emergencyKeywords = [
    'no heat',
    'no ac',
    'no air',
    'leak',
    'flooding',
    'flood',
    'burst pipe',
    'burst',
    'gas smell',
    'smell gas',
    'sparking',
    'smoke',
    'emergency',
    'urgent',
    'asap',
    'immediately',
  ]

  const lowerText = text.toLowerCase()
  return emergencyKeywords.some((keyword) => lowerText.includes(keyword))
}
