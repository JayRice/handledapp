import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
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
  AppBanner,
} from "@/types/handled"
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_CALLS,
  MOCK_AUTOMATIONS,
  MOCK_OPT_OUTS,
} from "@/lib/mock/seed-data"

// ── Slice Interfaces ─────────────────────────────────

interface OrgSlice {
  orgName: string
  trade: string
  timezone: string
}

interface InboxSlice {
  conversations: Conversation[]
  messages: Record<number, Message[]>
  setConversationStatus: (id: number, status: ConversationStatus) => void
  markRead: (id: number) => void
  addMessage: (conversationId: number, msg: Omit<Message, "id">) => void
}

interface CallsSlice {
  calls: Call[]
}

interface AutomationsSlice {
  automations: AutomationConfig[]
  toggleAutomation: (id: string) => void
  updateAutomation: (id: string, updates: Partial<AutomationConfig>) => void
  addAutomation: (automation: AutomationConfig) => void
  deleteAutomation: (id: string) => void
}

interface BillingSlice {
  billing: BillingState
  setBillingStatus: (status: BillingState["status"]) => void
  addPaymentMethod: (pm: BillingState["paymentMethods"][number]) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void
}

interface UsageSlice {
  usage: UsageState
}

interface SupportSlice {
  tickets: SupportTicket[]
  addTicket: (ticket: SupportTicket) => void
}

interface SystemStatusSlice {
  systemStatus: SystemStatus
}

interface OptOutsSlice {
  optOuts: OptOut[]
}

interface BannersSlice {
  banners: AppBanner[]
  addBanner: (banner: AppBanner) => void
  dismissBanner: (id: string) => void
  clearBanners: () => void
}

interface MetaSlice {
  resetAll: () => void
}

export type AppStore = OrgSlice &
  InboxSlice &
  CallsSlice &
  AutomationsSlice &
  BillingSlice &
  UsageSlice &
  SupportSlice &
  SystemStatusSlice &
  OptOutsSlice &
  BannersSlice &
  MetaSlice

// ── Default State ────────────────────────────────────

const defaultBilling: BillingState = {
  status: "active",
  plan: "trial",
  trialEndsAt: new Date(Date.now() + 14 * 86400000).toISOString(),
  currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
  paymentMethods: [
    { id: "pm_1", type: "Visa", last4: "4242", expiry: "12/2027", isDefault: true, name: "Mike Smith" },
  ],
  invoices: [
    { id: "inv_1", date: "2026-02-01", amount: 4900, status: "paid" },
    { id: "inv_2", date: "2026-01-01", amount: 4900, status: "paid" },
  ],
}

const defaultUsage: UsageState = {
  smsUsed: 142,
  smsLimit: 300,
  callsThisPeriod: 47,
  conversationsThisPeriod: 38,
  period: "Feb 2026",
}

const defaultSystemStatus: SystemStatus = {
  smsDelivery: "operational",
  phoneProvisioning: "operational",
  webhooks: "operational",
  complianceStatus: "approved",
  lastChecked: new Date().toISOString(),
  uptime: 99.97,
}

function getInitialBanners(): AppBanner[] {
  const banners: AppBanner[] = []

  // Trial ending soon
  banners.push({
    id: "trial-ending",
    variant: "warn",
    message: "Your free trial ends in 14 days. Upgrade to keep your automations running.",
    dismissible: true,
    action: { label: "Upgrade now", href: "/app/settings?tab=billing" },
  })

  return banners
}

// ── Store ────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // -- Org
      orgName: "Smith HVAC & Plumbing",
      trade: "hvac",
      timezone: "America/Chicago",

      // -- Inbox
      conversations: MOCK_CONVERSATIONS,
      messages: MOCK_MESSAGES,

      setConversationStatus: (id, status) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, status, unread: false } : c
          ),
        })),

      markRead: (id) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, unread: false } : c
          ),
        })),

      addMessage: (conversationId, msg) =>
        set((s) => {
          const existing = s.messages[conversationId] || []
          const newMsg: Message = { ...msg, id: existing.length + 1 }
          const newMessages = { ...s.messages, [conversationId]: [...existing, newMsg] }
          const conversations = s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, lastMessage: msg.text, time: "Just now", unread: false }
              : c
          )
          return { messages: newMessages, conversations }
        }),

      // -- Calls
      calls: MOCK_CALLS,

      // -- Automations
      automations: MOCK_AUTOMATIONS,

      toggleAutomation: (id) =>
        set((s) => ({
          automations: s.automations.map((a) =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
          ),
        })),

      updateAutomation: (id, updates) =>
        set((s) => ({
          automations: s.automations.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      addAutomation: (automation) =>
        set((s) => ({ automations: [...s.automations, automation] })),

      deleteAutomation: (id) =>
        set((s) => ({ automations: s.automations.filter((a) => a.id !== id) })),

      // -- Billing
      billing: defaultBilling,

      setBillingStatus: (status) =>
        set((s) => ({ billing: { ...s.billing, status } })),

      addPaymentMethod: (pm) =>
        set((s) => ({
          billing: {
            ...s.billing,
            paymentMethods: [...s.billing.paymentMethods, pm],
          },
        })),

      removePaymentMethod: (id) =>
        set((s) => ({
          billing: {
            ...s.billing,
            paymentMethods: s.billing.paymentMethods.filter((p) => p.id !== id),
          },
        })),

      setDefaultPaymentMethod: (id) =>
        set((s) => ({
          billing: {
            ...s.billing,
            paymentMethods: s.billing.paymentMethods.map((p) => ({
              ...p,
              isDefault: p.id === id,
            })),
          },
        })),

      // -- Usage
      usage: defaultUsage,

      // -- Support
      tickets: [],

      addTicket: (ticket) =>
        set((s) => ({ tickets: [ticket, ...s.tickets] })),

      // -- System Status
      systemStatus: defaultSystemStatus,

      // -- Opt-outs
      optOuts: MOCK_OPT_OUTS,

      // -- Banners
      banners: getInitialBanners(),

      addBanner: (banner) =>
        set((s) => {
          if (s.banners.some((b) => b.id === banner.id)) return s
          return { banners: [...s.banners, banner] }
        }),

      dismissBanner: (id) =>
        set((s) => ({ banners: s.banners.filter((b) => b.id !== id) })),

      clearBanners: () => set({ banners: [] }),

      // -- Meta
      resetAll: () => {
        set({
          conversations: MOCK_CONVERSATIONS,
          messages: MOCK_MESSAGES,
          calls: MOCK_CALLS,
          automations: MOCK_AUTOMATIONS,
          billing: defaultBilling,
          usage: defaultUsage,
          systemStatus: defaultSystemStatus,
          optOuts: MOCK_OPT_OUTS,
          tickets: [],
          banners: getInitialBanners(),
        })
      },
    }),
    {
      name: "handled-app-store",
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
        calls: state.calls,
        automations: state.automations,
        billing: state.billing,
        usage: state.usage,
        tickets: state.tickets,
        optOuts: state.optOuts,
        banners: state.banners,
      }),
    }
  )
)
