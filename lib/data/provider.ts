import type {
  Organization,
  Conversation,
  ConversationStatus,
  Message,
  Call,
  AutomationConfig,
  BillingState,
  UsageState,
  SupportTicket,
  OptOut,
  SystemStatus,
} from "@/types/handled"

// ── Data Provider Interface ──────────────────────────
// This is the single abstraction all app pages consume.
// Swap MockProvider for SupabaseProvider when backend is ready.

export interface DataProvider {
  // Org
  getOrg(): Promise<Organization | null>

  // Conversations
  getConversations(): Promise<Conversation[]>
  getConversation(id: number): Promise<Conversation | null>
  updateConversationStatus(id: number, status: ConversationStatus): Promise<void>
  getMessages(conversationId: number): Promise<Message[]>
  sendMessage(conversationId: number, text: string): Promise<Message>

  // Calls
  getCalls(): Promise<Call[]>

  // Automations
  getAutomations(): Promise<AutomationConfig[]>
  updateAutomationStep(id: string, updates: Partial<AutomationConfig>): Promise<void>

  // Billing
  getBilling(): Promise<BillingState>
  updateBilling(updates: Partial<BillingState>): Promise<void>

  // Usage
  getUsage(): Promise<UsageState>

  // Support
  createSupportTicket(ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): Promise<SupportTicket>

  // Opt-outs
  getOptOuts(): Promise<OptOut[]>

  // System status
  getSystemStatus(): Promise<SystemStatus>
}
