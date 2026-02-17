"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "How long does setup take?",
    a: "Less than 5 minutes. We provision your local number, you set up call forwarding on your phone, customize your auto-reply message, and you're live. No technician visit, no complicated software.",
  },
  {
    q: "How does call forwarding work?",
    a: "You'll get a Handled number with your local area code. Set it to forward to your cell or office line using your phone's built-in forwarding settings. If you answer, great. If you miss it, we catch it and text back instantly.",
  },
  {
    q: "Is it opt-out compliant?",
    a: "Yes. Handled has built-in STOP keyword handling that's TCPA-compliant. If a recipient texts STOP, they're immediately removed from all future messaging. This is all handled automatically.",
  },
  {
    q: "How do follow-ups stop automatically?",
    a: "The 3-step follow-up sequence stops the moment a lead replies, books, or opts out. There's no risk of over-messaging — the system is smart about when to stop.",
  },
  {
    q: "What counts as an emergency call?",
    a: "You can configure keywords that flag a message as urgent (like 'flood', 'no heat', 'sparking'). Urgent messages get prioritized in your inbox and can trigger a different auto-reply.",
  },
  {
    q: "Can multiple people use it?",
    a: "Right now Handled is built for solo operators and small crews. Teams support is coming soon — including shared inboxes, role-based access, and per-technician routing.",
  },
  {
    q: "How do local numbers work?",
    a: "We provision a real phone number with your local area code. Callers see a familiar prefix, which increases pickup and trust. The number is yours for as long as you have an active account.",
  },
  {
    q: "How do I get support?",
    a: "Email support@handledapp.io anytime. We typically respond within a few hours during business days. We also have a help center with guides for common setup questions.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-emerald-muted">
            FAQ
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/50">
                <AccordionTrigger className="text-left text-foreground hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
