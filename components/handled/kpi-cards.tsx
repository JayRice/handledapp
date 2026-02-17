"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PhoneMissed, MessageSquare, CalendarCheck, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

const kpis = [
  { label: "Missed calls", value: "47", change: "+12%", trend: "up" as const, icon: PhoneMissed, color: "text-destructive" },
  { label: "Auto-replies sent", value: "38", change: "+8%", trend: "up" as const, icon: MessageSquare, color: "text-primary" },
  { label: "Booked leads", value: "14", change: "+22%", trend: "up" as const, icon: CalendarCheck, color: "text-primary" },
  { label: "Revenue recovered", value: "$4,200", change: "+18%", trend: "up" as const, icon: DollarSign, color: "text-primary" },
]

export function KpiCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="border-border/50 bg-card/80">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-muted">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${kpi.trend === "up" ? "text-primary" : "text-destructive"}`}>
                {kpi.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {kpi.change}
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
