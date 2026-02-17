"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Flame, Droplets, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const industries = [
  {
    id: "hvac",
    label: "HVAC",
    icon: Flame,
    headline: "No more lost furnace repair calls",
    description:
      "When it's 10 degrees out and the heater dies, homeowners call the first company they find. If you don't answer, they move on. Handled makes sure every emergency call gets a response — even at 2 AM.",
    stat: "73%",
    statLabel: "of HVAC calls happen outside business hours",
  },
  {
    id: "plumbing",
    label: "Plumbing",
    icon: Droplets,
    headline: "Capture every burst pipe emergency",
    description:
      "Water emergencies don't wait. When a homeowner has a burst pipe and you're elbow-deep in a slab leak, Handled catches the call and starts the conversation so you don't lose the job.",
    stat: "5x",
    statLabel: "faster response than callback from voicemail",
  },
  {
    id: "electrical",
    label: "Electrical",
    icon: Zap,
    headline: "Never miss a panel upgrade lead",
    description:
      "EV charger installs, panel upgrades, generator quotes — high-ticket jobs that slip away when the phone goes to voicemail. Handled keeps the lead warm until you're ready to talk.",
    stat: "$2,400",
    statLabel: "average recovered job value",
  },
]

export function IndustriesSection() {
  const [activeId, setActiveId] = useState("hvac")
  const active = industries.find((i) => i.id === activeId) ?? industries[0]
  const ActiveIcon = active.icon

  return (
    <section id="industries" className="relative py-20 lg:py-28 bg-card/30 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-emerald-muted">
            Industries
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Made for the trades.
          </h2>
        </motion.div>

        {/* Industry pills */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {industries.map((industry) => {
            const Icon = industry.icon
            return (
              <button
                key={industry.id}
                onClick={() => setActiveId(industry.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                  industry.id === activeId
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {industry.label}
              </button>
            )
          })}
        </div>

        {/* Active industry detail */}
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10 mx-auto max-w-3xl"
        >
          <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-muted">
                <ActiveIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {active.headline}
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {active.description}
            </p>
            <div className="mt-6 flex items-baseline gap-2 rounded-xl bg-emerald-muted/30 border border-primary/10 p-4">
              <span className="text-3xl font-bold text-primary">{active.stat}</span>
              <span className="text-sm text-muted-foreground">{active.statLabel}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
