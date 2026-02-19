type MessageType = 'initial' | 'followup_1' | 'followup_2'
type TonePreset = 'professional' | 'friendly'

const templates = {
  initial: {
    professional: (businessName: string) =>
      `Sorry we missed your call. How can ${businessName} help you today? Please reply with the service you need and your ZIP code.`,
    friendly: (businessName: string) =>
      `Hey! We just missed your call. What can ${businessName} help with? Let us know what you need + your ZIP!`,
  },
  followup_1: {
    professional: () =>
      `Just checking in - do you still need assistance? Reply here and we'll get you scheduled.`,
    friendly: () => `Still need help? Just reply here and we'll get you taken care of!`,
  },
  followup_2: {
    professional: () =>
      `Final check-in - if you still need service, reply here and we'll prioritize your request.`,
    friendly: () => `Last check-in! If you still need us, just reply and we'll make it happen.`,
  },
}

export function getFallbackTemplate(
  messageType: MessageType,
  tonePreset: TonePreset,
  businessName: string = 'our team'
): string {
  const template = templates[messageType]?.[tonePreset]

  if (typeof template === 'function') {
    return template(businessName)
  }

  return templates.initial.professional(businessName)
}
