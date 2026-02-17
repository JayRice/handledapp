"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Check,
  ArrowRight,
  MessageSquare,
  Phone,
  ListChecks,
  Inbox,
  Settings,
  Clock,
} from "lucide-react"

const included = [
  { icon: MessageSquare, text: "300 SMS / month" },
  { icon: Phone, text: "500 voice minutes / month" },
  { icon: ListChecks, text: "3-step follow-up sequence" },
  { icon: Inbox, text: "Inbox + call log" },
  { icon: Settings, text: "Settings + business hours" },
  { icon: Clock, text: "After-hours auto-reply rules" },
]

const pricingFaq = [
  {
    q: "Do I have to replace my number?",
    a: "No — you simply forward calls from your existing number to your Handled number. Your customers keep calling the same number they always have.",
  },
  {
    q: "What if AI is down?",
    a: "Fallback templates still send. Your follow-up sequence works with or without AI enhancements.",
  },
  {
    q: "Can I keep my area code?",
    a: "Yes. We provision a number with your local area code so callers see a familiar prefix.",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-emerald-muted">
            Pricing
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple pricing that pays for itself.
          </h2>
        </motion.div>

        {/* Pricing card */}
        <motion.div
          className="mt-12 mx-auto max-w-md"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="relative rounded-2xl border-2 border-primary/40 bg-card/80 backdrop-blur-sm p-8 shadow-lg">
            {/* Glow */}
            <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-emerald-glow blur-xl opacity-30" />

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-foreground">Handled</h3>
                <Badge className="bg-primary text-primary-foreground text-xs">Most Popular</Badge>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-bold tracking-tight text-foreground">$78</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                One missed call recovered pays for the entire month.
              </p>

              <div className="mt-6 space-y-3">
                {included.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-muted">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{item.text}</span>
                    </div>
                  )
                })}
              </div>

              <Button
                size="lg"
                className="mt-8 w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base"
              >
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                No credit card required. 14-day free trial.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Small FAQ under pricing */}
        <motion.div
          className="mt-12 mx-auto max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {pricingFaq.map((item, i) => (
              <AccordionItem key={i} value={`pricing-faq-${i}`}>
                <AccordionTrigger className="text-sm">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
