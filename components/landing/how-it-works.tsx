"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, ArrowRight, MessageSquare, Inbox } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Get a Handled number",
    description: "We provision a local-area-code number so your callers see a familiar prefix.",
    icon: Phone,
  },
  {
    number: "02",
    title: "Forward calls to your phone",
    description: "Set up call forwarding from your Handled number to your cell or office line.",
    icon: ArrowRight,
  },
  {
    number: "03",
    title: "If you miss it, we text instantly",
    description: "Missed call triggers an automatic SMS follow-up within seconds. No action needed from you.",
    icon: MessageSquare,
  },
]

export function HowItWorks() {
  const [simulated, setSimulated] = useState(false)

  return (
    <section id="how-it-works" className="relative py-20 lg:py-28 bg-card/30 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-emerald-muted">
            Simple setup
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {"3 steps. That's it."}
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                className="relative flex flex-col items-center text-center md:items-start md:text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                {/* Connector line (desktop) */}
                {i < steps.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+32px)] hidden h-px w-[calc(100%-64px)] bg-border md:block" />
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-emerald-muted text-primary font-bold text-sm">
                  {step.number}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Flow diagram */}
        <motion.div
          className="mt-16 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* Flow */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 text-sm">
              <div className="rounded-lg border border-border bg-muted/50 px-4 py-2 font-medium text-foreground">
                Caller
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 sm:rotate-0" />
              <div className="rounded-lg border border-primary/30 bg-emerald-muted px-4 py-2 font-medium text-primary">
                Handled Number
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 sm:rotate-0" />
              <div className="rounded-lg border border-border bg-muted/50 px-4 py-2 font-medium text-foreground">
                Forward to You
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-px w-8 bg-border" />
              If missed
              <span className="h-px w-8 bg-border" />
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 text-sm">
              <div className="rounded-lg border border-primary/30 bg-emerald-muted px-4 py-2 font-medium text-primary">
                SMS Follow-up
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 sm:rotate-0" />
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 font-medium text-foreground">
                <Inbox className="h-4 w-4" />
                Your Inbox
              </div>
            </div>

            {/* Simulator toggle */}
            <div className="mt-4 flex flex-col items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSimulated(!simulated)}
                className="border-primary/30 text-primary hover:bg-emerald-muted"
              >
                <Phone className="mr-2 h-3.5 w-3.5" />
                {simulated ? "Reset simulation" : "Simulate a missed call"}
              </Button>

              <AnimatePresence>
                {simulated && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full max-w-sm overflow-hidden"
                  >
                    <div className="rounded-xl border border-primary/20 bg-card p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                        <span className="text-xs text-muted-foreground">Call missed at 3:47 PM</span>
                      </div>
                      <div className="rounded-lg bg-emerald-muted/30 border border-primary/10 p-3">
                        <p className="text-xs font-medium text-primary mb-1">Auto-reply sent (3 sec later):</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {"\"Hi! Sorry we missed your call. We're currently helping another customer. Reply with what you need and we'll get right back to you!\""}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-xs font-medium text-foreground mb-1">Customer reply (2 min later):</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {"\"Hi, my AC stopped blowing cold. Can someone come out tomorrow morning?\""}
                        </p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Lead captured — ready to book
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
