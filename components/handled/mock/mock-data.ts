// ── Mock Conversations ────────────────────────────────
export type ConversationStatus = "new" | "in_progress" | "booked" | "lost" | "spam" | "opted_out"

export interface Conversation {
  id: number
  name: string
  phone: string
  lastMessage: string
  time: string
  status: ConversationStatus
  unread: boolean
  trade: string
}

export interface Message {
  id: number
  conversationId: number
  sender: "them" | "us" | "system"
  text: string
  time: string
  auto?: boolean
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 1, name: "Maria Santos", phone: "(512) 555-0147", lastMessage: "Hi, I need my AC looked at. Can you come today?", time: "2 min", status: "new", unread: true, trade: "HVAC" },
  { id: 2, name: "James Wilson", phone: "(512) 555-0178", lastMessage: "Thanks, Tuesday works for me.", time: "15 min", status: "in_progress", unread: true, trade: "HVAC" },
  { id: 3, name: "Linda Chen", phone: "(512) 555-0192", lastMessage: "What are your rates for a water heater install?", time: "1 hr", status: "new", unread: false, trade: "Plumbing" },
  { id: 4, name: "Robert Brown", phone: "(512) 555-0165", lastMessage: "Sounds good, I'll see you Thursday at 9am.", time: "2 hr", status: "booked", unread: false, trade: "HVAC" },
  { id: 5, name: "Sarah Davis", phone: "(512) 555-0198", lastMessage: "Actually, I went with another company.", time: "3 hr", status: "lost", unread: false, trade: "Electrical" },
  { id: 6, name: "Mike Johnson", phone: "(512) 555-0201", lastMessage: "STOP", time: "5 hr", status: "opted_out", unread: false, trade: "HVAC" },
  { id: 7, name: "Emily Taylor", phone: "(512) 555-0215", lastMessage: "Do you do duct cleaning as well?", time: "6 hr", status: "in_progress", unread: false, trade: "HVAC" },
  { id: 8, name: "Carlos Mendez", phone: "(512) 555-0233", lastMessage: "My kitchen faucet has been leaking all week.", time: "8 hr", status: "new", unread: true, trade: "Plumbing" },
  { id: 9, name: "Angela Reeves", phone: "(512) 555-0244", lastMessage: "Is Saturday morning available?", time: "10 hr", status: "in_progress", unread: false, trade: "Electrical" },
]

