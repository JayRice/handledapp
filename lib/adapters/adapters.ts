// src/lib/adapters.ts
// Clean DB <-> UI adapters for Handled (no UUID hashing).
// Matches your Supabase schema (supabase.ts) + your handled.ts UI types.

import type { Json, Database } from "@/types/supabase"
import type {
  Organization,
  Profile,
  PhoneNumber,
  Call,
  Conversation,
  Message,
  AutomationConfig,
  AutomationStep,
  BillingState,
  UsageState,
  SupportTicket,
  OptOut,
} from "@/types/handled"

type Tables = Database["public"]["Tables"]

type OrganizationsRow = Tables["organizations"]["Row"]
type OrganizationsUpdate = Tables["organizations"]["Update"]

type ProfilesRow = Tables["profiles"]["Row"]
type ProfilesInsert = Tables["profiles"]["Insert"]
type ProfilesUpdate = Tables["profiles"]["Update"]

type PhoneNumbersRow = Tables["phone_numbers"]["Row"]
type PhoneNumbersInsert = Tables["phone_numbers"]["Insert"]
type PhoneNumbersUpdate = Tables["phone_numbers"]["Update"]

type CallsRow = Tables["calls"]["Row"]
type CallsInsert = Tables["calls"]["Insert"]

type ConversationsRow = Tables["conversations"]["Row"]
type ConversationsInsert = Tables["conversations"]["Insert"]
type ConversationsUpdate = Tables["conversations"]["Update"]

type MessagesRow = Tables["messages"]["Row"]
type MessagesInsert = Tables["messages"]["Insert"]

type AutomationsRow = Tables["automations"]["Row"]
type AutomationsInsert = Tables["automations"]["Insert"]
type AutomationsUpdate = Tables["automations"]["Update"]

type BillingRow = Tables["billing"]["Row"]
type BillingUpdate = Tables["billing"]["Update"]

type UsageTrackingRow = Tables["usage_tracking"]["Row"]
type UsageTrackingInsert = Tables["usage_tracking"]["Insert"]

type SupportTicketsRow = Tables["support_tickets"]["Row"]
type SupportTicketsInsert = Tables["support_tickets"]["Insert"]

type OptOutsRow = Tables["opt_outs"]["Row"]
type OptOutsInsert = Tables["opt_outs"]["Insert"]

type ConversationReadsRow = Tables["conversation_reads"]["Row"]

/** -----------------------------
 * Helpers
 * ------------------------------ */
function asRecord(val: Json | null | undefined): Record<string, any> {
  if (val && typeof val === "object" && !Array.isArray(val)) return val as Record<string, any>
  return {}
}

function asIso(val: string | null | undefined, fallback: string): string {
  return val ?? fallback
}

// Convert DB business_hours JSON into UI {open, close, days[]}
function businessHoursDbToUi(bh: Json | null | undefined): Organization["businessHours"] {
  const obj = asRecord(bh)
  const weekdays = ["mon", "tue", "wed", "thu", "fri"]
  const days = weekdays.filter((d) => Array.isArray((obj as any)[d]) && (obj as any)[d].length >= 2)

  const firstDay = days[0] ?? "mon"
  const range = Array.isArray((obj as any)[firstDay]) ? (obj as any)[firstDay] : ["08:00", "17:00"]
  const open = range?.[0] ?? "08:00"
  const close = range?.[1] ?? "17:00"

  return { open, close, days }
}

// Convert UI {open, close, days[]} -> DB json (mon..sun arrays)
function businessHoursUiToDb(bh: Organization["businessHours"]): Json {
  const out: Record<string, any> = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  }
  for (const d of bh.days) out[d] = [bh.open, bh.close]
  return out as Json
}

// unread derivation using conversation_reads (optional but nice)
function deriveUnread(convo: ConversationsRow, read?: ConversationReadsRow | null): boolean {
  if (!convo.last_message_at) return false
  if (!read?.last_read_at) return true
  return new Date(convo.last_message_at).getTime() > new Date(read.last_read_at).getTime()
}

/** -----------------------------
 * Organizations
 * ------------------------------ */
export function fromDbOrganization(row: OrganizationsRow, phoneNumbers: PhoneNumber[] = []): Organization {
  return {
    id: row.id,
    name: row.name,
    trade: row.trade,
    address: row.address ?? undefined,
    timezone: row.timezone,
    businessHours: businessHoursDbToUi(row.business_hours),
    phoneNumbers,
    createdAt: row.created_at,
  }
}

