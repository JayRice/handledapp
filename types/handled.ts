// ── Organization ─────────────────────────────────────
export interface Organization {
  id: string
  name: string
  trade: "hvac" | "plumbing" | "electrical" | "general"
  address?: string
  timezone: string
  businessHours: { open: string; close: string; days: string[] }
  phoneNumbers: PhoneNumber[]
  createdAt: string
}

// ── Profile ──────────────────────────────────────────
export interface Profile {
  id: string
  email: string
  name: string
  avatarUrl?: string
  phone?: string
  role: "owner" | "admin" | "member"
  onboardingComplete: boolean
  orgId: string
  plan: "trial" | "pro" | "enterprise"
  timezone?: string
  createdAt: string
}

// ── Phone Number ─────────────────────────────────────
export interface PhoneNumber {
  id: string
  number: string
  label: string
  status: "active" | "provisioning" | "inactive"
  provider: "twilio" | "other"
}

// ── Call ──────────────────────────────────────────────
export type CallType = "missed" | "answered" | "voicemail"
export type FollowUpStatus = "auto-sms" | "pending" | "replied" | "none"

export interface Call {
  id: number
  caller: string
  phone: string
  date: string
  duration: string
  type: CallType
  followUp: FollowUpStatus
  industry: string
}

// ── Conversation ─────────────────────────────────────
export type ConversationStatus = "new" | "in_progress" | "booked" | "lost" | "spam" | "opted_out"

export interface Conversation {
  id: number
  name: string
  phone: string
  lastMessage: string
  time: string
  status: ConversationStatus
  unread: boolean
  trade: string
}

// ── Message ──────────────────────────────────────────
export interface Message {
  id: number
  conversationId: number
  sender: "them" | "us" | "system"
  text: string
  time: string
  auto?: boolean
}

// ── Automation ───────────────────────────────────────
export type AutomationTrigger = "missed_call" | "after_hours" | "no_reply" | "job_complete"
export type AutomationDelay = "instant" | "30_seconds" | "2_minutes" | "5_minutes" | "2_hours" | "24_hours"

export interface AutomationStep {
  id: string
  type: "sms" | "wait" | "condition"
  message?: string
  delay?: AutomationDelay
}

export interface AutomationConfig {
  id: string
  name: string
  trigger: AutomationTrigger
  message: string
  delay: AutomationDelay
  enabled: boolean
  sends: number
  replies: number
  bookings: number
  steps?: AutomationStep[]
}

// ── Billing ──────────────────────────────────────────
export type BillingStatus = "active" | "paused" | "canceled" | "past_due"
export type PlanTier = "trial" | "pro" | "enterprise"

export interface PaymentMethod {
  id: string
  type: string
  last4: string
  expiry: string
  isDefault: boolean
  name: string
}

export interface BillingState {
  status: BillingStatus
  plan: PlanTier
  trialEndsAt?: string
  currentPeriodEnd?: string
  paymentMethods: PaymentMethod[]
  invoices: Invoice[]
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "failed"
  pdfUrl?: string
}

// ── Usage ────────────────────────────────────────────
export interface UsageState {
  smsUsed: number
  smsLimit: number
  callsThisPeriod: number
  conversationsThisPeriod: number
  period: string
}

// ── Support ──────────────────────────────────────────
export type TicketPriority = "low" | "medium" | "high" | "urgent"
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"

export interface SupportTicket {
  id: string
  subject: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt: string
}

// ── Opt-Out ──────────────────────────────────────────
export interface OptOut {
  id: string
  phone: string
  name: string
  reason: string
  optedOutAt: string
  canResubscribe: boolean
}

// ── System Status ────────────────────────────────────
export type ServiceHealth = "operational" | "degraded" | "outage" | "maintenance"

export interface SystemStatus {
  smsDelivery: ServiceHealth
  phoneProvisioning: ServiceHealth
  webhooks: ServiceHealth
  complianceStatus: "approved" | "pending" | "rejected"
  lastChecked: string
  uptime: number
}

// ── Banner ───────────────────────────────────────────
export type BannerVariant = "info" | "warn" | "error" | "success"

export interface AppBanner {
  id: string
  variant: BannerVariant
  message: string
  dismissible: boolean
  action?: { label: string; href: string }
}