export const MOCK_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, conversationId: 1, sender: "system", text: "Missed call detected. Auto-reply sent.", time: "10:32 AM" },
    { id: 2, conversationId: 1, sender: "us", text: "Hi! Sorry we missed your call. This is Smith HVAC \u2014 how can we help you today?", time: "10:32 AM", auto: true },
    { id: 3, conversationId: 1, sender: "them", text: "Hi, I need my AC looked at. Can you come today?", time: "10:34 AM" },
    { id: 4, conversationId: 1, sender: "us", text: "We'd be happy to help! What kind of issue are you experiencing with your AC?", time: "10:36 AM" },
    { id: 5, conversationId: 1, sender: "them", text: "It's blowing warm air. Started this morning.", time: "10:38 AM" },
  ],
  2: [
    { id: 1, conversationId: 2, sender: "system", text: "Missed call detected. Auto-reply sent.", time: "9:15 AM" },
    { id: 2, conversationId: 2, sender: "us", text: "Hi James! Sorry we missed your call. How can we help?", time: "9:15 AM", auto: true },
    { id: 3, conversationId: 2, sender: "them", text: "I need a furnace tune-up before winter.", time: "9:20 AM" },
    { id: 4, conversationId: 2, sender: "us", text: "Great timing! We have availability Tuesday or Thursday. Which works better?", time: "9:22 AM" },
    { id: 5, conversationId: 2, sender: "them", text: "Thanks, Tuesday works for me.", time: "9:25 AM" },
  ],
  3: [
    { id: 1, conversationId: 3, sender: "system", text: "Missed call detected. Auto-reply sent.", time: "8:45 AM" },
    { id: 2, conversationId: 3, sender: "us", text: "Hi! Sorry we missed your call. This is Smith Plumbing \u2014 how can we help?", time: "8:45 AM", auto: true },
    { id: 3, conversationId: 3, sender: "them", text: "What are your rates for a water heater install?", time: "8:50 AM" },
  ],
  4: [
    { id: 1, conversationId: 4, sender: "system", text: "Missed call detected. Auto-reply sent.", time: "Yesterday 2:10 PM" },
    { id: 2, conversationId: 4, sender: "us", text: "Hi Robert! Sorry we missed your call. What can we help with?", time: "Yesterday 2:10 PM", auto: true },
    { id: 3, conversationId: 4, sender: "them", text: "Need my ducts cleaned. What are your rates?", time: "Yesterday 2:15 PM" },
    { id: 4, conversationId: 4, sender: "us", text: "We charge $299 for a full-home duct cleaning. We have Thursday 9 AM open. Interested?", time: "Yesterday 2:20 PM" },
    { id: 5, conversationId: 4, sender: "them", text: "Sounds good, I'll see you Thursday at 9am.", time: "Yesterday 2:22 PM" },
  ],
  5: [
    { id: 1, conversationId: 5, sender: "system", text: "Missed call detected. Auto-reply sent.", time: "Yesterday 11:00 AM" },
    { id: 2, conversationId: 5, sender: "us", text: "Hi Sarah! Sorry we missed your call. How can we help?", time: "Yesterday 11:00 AM", auto: true },
    { id: 3, conversationId: 5, sender: "them", text: "I need some outlets replaced. Can you come this week?", time: "Yesterday 11:05 AM" },
    { id: 4, conversationId: 5, sender: "us", text: "Sure! We have Friday 2 PM available. Would that work?", time: "Yesterday 11:10 AM" },
    { id: 5, conversationId: 5, sender: "them", text: "Actually, I went with another company.", time: "Yesterday 11:45 AM" },
  ],
  6: [
    { id: 1, conversationId: 6, sender: "us", text: "Hi! Just following up on your AC service request.", time: "Yesterday 3:00 PM", auto: true },
    { id: 2, conversationId: 6, sender: "them", text: "STOP", time: "Yesterday 3:02 PM" },
    { id: 3, conversationId: 6, sender: "system", text: "Contact opted out. All automations paused for this number.", time: "Yesterday 3:02 PM" },
  ],
  7: [
    { id: 1, conversationId: 7, sender: "system", text: "Missed call detected. Auto-reply sent.", time: "Yesterday 10:00 AM" },
    { id: 2, conversationId: 7, sender: "us", text: "Hi Emily! Sorry we missed your call. How can we help?", time: "Yesterday 10:00 AM", auto: true },
    { id: 3, conversationId: 7, sender: "them", text: "Do you do duct cleaning as well?", time: "Yesterday 10:15 AM" },
  ],
  8: [
    { id: 1, conversationId: 8, sender: "system", text: "Missed call detected. Auto-reply sent.", time: "Yesterday 8:00 AM" },
    { id: 2, conversationId: 8, sender: "us", text: "Hi Carlos! Sorry we missed your call. How can we help?", time: "Yesterday 8:00 AM", auto: true },
    { id: 3, conversationId: 8, sender: "them", text: "My kitchen faucet has been leaking all week.", time: "Yesterday 8:10 AM" },
  ],
  9: [
    { id: 1, conversationId: 9, sender: "system", text: "Missed call detected. Auto-reply sent.", time: "2 days ago 4:00 PM" },
    { id: 2, conversationId: 9, sender: "us", text: "Hi Angela! Sorry we missed your call. How can we help?", time: "2 days ago 4:00 PM", auto: true },
    { id: 3, conversationId: 9, sender: "them", text: "I need a circuit breaker panel upgrade.", time: "2 days ago 4:10 PM" },
    { id: 4, conversationId: 9, sender: "us", text: "We specialize in panel upgrades. Do you have availability this Saturday morning?", time: "2 days ago 4:15 PM" },
    { id: 5, conversationId: 9, sender: "them", text: "Is Saturday morning available?", time: "2 days ago 4:20 PM" },
  ],
}

// ── Quick replies ────────────────────────────────────
export const QUICK_REPLIES = [
  "We can schedule you for tomorrow. What time works?",
  "Let me check our availability and get back to you.",
  "We're fully booked today but have openings tomorrow.",
  "Can you describe the issue in more detail?",
  "Our standard service call rate is $89. Would you like to book?",
]

// ── AI Suggestions ────────────────────────────────────
export const AI_SUGGESTIONS = [
  { label: "Suggest appointment time", text: "We can come out tomorrow between 9-11 AM. Does that work for you?" },
  { label: "Diagnose and schedule", text: "Thanks for reaching out! Based on what you described, it sounds like it could be a refrigerant issue. We'd need to take a look to confirm. Can we schedule a visit?" },
  { label: "Provide estimate", text: "For that type of work, we typically see costs in the $150-$300 range depending on parts needed. Want us to come take a look and give you a firm quote?" },
]

// ── Status helpers ────────────────────────────────────
export const STATUS_COLORS: Record<string, string> = {
  new: "bg-primary/10 text-primary border-primary/30",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  booked: "bg-primary/10 text-primary border-primary/30",
  lost: "bg-muted text-muted-foreground border-border",
  spam: "bg-destructive/10 text-destructive border-destructive/30",
  opted_out: "bg-muted text-muted-foreground border-border",
}

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  in_progress: "In progress",
  booked: "Booked",
  lost: "Lost",
  spam: "Spam",
  opted_out: "Opted out",
}

export const FILTERS = ["All", "New", "In progress", "Booked", "Lost", "Spam", "Opted out"]