export function toDbOrganizationUpdate(patch: Partial<Organization>): OrganizationsUpdate {
  const u: OrganizationsUpdate = {}
  if (patch.name !== undefined) u.name = patch.name
  if (patch.trade !== undefined) u.trade = patch.trade
  if (patch.address !== undefined) u.address = patch.address ?? null
  if (patch.timezone !== undefined) u.timezone = patch.timezone
  if (patch.businessHours !== undefined) u.business_hours = businessHoursUiToDb(patch.businessHours)
  return u
}

/** -----------------------------
 * Profiles
 * ------------------------------ */
export function fromDbProfile(row: ProfilesRow, plan: Profile["plan"] = "trial"): Profile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url ?? undefined,
    phone: row.phone ?? undefined,
    role: row.role,
    onboardingComplete: row.onboarding_complete,
    orgId: row.org_id,
    plan, // BillingRow.plan is where plan is stored today
    timezone: row.timezone ?? undefined,
    createdAt: row.created_at,
  }
}

// Use with `.upsert(...)` to avoid duplicate key errors for profiles.
export function toDbProfileUpsert(args: {
  id: string
  orgId: string
  email: string
  name?: string
  avatarUrl?: string
  phone?: string
  role?: Profile["role"]
  onboardingComplete?: boolean
  timezone?: string
}): ProfilesInsert {
  return {
    id: args.id,
    org_id: args.orgId,
    email: args.email,
    name: args.name ?? "Owner",
    avatar_url: args.avatarUrl ?? null,
    phone: args.phone ?? null,
    role: args.role ?? "owner",
    onboarding_complete: args.onboardingComplete ?? false,
    timezone: args.timezone ?? null,
  }
}

export function toDbProfileUpdate(patch: Partial<Profile>): ProfilesUpdate {
  const u: ProfilesUpdate = {}
  if (patch.email !== undefined) u.email = patch.email
  if (patch.name !== undefined) u.name = patch.name
  if (patch.avatarUrl !== undefined) u.avatar_url = patch.avatarUrl ?? null
  if (patch.phone !== undefined) u.phone = patch.phone ?? null
  if (patch.role !== undefined) u.role = patch.role
  if (patch.onboardingComplete !== undefined) u.onboarding_complete = patch.onboardingComplete
  if (patch.timezone !== undefined) u.timezone = patch.timezone ?? null
  if (patch.orgId !== undefined) u.org_id = patch.orgId
  return u
}

/** -----------------------------
 * Phone Numbers
 * ------------------------------ */
export function fromDbPhoneNumber(row: PhoneNumbersRow): PhoneNumber {
  return {
    id: row.id,
    number: row.number,
    label: row.label,
    status: row.status,
    provider: row.provider === "twilio" ? "twilio" : "other",
  }
}

export function toDbPhoneNumberInsert(args: {
  orgId: string
  number: string
  forwardToNumber: string
  label?: string
  provider?: string
  providerNumberId?: string | null
  status?: PhoneNumber["status"]
}): PhoneNumbersInsert {
  return {
    org_id: args.orgId,
    number: args.number,
    forward_to_number: args.forwardToNumber,
    label: args.label ?? "Main",
    provider: args.provider ?? "twilio",
    provider_number_id: args.providerNumberId ?? null,
    status: args.status ?? "provisioning",
    is_active: true,
  }
}

export function toDbPhoneNumberUpdate(patch: Partial<PhoneNumber> & { forwardToNumber?: string; providerNumberId?: string | null; isActive?: boolean }): PhoneNumbersUpdate {
  const u: PhoneNumbersUpdate = {}
  if (patch.number !== undefined) u.number = patch.number
  if (patch.label !== undefined) u.label = patch.label
  if (patch.status !== undefined) u.status = patch.status
  if (patch.provider !== undefined) u.provider = patch.provider
  if (patch.forwardToNumber !== undefined) u.forward_to_number = patch.forwardToNumber
  if (patch.providerNumberId !== undefined) u.provider_number_id = patch.providerNumberId
  if (patch.isActive !== undefined) u.is_active = patch.isActive
  return u
}

/** -----------------------------
 * Calls
 * ------------------------------ */
