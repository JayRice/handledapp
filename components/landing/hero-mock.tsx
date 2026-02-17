"use client"

import { Badge } from "@/components/ui/badge"
import { Phone, MessageSquare, CheckCircle2, Clock, ArrowRight } from "lucide-react"

export function HeroMock() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      {/* Background glow */}
      <div className="absolute -inset-8 rounded-3xl bg-emerald-glow blur-3xl" />

      {/* Main card stack */}
      <div className="relative flex flex-col gap-3">
        {/* Card 1: Missed Call */}
        <div className="animate-float rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Phone className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Missed Call</p>
              <p className="text-xs text-muted-foreground">{'(512) 555-0147 — 2 min ago'}</p>
            </div>
            <Badge variant="outline" className="border-destructive/30 text-destructive text-xs">
              Missed
            </Badge>
          </div>
        </div>

        {/* Arrow connector */}
        <div className="flex items-center justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/60">
            <ArrowRight className="h-4 w-4 text-primary rotate-90" />
          </div>
        </div>

        {/* Card 2: SMS Follow-up */}
        <div className="animate-float-delay rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-muted">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">{'SMS Follow-up Sent'}</p>
              <p className="text-xs text-muted-foreground">Auto-reply in 3 seconds</p>
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {'"Hi! Sorry we missed your call. We\'re currently on a job. Can you describe what you need and we\'ll get back to you ASAP?"'}
            </p>
          </div>
        </div>

        {/* Arrow connector */}
        <div className="flex items-center justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/60">
            <ArrowRight className="h-4 w-4 text-primary rotate-90" />
          </div>
        </div>

        {/* Card 3: Booked */}
        <div className="animate-float-delay-2 rounded-xl border border-primary/30 bg-card/80 backdrop-blur-sm p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-muted">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Customer Replied</p>
              <p className="text-xs text-muted-foreground">{'\"Need furnace repair, available Thursday\"'}</p>
            </div>
            <Badge className="bg-primary text-primary-foreground text-xs">
              Booked
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Response time: 2 min</span>
          </div>
        </div>
      </div>
    </div>
  )
}
