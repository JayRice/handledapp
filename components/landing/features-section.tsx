"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquareText,
  ListChecks,
  Inbox,
  Tag,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: MessageSquareText,
    title: "Missed-call auto text-back",
    description: "Instantly send a custom SMS when you can't pick up. No missed leads.",
    preview: {
      title: "Auto Text-Back",
      content: "When a call goes unanswered, Handled sends a personalized SMS within 3 seconds. Your caller knows you're on it.",
      mockElements: ["Incoming call detected", "No answer after 4 rings", "SMS sent: \"Hi! Sorry we missed...\"", "Caller engaged"],
    },
  },
  {
    icon: ListChecks,
    title: "3-step follow-ups",
    description: "Automated sequence if they don't reply: nudge, re-engage, last chance.",
    preview: {
      title: "Follow-Up Sequence",
      content: "A 3-step drip that converts cold leads into booked jobs. Each message is timed and customizable.",
      mockElements: ["Step 1: Immediate reply (0 min)", "Step 2: Friendly nudge (2 hours)", "Step 3: Final follow-up (24 hours)", "Sequence complete"],
    },
  },
  {
    icon: Inbox,
    title: "Inbox + conversation history",
    description: "All your SMS threads in one dashboard. Never lose track of a conversation.",
    preview: {
      title: "Unified Inbox",
      content: "Every conversation lives in one place. Search, filter, and respond to leads without switching apps.",
      mockElements: ["John D. — AC repair inquiry", "Sarah M. — Plumbing estimate", "Mike R. — Booked for Thursday", "Lisa K. — Follow-up pending"],
    },
  },
  {
    icon: Tag,
    title: "Tag leads: Booked / Lost / Spam",
    description: "Organize your pipeline. Know exactly where every lead stands.",
    preview: {
      title: "Lead Tagging",
      content: "Categorize every conversation with one tap. Track your conversion rate and spot patterns.",
      mockElements: ["Booked (12 this week)", "Pending (5 in follow-up)", "Lost (2 — went with competitor)", "Spam (1 — filtered)"],
    },
  },
  {
    icon: Clock,
    title: "Business hours & after-hours rules",
    description: "Different auto-replies for business hours vs. evenings and weekends.",
    preview: {
      title: "Smart Scheduling",
      content: "Set your availability and let Handled adjust the messaging. After-hours calls get a different, appropriate reply.",
      mockElements: ["Mon-Fri: 7am-6pm (business reply)", "Sat: 8am-2pm (weekend reply)", "Sun: Off (after-hours reply)", "Holiday: Custom message"],
    },
  },
  {
    icon: ShieldCheck,
    title: "Opt-out compliant (STOP)",
    description: "Built-in STOP keyword handling. Stay compliant automatically.",
    preview: {
      title: "Compliance Built In",
      content: "TCPA compliant out of the box. If a recipient texts STOP, they're immediately removed from all messaging.",
      mockElements: ["STOP keyword detected", "Contact opted out", "No further messages sent", "Compliance log updated"],
    },
  },
]

export function FeaturesSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = features[activeIdx]

  return (
    <section id="features" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-emerald-muted">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Built for speed, built for service businesses.
          </h2>
        </motion.div>

        <div className="mt-16 flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Feature list */}
          <div className="flex flex-col gap-2 lg:w-[45%]">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <button
                  key={feature.title}
                  onClick={() => setActiveIdx(i)}
                  className={cn(
                    "flex items-start gap-4 rounded-xl p-4 text-left transition-all",
                    i === activeIdx
                      ? "bg-emerald-muted/50 border border-primary/20"
                      : "border border-transparent hover:bg-muted/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                      i === activeIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold transition-colors",
                      i === activeIdx ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </button>
              )
            })}

            {/* AI note */}
            <div className="mt-4 rounded-xl border border-border/50 bg-card/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">AI, but not required</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                AI can improve wording and summarize conversations, but the system works perfectly even if AI is off.
              </p>
            </div>
          </div>

          {/* Preview panel */}
          <div className="lg:w-[55%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="sticky top-28 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 lg:p-8"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const Icon = active.icon
                      return <Icon className="h-5 w-5 text-primary" />
                    })()}
                    <h3 className="text-lg font-semibold text-foreground">
                      {active.preview.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {active.preview.content}
                  </p>
                </div>

                {/* Mock UI */}
                <div className="space-y-3">
                  {active.preview.mockElements.map((element, i) => (
                    <motion.div
                      key={element}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3"
                    >
                      <div className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        i === active.preview.mockElements.length - 1 ? "bg-primary" : "bg-muted-foreground/30"
                      )} />
                      <span className="text-sm text-muted-foreground">{element}</span>
                      {i === active.preview.mockElements.length - 1 && (
                        <Badge className="ml-auto bg-primary text-primary-foreground text-xs">Active</Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
