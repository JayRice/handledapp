// ── Supabase Row Adapters ────────────────────────────
// Stub implementations for future Supabase integration.
// These map between Supabase row shapes and app domain types.

import type { Conversation, Message, Call, AutomationConfig, OptOut, SupportTicket } from "@/types/handled"

/* eslint-disable @typescript-eslint/no-explicit-any */

export function fromSupabaseConversation(row: any): Conversation {
  return {
    id: row.id,
    name: row.contact_name ?? "Unknown",
    phone: row.phone_number ?? "",
    lastMessage: row.last_message ?? "",
    time: row.updated_at ?? "",
    status: row.status ?? "new",
    unread: row.unread ?? false,
    trade: row.trade ?? "",
  }
}

export function toSupabaseConversation(model: Conversation): Record<string, unknown> {
  return {
    id: model.id,
    contact_name: model.name,
    phone_number: model.phone,
    last_message: model.lastMessage,
    status: model.status,
    unread: model.unread,
    trade: model.trade,
  }
}

export function fromSupabaseMessage(row: any): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    sender: row.sender,
    text: row.body ?? "",
    time: row.created_at ?? "",
    auto: row.is_auto ?? false,
  }
}

export function fromSupabaseCall(row: any): Call {
  return {
    id: row.id,
    caller: row.caller_name ?? "Unknown",
    phone: row.phone_number ?? "",
    date: row.created_at ?? "",
    duration: row.duration ?? "0:00",
    type: row.call_type ?? "missed",
    followUp: row.follow_up_status ?? "none",
    industry: row.industry ?? "",
  }
}

export function fromSupabaseAutomation(row: any): AutomationConfig {
  return {
    id: row.id,
    name: row.name,
    trigger: row.trigger_type,
    message: row.message_template ?? "",
    delay: row.delay ?? "instant",
    enabled: row.is_enabled ?? false,
    sends: row.total_sends ?? 0,
    replies: row.total_replies ?? 0,
    bookings: row.total_bookings ?? 0,
  }
}

export function fromSupabaseOptOut(row: any): OptOut {
  return {
    id: row.id,
    phone: row.phone_number,
    name: row.contact_name ?? "Unknown",
    reason: row.reason ?? "Replied STOP",
    optedOutAt: row.created_at,
    canResubscribe: row.can_resubscribe ?? true,
  }
}

export function fromSupabaseSupportTicket(row: any): SupportTicket {
  return {
    id: row.id,
    subject: row.subject,
    description: row.description ?? "",
    priority: row.priority ?? "medium",
    status: row.status ?? "open",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
