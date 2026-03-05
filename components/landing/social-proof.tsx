"use client"

import { motion } from "framer-motion"
import { PhoneCall, MessageCircle, Zap } from "lucide-react"

const logos = [
  "Elite HVAC Co.",
  "ProPlumb Solutions",
  "Volt Electric",
  "Summit Mechanical",
  "ClearDrain Plumbing",
  "ArcLight Electric",
]

const stats = [
  { icon: PhoneCall, label: "Recover missed calls", value: "24/7" },
  { icon: MessageCircle, label: "2-way texting", value: "Instant" },
  { icon: Zap, label: "Set up in minutes", value: "< 5 min" },
]

export function SocialProof() {
  return (
    <section className="relative border-y border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Trusted by service pros across the country
          </p>

          {/* Logo row */}
          {/*<div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">*/}
          {/*  {logos.map((name) => (*/}
          {/*    <div*/}
          {/*      key={name}*/}
          {/*      className="flex items-center gap-2 text-muted-foreground/50"*/}
          {/*    >*/}
          {/*      <div className="h-5 w-5 rounded bg-muted-foreground/10" />*/}
          {/*      <span className="text-sm font-medium">{name}</span>*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</div>*/}

          {/* Stats */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-6 text-center"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-muted">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
