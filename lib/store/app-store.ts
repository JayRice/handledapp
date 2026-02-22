import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
    Conversation,
    ConversationStatus,
    Message,
    Call,
    Automation,
    Billing,
    UsageTracking,
    SupportTicket,
    OptOut,
    AppBanner, SystemStatus,
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
  messages: Record<string, Message[]>
  setConversationStatus: (id: string, status: ConversationStatus) => void
  markRead: (id: string) => void
  addMessage: (conversationId: string, msg: Pick<Message, "created_at" | "text" | "conversation_id">) => void
}

interface CallsSlice {
  calls: Call[]
}

interface AutomationsSlice {
  automations: Automation[]
  toggleAutomation: (id: string) => void
  updateAutomation: (id: string, updates: Partial<Automation>) => void
  addAutomation: (automation: Automation) => void
  deleteAutomation: (id: string) => void
}

interface BillingSlice {
  billing: Billing | null
  setBillingStatus: (status: Billing["status"]) => void
  // addPaymentMethod: (pm: Billing[""][number]) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void
}

interface UsageSlice {
  usage: UsageTracking | null
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

export type AppStore =
  InboxSlice &
    MetaSlice &
    UsageSlice &
    BillingSlice &
    BannersSlice &
    AutomationsSlice

  // CallsSlice &
  // // BillingSlice &
  // SupportSlice &
  // SystemStatusSlice &
  // OptOutsSlice &
  // MetaSlice

// ── Default State ────────────────────────────────────

// const defaultBilling: Billing = {
//   status: "active",
//   plan: "trial",
//
//   // invoices: [
//   //   { id: "inv_1", date: "2026-02-01", amount: 4900, status: "paid" },
//   //   { id: "inv_2", date: "2026-01-01", amount: 4900, status: "paid" },
//   // ],
// }

function getInitialBanners(): AppBanner[] {
  const banners: AppBanner[] = []

  // banners.push({
  //   id: "trial-ending",
  //   variant: "warn",
  //   message: "Your free trial ends in 14 days. Upgrade to keep your automations running.",
  // })

  return banners
}

// ── Store ────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // -- Org

      // -- Inbox
        conversations: [],
        messages: {},

      setConversationStatus: (id, status) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, status, unread: false } : c
          ),
        })),

      markRead: (id : string) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, unread: false } : c
          ),
        })),

      addMessage: (conversationId, msg) =>
        set((s) => {
          const existing = s.messages[conversationId] || []
          const newMessages = { }
          const conversations = s.conversations.map((c : Conversation) =>
           c
          )
          return { messages: newMessages, conversations }
        }),

        usage: null,

      // -- Calls
      // calls: MOCK_CALLS,

      // -- Automations
      automations: [],

      toggleAutomation: (id) =>
        set((s) => ({

        })),

      updateAutomation: (id, updates) =>
        set((s) => ({
          automations: [],
        })),

      addAutomation: (automation) =>
        set((s) => ({ automations: [...s.automations, automation] })),

      deleteAutomation: (id) =>
        set((s) => ({ automations: s.automations.filter((a) => a.id !== id) })),

      // -- Billing

        billing: null,

        setBillingStatus: (status) => {

        },

      // addPaymentMethod: (pm) =>
      //   set((s) => ({
      //     billing: {
      //       ...s.billing,
      //       paymentMethods: [...s.billing.paymentMethods, pm],
      //     },
      //   })),

      removePaymentMethod: (id) => {},

      setDefaultPaymentMethod: (id) => {},


      // -- Usage
      // -- Support

      // addTicket: (ticket) =>
      //   set((s) => ({ tickets: [ticket, ...s.tickets] })),

      // -- System Status
      // systemStatus: defaultSystemStatus,
      //
      // // -- Opt-outs
      // optOuts: MOCK_OPT_OUTS,

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
          conversations: [],
          messages: {},
          // calls: MOCK_CALLS,
          // automations: MOCK_AUTOMATIONS,
          billing: null,
          usage: null,
          // systemStatus: defaultSystemStatus,
          // optOuts: MOCK_OPT_OUTS,
          // tickets: [],
          // banners: getInitialBanners(),
        })
      },
    }),
    {
      name: "handled-app-store",
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
        // calls: state.calls,
        automations: state.automations,
        // tickets: state.tickets,
        // optOuts: state.optOuts,
        banners: state.banners,
      }),
    }
  )
)
