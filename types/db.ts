// src/types/db.ts
import type { Database } from "@/types/supabase"

type Tables = Database["public"]["Tables"]

export type OrganizationRow = Tables["organizations"]["Row"]
export type OrganizationInsert = Tables["organizations"]["Insert"]
export type OrganizationUpdate = Tables["organizations"]["Update"]

export type ProfileRow = Tables["profiles"]["Row"]
export type ProfileInsert = Tables["profiles"]["Insert"]

export type PhoneNumberRow = Tables["phone_numbers"]["Row"]
export type PhoneNumberInsert = Tables["phone_numbers"]["Insert"]

export type CallRow = Tables["calls"]["Row"]
export type CallInsert = Tables["calls"]["Insert"]

export type ConversationRow = Tables["conversations"]["Row"]
export type ConversationInsert = Tables["conversations"]["Insert"]
export type ConversationUpdate = Tables["conversations"]["Update"]

export type MessageRow = Tables["messages"]["Row"]
export type MessageInsert = Tables["messages"]["Insert"]

export type AutomationRow = Tables["automations"]["Row"]
export type AutomationUpdate = Tables["automations"]["Update"]

export type OutboxJobRow = Tables["outbox_jobs"]["Row"]
export type OutboxJobInsert = Tables["outbox_jobs"]["Insert"]

export type BillingRow = Tables["billing"]["Row"]
export type BillingUpdate = Tables["billing"]["Update"]

export type UsageRow = Tables["usage_tracking"]["Row"]
export type UsageInsert = Tables["usage_tracking"]["Insert"]

export type SupportTicketRow = Tables["support_tickets"]["Row"]
export type SupportTicketInsert = Tables["support_tickets"]["Insert"]

export type EventRow = Tables["events"]["Row"]
export type EventInsert = Tables["events"]["Insert"]
