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

// A fully implemented mock provider that reads/writes from the Zustand store.
// This simulates async behavior with small delays for realism.

function delay(ms = 100) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

export class MockProvider implements DataProvider {
  async getOrg(): Promise<Organization> {
    await delay()
    return {
      id: "org_mock_1",
      name: "Smith HVAC & Plumbing",
      trade: "hvac",
      address: "123 Main St, Austin, TX 78701",
      timezone: "America/Chicago",
      businessHours: { open: "08:00", close: "18:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      phoneNumbers: [{ id: "pn_1", number: "+15125550100", label: "Main", status: "active", provider: "twilio" }],
      createdAt: "2025-01-15T00:00:00Z",
    }
  }

  async getConversations(): Promise<Conversation[]> {
    await delay()
    return [] // Reads from Zustand store in actual usage
  }

  async getConversation(id: number): Promise<Conversation | null> {
    await delay()
    void id
    return null
  }

  async updateConversationStatus(id: number, status: ConversationStatus): Promise<void> {
    await delay()
    void id
    void status
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    await delay()
    void conversationId
    return []
  }

  async sendMessage(conversationId: number, text: string): Promise<Message> {
    await delay()
    return {
      id: Date.now(),
      conversationId,
      sender: "us",
      text,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    }
  }

  async getCalls(): Promise<Call[]> {
    await delay()
    return []
  }

  async getAutomations(): Promise<AutomationConfig[]> {
    await delay()
    return []
  }

  async updateAutomationStep(id: string, updates: Partial<AutomationConfig>): Promise<void> {
    await delay()
    void id
    void updates
  }

  async getBilling(): Promise<BillingState> {
    await delay()
    return {
      status: "active",
      plan: "trial",
      trialEndsAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      paymentMethods: [],
      invoices: [],
    }
  }

  async updateBilling(updates: Partial<BillingState>): Promise<void> {
    await delay()
    void updates
  }

  async getUsage(): Promise<UsageState> {
    await delay()
    return { smsUsed: 142, smsLimit: 300, callsThisPeriod: 47, conversationsThisPeriod: 38, period: "Feb 2026" }
  }

  async createSupportTicket(ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): Promise<SupportTicket> {
    await delay()
    return {
      ...ticket,
      id: "tk_" + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  async getOptOuts(): Promise<OptOut[]> {
    await delay()
    return []
  }

  async getSystemStatus(): Promise<SystemStatus> {
    await delay()
    return {
      smsDelivery: "operational",
      phoneProvisioning: "operational",
      webhooks: "operational",
      complianceStatus: "approved",
      lastChecked: new Date().toISOString(),
      uptime: 99.97,
    }
  }
}
