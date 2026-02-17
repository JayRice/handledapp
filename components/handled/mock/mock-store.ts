import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  type Conversation,
  type ConversationStatus,
  type Message,
} from "./mock-data"

interface MockStore {
  conversations: Conversation[]
  messages: Record<number, Message[]>
  billingStatus: "active" | "paused" | "canceled"
  paymentMethods: PaymentMethod[]

  // conversation actions
  setConversationStatus: (id: number, status: ConversationStatus) => void
  addMessage: (conversationId: number, msg: Omit<Message, "id">) => void

  // billing actions
  setBillingStatus: (s: "active" | "paused" | "canceled") => void
  addPaymentMethod: (pm: Omit<PaymentMethod, "id">) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void

  // reset
  resetAll: () => void
}

export interface PaymentMethod {
  id: string
  type: string
  last4: string
  expiry: string
  isDefault: boolean
  name: string
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm_1", type: "Visa", last4: "4242", expiry: "12/2027", isDefault: true, name: "Mike Smith" },
]

export const useMockStore = create<MockStore>()(
  persist(
    (set) => ({
      conversations: MOCK_CONVERSATIONS,
      messages: MOCK_MESSAGES,
      billingStatus: "active",
      paymentMethods: DEFAULT_PAYMENT_METHODS,

      setConversationStatus: (id, status) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, status, unread: false } : c
          ),
        })),

      addMessage: (conversationId, msg) =>
        set((state) => {
          const existing = state.messages[conversationId] || []
          const newMsg: Message = { ...msg, id: existing.length + 1 }
          const newMessages = { ...state.messages, [conversationId]: [...existing, newMsg] }

          // Also update the conversation's lastMessage and time
          const conversations = state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, lastMessage: msg.text, time: "Just now", unread: false }
              : c
          )

          return { messages: newMessages, conversations }
        }),

      setBillingStatus: (s) => set({ billingStatus: s }),

      addPaymentMethod: (pm) =>
        set((state) => ({
          paymentMethods: [...state.paymentMethods, { ...pm, id: "pm_" + Date.now() }],
        })),

      removePaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((p) => p.id !== id),
        })),

      setDefaultPaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map((p) => ({
            ...p,
            isDefault: p.id === id,
          })),
        })),

      resetAll: () =>
        set({
          conversations: MOCK_CONVERSATIONS,
          messages: MOCK_MESSAGES,
          billingStatus: "active",
          paymentMethods: DEFAULT_PAYMENT_METHODS,
        }),
    }),
    {
      name: "handled-mock-store",
    }
  )
)
