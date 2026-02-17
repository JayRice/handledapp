import type { DataProvider } from "./provider"
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

// ── Supabase Provider (Stub) ─────────────────────────
// Replace these stub implementations with real Supabase queries
// when connecting the backend. See /lib/adapters/supabase.ts for row mappers.

const NOT_IMPLEMENTED = "SupabaseProvider: Not implemented"

export class SupabaseProvider implements DataProvider {
  async getOrg(): Promise<Organization | null> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async getConversations(): Promise<Conversation[]> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async getConversation(_id: number): Promise<Conversation | null> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async updateConversationStatus(_id: number, _status: ConversationStatus): Promise<void> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async getMessages(_conversationId: number): Promise<Message[]> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async sendMessage(_conversationId: number, _text: string): Promise<Message> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async getCalls(): Promise<Call[]> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async getAutomations(): Promise<AutomationConfig[]> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async updateAutomationStep(_id: string, _updates: Partial<AutomationConfig>): Promise<void> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async getBilling(): Promise<BillingState> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async updateBilling(_updates: Partial<BillingState>): Promise<void> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async getUsage(): Promise<UsageState> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async createSupportTicket(_ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): Promise<SupportTicket> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async getOptOuts(): Promise<OptOut[]> {
    throw new Error(NOT_IMPLEMENTED)
  }
  async getSystemStatus(): Promise<SystemStatus> {
    throw new Error(NOT_IMPLEMENTED)
  }
}
