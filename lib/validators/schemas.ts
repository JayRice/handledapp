import { z } from 'zod'

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')

export const onboardingSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  ownerEmail: z.string().email('Invalid email address'),
  forwardingNumber: phoneSchema,
  preferredAreaCode: z.string().regex(/^\d{3}$/, 'Area code must be 3 digits').optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  trade: z.enum(['hvac', 'plumbing', 'electrical', 'other']).optional(),
  tonePreset: z.enum(['professional', 'friendly']).default('professional'),
  missedCallEnabled: z.boolean().default(true),
  followupEnabled: z.boolean().default(true),
})

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  body: z.string().min(1, 'Message cannot be empty').max(1600, 'Message too long'),
})

export const updateConversationSchema = z.object({
  conversationId: z.string().uuid(),
  status: z.enum(['new', 'in_progress', 'booked', 'lost', 'spam', 'opted_out']),
})

export const updateAutomationSchema = z.object({
  missedCallEnabled: z.boolean(),
  followupEnabled: z.boolean(),
})

export const updatePhoneSettingsSchema = z.object({
  forwardToNumber: phoneSchema,
})

export const updateBusinessHoursSchema = z.object({
  timezone: z.string(),
  businessHours: z.object({
    mon: z.array(z.string()).optional(),
    tue: z.array(z.string()).optional(),
    wed: z.array(z.string()).optional(),
    thu: z.array(z.string()).optional(),
    fri: z.array(z.string()).optional(),
    sat: z.array(z.string()).optional(),
    sun: z.array(z.string()).optional(),
  }),
})

export const supportTicketSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const provisionNumberSchema = z.object({
  areaCode: z.string().regex(/^\d{3}$/, 'Area code must be 3 digits'),
  forwardToNumber: phoneSchema,
})