export function fromDbCall(row: CallsRow): Call {
  const type: Call["type"] =
      row.status === "answered" ? "answered" : row.status === "voicemail" ? "voicemail" : "missed"

  return {
    id: row.id,
    caller: row.caller_number ?? "Unknown",
    phone: row.caller_number ?? "",
    date: row.started_at,
    duration: `${row.duration_seconds ?? 0}s`,
    type,
    followUp: "none",
    industry: "service",
  }
}

export function toDbCallInsert(args: {
  orgId: string
  phoneNumberId: string
  callerNumber: string | null
  status: Database["public"]["Enums"]["call_status"]
  startedAt: string
  endedAt?: string | null
  durationSeconds?: number
  providerCallId?: string | null
}): CallsInsert {
  return {
    org_id: args.orgId,
    phone_number_id: args.phoneNumberId,
    caller_number: args.callerNumber,
    status: args.status,
    started_at: args.startedAt,
    ended_at: args.endedAt ?? null,
    duration_seconds: args.durationSeconds ?? 0,
    provider_call_id: args.providerCallId ?? null,
  }
}

/** -----------------------------
 * Conversations
 * ------------------------------ */
export function fromDbConversation(row: ConversationsRow, read?: ConversationReadsRow | null): Conversation {
  const meta = asRecord(row.metadata)

  return {
    id: row.id,
    name: row.caller_name ?? row.caller_number ?? "Caller",
    phone: row.caller_number ?? "",
    lastMessage: row.last_message_preview ?? "",
    time: asIso(row.last_message_at, row.created_at),
    status: row.status,
    unread: deriveUnread(row, read),
    trade: (typeof meta.trade === "string" ? meta.trade : "general"),
  }
}

export function toDbConversationInsert(args: {
  orgId: string
  phoneNumberId: string
  callerNumber?: string | null
  callerName?: string | null
  status?: Database["public"]["Enums"]["conversation_status"]
  metadata?: Record<string, any>
}): ConversationsInsert {
  return {
    org_id: args.orgId,
    phone_number_id: args.phoneNumberId,
    caller_number: args.callerNumber ?? null,
    caller_name: args.callerName ?? null,
    status: args.status ?? "new",
    metadata: (args.metadata ?? {}) as Json,
    last_message_at: null,
    last_message_preview: null,
  }
}

export function toDbConversationUpdate(patch: Partial<Conversation>): ConversationsUpdate {
  const u: ConversationsUpdate = {}
  if (patch.status !== undefined) u.status = patch.status
  if (patch.phone !== undefined) u.caller_number = patch.phone
  if (patch.name !== undefined) u.caller_name = patch.name
  if (patch.lastMessage !== undefined) u.last_message_preview = patch.lastMessage
  if (patch.time !== undefined) u.last_message_at = patch.time
  return u
}

/** -----------------------------
 * Messages
 * ------------------------------ */
export function fromDbMessage(row: MessagesRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    sender: row.sender,
    text: row.text,
    time: row.created_at,
    auto: false,
  }
}

export function toDbMessageInsert(args: {
  orgId: string
  conversationId: string
  sender: Database["public"]["Enums"]["message_sender"]
  text: string
  providerMessageId?: string | null
  deliveryStatus?: string
}): MessagesInsert {
  return {
    org_id: args.orgId,
    conversation_id: args.conversationId,
    sender: args.sender,
    text: args.text,
    provider_message_id: args.providerMessageId ?? null,
    delivery_status: args.deliveryStatus ?? "sent",
  }
}

/** -----------------------------
 * Automations
 * ------------------------------ */
export function fromDbAutomation(row: AutomationsRow): AutomationConfig {
  const enabled = row.missed_call_enabled && row.followups_enabled

  const steps: AutomationStep[] = [
    { id: "step1", type: "sms", message: row.step_1_message, delay: "instant" },
    { id: "step2", type: "sms", message: row.step_2_message, delay: "2_hours" },
    { id: "step3", type: "sms", message: row.step_3_message, delay: "24_hours" },
  ]

  return {
    id: row.id,
    name: "Missed Call Follow-up",
    trigger: "missed_call",
    message: row.step_1_message,
    delay: "instant",
    enabled,
    sends: 0,
    replies: 0,
    bookings: 0,
    steps,
  }
}

