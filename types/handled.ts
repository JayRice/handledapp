// src/types/handled.ts (simple mode)
import type { Database } from "@/types/supabase"

type Tables = Database["public"]["Tables"]

export type Organization = Tables["organizations"]["Row"]
export type Profile = Tables["profiles"]["Row"]
export type PhoneNumber = Tables["phone_numbers"]["Row"]
export type Call = Tables["calls"]["Row"]
export type Conversation = Tables["conversations"]["Row"]
export type Message = Tables["messages"]["Row"]
export type Automation = Tables["automations"]["Row"]
export type Billing = Tables["billing"]["Row"]
export type UsageTracking = Tables["usage_tracking"]["Row"]
export type SupportTicket = Tables["support_tickets"]["Row"]
export type OptOut = Tables["opt_outs"]["Row"]
export type OutboxJob = Tables["outbox_jobs"]["Row"]
export type OrgInvite = Tables["org_invites"]["Row"]
export type ConversationRead = Tables["conversation_reads"]["Row"]
export type Event = Tables["events"]["Row"]

// Optional convenience types
export type ConversationStatus = Database["public"]["Enums"]["conversation_status"]
export type CallStatus = Database["public"]["Enums"]["call_status"]
export type TicketStatus = Database["public"]["Enums"]["ticket_status"]
export type TicketPriority = Database["public"]["Enums"]["ticket_priority"]
export type MemberRole = Database["public"]["Enums"]["member_role"]
export type TradeType = Database["public"]["Enums"]["trade_type"]

export type AppBanner = Tables["app_banners"]["Row"]
export type SystemStatus = Tables["system_status"]["Row"]
