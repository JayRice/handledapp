"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, MessageSquare, Clock } from "lucide-react"

const tickerItems = [
  { icon: CheckCircle2, text: "Missed call recovered — booked estimate" },
  { icon: MessageSquare, text: "Auto follow-up sent" },
  { icon: Clock, text: "Customer replied in 2 min" },
  { icon: CheckCircle2, text: "New lead captured from after-hours call" },
  { icon: MessageSquare, text: "Follow-up sequence completed" },
]

export function LiveTicker() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % tickerItems.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const item = tickerItems[current]
  const Icon = item.icon

  return (
    <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
      <span
        key={current}
        className="animate-ticker text-muted-foreground"
      >
        {item.text}
      </span>
    </div>
  )
}