export function toDbAutomationInsert(orgId: string): AutomationsInsert {
  return {
    org_id: orgId,
    missed_call_enabled: true,
    followups_enabled: true,
    after_hours_mode: "continue",
    tone_preset: "professional",
    step_1_delay_seconds: 0,
    step_1_message: "Sorry we missed your call — how can we help you today?",
    step_2_delay_seconds: 7200,
    step_2_message: "Just following up — do you still need help?",
    step_3_next_day_time: "09:00",
    step_3_message: "Last check-in — want to get scheduled today?",
  }
}

export function toDbAutomationUpdate(patch: Partial<AutomationConfig>): AutomationsUpdate {
  const u: AutomationsUpdate = {}

  if (patch.enabled !== undefined) {
    u.missed_call_enabled = patch.enabled
    u.followups_enabled = patch.enabled
  }

  if (patch.message !== undefined) u.step_1_message = patch.message

  if (patch.steps) {
    const s1 = patch.steps.find((s) => s.id === "step1" && s.type === "sms")
    const s2 = patch.steps.find((s) => s.id === "step2" && s.type === "sms")
    const s3 = patch.steps.find((s) => s.id === "step3" && s.type === "sms")

    if (s1?.message !== undefined) u.step_1_message = s1.message
    if (s2?.message !== undefined) u.step_2_message = s2.message
    if (s3?.message !== undefined) u.step_3_message = s3.message
  }

  return u
}

/** -----------------------------
 * Billing
 * ------------------------------ */
export function fromDbBilling(row: BillingRow): BillingState {
  // UI BillingStatus doesn't include "trialing"; we can map trialing->active while you show plan=trial
  const status: BillingState["status"] = row.status === "trialing" ? "active" : row.status

  return {
    status,
    plan: row.plan as any,
    trialEndsAt: row.trial_ends_at ?? undefined,
    currentPeriodEnd: row.current_period_end ?? undefined,
    paymentMethods: [],
    invoices: [],
  }
}

export function toDbBillingUpdate(patch: Partial<BillingState>): BillingUpdate {
  const u: BillingUpdate = {}
  if (patch.status !== undefined) u.status = patch.status as any
  if (patch.plan !== undefined) u.plan = patch.plan
  if (patch.trialEndsAt !== undefined) u.trial_ends_at = patch.trialEndsAt ?? null
  if (patch.currentPeriodEnd !== undefined) u.current_period_end = patch.currentPeriodEnd ?? null
  return u
}

/** -----------------------------
 * Usage Tracking
 * ------------------------------ */
export function fromDbUsage(row: UsageTrackingRow, smsLimit = 300): UsageState {
  return {
    smsUsed: row.sms_used ?? 0,
    smsLimit,
    callsThisPeriod: 0,
    conversationsThisPeriod: 0,
    period: row.month_year,
  }
}

export function toDbUsageInsert(args: {
  orgId: string
  monthYear: string
  smsUsed?: number
  voiceMinutesUsed?: number
}): UsageTrackingInsert {
  return {
    org_id: args.orgId,
    month_year: args.monthYear,
    sms_used: args.smsUsed ?? 0,
    voice_minutes_used: args.voiceMinutesUsed ?? 0,
  }
}

/** -----------------------------
 * Support Tickets
 * ------------------------------ */
export function fromDbSupportTicket(row: SupportTicketsRow): SupportTicket {
  return {
    id: row.id,
    subject: row.subject,
    description: row.description,
    priority: row.priority,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function toDbSupportTicketInsert(args: {
  orgId: string
  profileId?: string | null
  subject: string
  description: string
  priority?: SupportTicket["priority"]
}): SupportTicketsInsert {
  return {
    org_id: args.orgId,
    profile_id: args.profileId ?? null,
    subject: args.subject,
    description: args.description,
    priority: args.priority ?? "medium",
    status: "open",
  }
}

/** -----------------------------
 * Opt Outs
 * ------------------------------ */
export function fromDbOptOut(row: OptOutsRow): OptOut {
  return {
    id: row.id,
    phone: row.phone,
    name: row.name ?? "Unknown",
    reason: row.reason,
    optedOutAt: row.opted_out_at,
    canResubscribe: row.can_resubscribe,
  }
}

export function toDbOptOutInsert(args: { orgId: string; phone: string; name?: string; reason?: string }): OptOutsInsert {
  return {
    org_id: args.orgId,
    phone: args.phone,
    name: args.name ?? null,
    reason: args.reason ?? "STOP",
    can_resubscribe: false,
    // opted_out_at has a default in your schema; omit unless you want to set it explicitly
  }
}
