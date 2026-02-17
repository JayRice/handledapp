/**
 * Fixtures Factory
 *
 * Utility for generating typed mock data for testing, Storybook,
 * and seeding. Each factory returns a valid object with sensible
 * defaults that can be overridden via partial.
 */

import type {
  Conversation,
  ConversationStatus,
  Message,
  Call,
  AutomationConfig,
  OptOut,
  AppBanner,
  BannerVariant,
} from "@/types/handled"

let _id = 1000

function nextId() {
  return _id++
}

// ── Conversation Factory ─────────────────────────────

export function createConversation(overrides: Partial<Conversation> = {}): Conversation {
  const id = overrides.id ?? nextId()
  return {
    id,
    name: `Contact ${id}`,
    phone: `(512) 555-${String(id).padStart(4, "0")}`,
    lastMessage: "Hey, I need help with my AC unit.",
    time: "Just now",
    status: "new" as ConversationStatus,
    unread: true,
    trade: "HVAC",
    ...overrides,
  }
}

export function createConversations(count: number, overrides: Partial<Conversation> = {}): Conversation[] {
  return Array.from({ length: count }, (_, i) =>
    createConversation({ ...overrides, id: nextId() + i })
  )
}

// ── Message Factory ──────────────────────────────────

export function createMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: overrides.id ?? nextId(),
    conversationId: overrides.conversationId ?? 1,
    sender: "them",
    text: "This is a test message.",
    time: "10:30 AM",
    ...overrides,
  }
}

export function createThread(conversationId: number, count: number): Message[] {
  return Array.from({ length: count }, (_, i) =>
    createMessage({
      id: i + 1,
      conversationId,
      sender: i % 2 === 0 ? "them" : "us",
      text: `Message ${i + 1} in thread.`,
      time: `${10 + Math.floor(i / 2)}:${String((i * 5) % 60).padStart(2, "0")} AM`,
    })
  )
}

// ── Call Factory ─────────────────────────────────────

export function createCall(overrides: Partial<Call> = {}): Call {
  const id = overrides.id ?? nextId()
  return {
    id,
    caller: `Caller ${id}`,
    phone: `(512) 555-${String(id).padStart(4, "0")}`,
    date: new Date().toISOString(),
    duration: "0:00",
    type: "missed",
    followUp: "auto-sms",
    industry: "HVAC",
    ...overrides,
  }
}

export function createCalls(count: number, overrides: Partial<Call> = {}): Call[] {
  return Array.from({ length: count }, () => createCall(overrides))
}

// ── Automation Factory ───────────────────────────────

export function createAutomation(overrides: Partial<AutomationConfig> = {}): AutomationConfig {
  const id = overrides.id ?? String(nextId())
  return {
    id,
    name: `Automation ${id}`,
    trigger: "missed_call",
    message: "Hey! Sorry we missed your call. How can we help?",
    delay: "instant",
    enabled: true,
    sends: 0,
    replies: 0,
    bookings: 0,
    ...overrides,
  }
}

// ── OptOut Factory ───────────────────────────────────

export function createOptOut(overrides: Partial<OptOut> = {}): OptOut {
  const id = overrides.id ?? `opt_${nextId()}`
  return {
    id,
    phone: `(512) 555-${String(nextId()).padStart(4, "0")}`,
    name: `Opted Out User`,
    reason: "Replied STOP",
    optedOutAt: new Date().toISOString(),
    canResubscribe: true,
    ...overrides,
  }
}

// ── Banner Factory ───────────────────────────────────

export function createBanner(overrides: Partial<AppBanner> = {}): AppBanner {
  return {
    id: overrides.id ?? `banner_${nextId()}`,
    variant: "info" as BannerVariant,
    message: "This is a test banner.",
    dismissible: true,
    ...overrides,
  }
}

// ── Bulk seed for demo ───────────────────────────────

export function createDemoSeed() {
  const conversations = createConversations(5)
  const messages: Record<number, Message[]> = {}
  for (const c of conversations) {
    messages[c.id] = createThread(c.id, 4)
  }
  const calls = createCalls(10)
  const automations = [
    createAutomation({ name: "Missed Call Text Back", trigger: "missed_call" }),
    createAutomation({ name: "After Hours Reply", trigger: "after_hours" }),
  ]
  return { conversations, messages, calls, automations }
}
