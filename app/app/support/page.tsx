"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ComingSoonButton } from "@/components/handled/common/coming-soon"
import {
  HelpCircle,
  MessageCircle,
  BookOpen,
  Mail,
  ExternalLink,
  Search,
  Send,
} from "lucide-react"
import { toast } from "sonner"

const FAQ_ITEMS = [
  {
    q: "How fast does the auto-text go out after a missed call?",
    a: "By default, the SMS is sent within 5-10 seconds of a missed call. You can adjust the delay in Automations settings to add up to a 5-minute buffer.",
  },
  {
    q: "Can I customize the auto-reply message?",
    a: "Absolutely. Go to Automations and edit any rule. You can use variables like {caller_name} and {business_name} for personalization.",
  },
  {
    q: "What happens if a customer opts out?",
    a: "When someone replies STOP, they're immediately added to your opt-out list and won't receive any more automated messages. You can view and manage opt-outs from the Opt-Outs page.",
  },
  {
    q: "Does Handled work with my existing phone number?",
    a: "Yes. Handled integrates with your existing business number via call forwarding. No need to change your number or get a new one.",
  },
  {
    q: "How does billing work?",
    a: "We charge a flat monthly fee based on your plan tier. SMS messages are included up to your plan limit, with a small per-message charge beyond that.",
  },
  {
    q: "Can I use Handled for multiple business locations?",
    a: "Yes! The Growth and Enterprise plans support multiple phone numbers and locations under a single account.",
  },
]

export default function SupportPage() {
  const [searchQ, setSearchQ] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const filteredFaq = searchQ
    ? FAQ_ITEMS.filter(f => f.q.toLowerCase().includes(searchQ.toLowerCase()) || f.a.toLowerCase().includes(searchQ.toLowerCase()))
    : FAQ_ITEMS

  function handleSubmit() {
    if (!subject || !message) {
      toast.error("Please fill in all fields")
      return
    }
    toast.success("Support ticket submitted! We'll get back to you within 24 hours.")
    setSubject("")
    setMessage("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Help & Support</h1>
        <p className="text-sm text-muted-foreground">Get help, browse FAQs, or reach out to our team</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card opacity-60">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">Documentation</h3>
            <p className="mt-1 text-sm text-muted-foreground">Guides, tutorials and API docs</p>
            <Badge variant="outline" className="mt-2 border-border text-muted-foreground text-xs">Coming Soon</Badge>
          </CardContent>
        </Card>
        <Card className="border-border bg-card hover:border-primary/30 transition-colors cursor-pointer" onClick={() => toast.info("Live chat opening soon...")}>
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Live Chat</h3>
            <p className="mt-1 text-sm text-muted-foreground">Talk to us in real-time</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Email Support</h3>
            <p className="mt-1 text-sm text-muted-foreground">support@handled.app</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Frequently Asked Questions
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="pl-9 bg-background border-border text-foreground"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredFaq.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No matching questions found</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                  <AccordionTrigger className="text-foreground hover:text-primary text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Submit a Ticket</CardTitle>
          <CardDescription>Describe your issue and our team will respond within 24 hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of your issue" className="bg-background border-border text-foreground" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Message</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Provide as much detail as possible..." rows={5} className="bg-background border-border text-foreground resize-none" />
          </div>
          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Send className="h-4 w-4" /> Submit Ticket
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
