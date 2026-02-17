import type { Conversation, ConversationStatus, Message, Call, CallType, FollowUpStatus } from "@/types/handled"

const FIRST_NAMES = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Lisa", "Daniel", "Nancy",
  "Carlos", "Angela", "Kevin", "Emily", "Brandon", "Maria", "Derek", "Sophia",
]

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
]

const TRADES = ["HVAC", "Plumbing", "Electrical", "General"]

const MESSAGES_THEM = [
  "My AC isn't working. Can you come take a look?",
  "I need a plumber ASAP. Kitchen sink is leaking.",
  "How much for a full electrical panel upgrade?",
  "Can you come by today? My water heater is making weird noises.",
  "I need an estimate for a ductless mini-split install.",
  "My toilet has been running nonstop for a week.",
  "Do you do weekend appointments?",
  "Is Saturday morning available?",
  "What are your rates for a service call?",
  "I need help with my garbage disposal. It's jammed.",
  "My furnace just stopped working in the middle of the night.",
  "Can you fix a dripping faucet?",
  "We need a new thermostat installed.",
  "The hot water in my shower isn't working.",
  "How soon can someone come out?",
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPhone(): string {
  const area = 512
  const a = Math.floor(Math.random() * 900) + 100
  const b = Math.floor(Math.random() * 9000) + 1000
  return `(${area}) ${a}-${b}`
}

function randomDate(daysBack: number): string {
  const d = new Date()
  d.setTime(d.getTime() - Math.random() * daysBack * 86400000)
  return d.toISOString()
}

function randomDuration(): string {
  if (Math.random() < 0.5) return "0:00"
  const min = Math.floor(Math.random() * 8)
  const sec = Math.floor(Math.random() * 60)
  return `${min}:${sec.toString().padStart(2, "0")}`
}

const STATUSES: ConversationStatus[] = ["new", "in_progress", "booked", "lost", "spam"]
const CALL_TYPES: CallType[] = ["missed", "answered", "voicemail"]
const FOLLOW_UPS: FollowUpStatus[] = ["auto-sms", "pending", "replied", "none"]

export function generateConversations(count: number): Conversation[] {
  return Array.from({ length: count }, (_, i) => {
    const name = `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`
    const status = randomItem(STATUSES)
    const hrs = Math.floor(Math.random() * 48)
    const time = hrs < 1 ? `${Math.floor(Math.random() * 59) + 1} min` : `${hrs} hr`
    return {
      id: 100 + i,
      name,
      phone: randomPhone(),
      lastMessage: randomItem(MESSAGES_THEM),
      time,
      status,
      unread: Math.random() < 0.3,
      trade: randomItem(TRADES),
    }
  })
}

export function generateMessagesForConversation(conversationId: number): Message[] {
  const count = Math.floor(Math.random() * 5) + 2
  const messages: Message[] = [
    { id: 1, conversationId, sender: "system", text: "Missed call detected. Auto-reply sent.", time: "10:00 AM" },
    { id: 2, conversationId, sender: "us", text: "Hi! Sorry we missed your call. How can we help?", time: "10:00 AM", auto: true },
  ]
  for (let i = 0; i < count; i++) {
    const sender = i % 2 === 0 ? "them" : "us"
    const hr = 10 + Math.floor(i / 2)
    const min = (i * 3 + 5) % 60
    messages.push({
      id: 3 + i,
      conversationId,
      sender: sender as "them" | "us",
      text: sender === "them" ? randomItem(MESSAGES_THEM) : "We'd be happy to help! What kind of issue are you experiencing?",
      time: `${hr > 12 ? hr - 12 : hr}:${min.toString().padStart(2, "0")} ${hr >= 12 ? "PM" : "AM"}`,
    })
  }
  return messages
}

export function generateCalls(daysBack: number): Call[] {
  const count = daysBack * (Math.floor(Math.random() * 4) + 3)
  return Array.from({ length: count }, (_, i) => {
    const type = randomItem(CALL_TYPES)
    return {
      id: 100 + i,
      caller: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,
      phone: randomPhone(),
      date: randomDate(daysBack),
      duration: type === "missed" ? "0:00" : randomDuration(),
      type,
      followUp: type === "missed" ? randomItem(["auto-sms", "pending"] as FollowUpStatus[]) : "none" as FollowUpStatus,
      industry: randomItem(TRADES),
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
