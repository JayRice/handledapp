"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { KpiCards } from "@/components/handled/kpi-cards"
import { ArrowRight, Clock, MessageSquare, AlertTriangle } from "lucide-react"
import Link from "next/link"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

const chartData = [
  { day: "Mon", calls: 12, missed: 5 },
  { day: "Tue", calls: 18, missed: 8 },
  { day: "Wed", calls: 15, missed: 3 },
  { day: "Thu", calls: 22, missed: 9 },
  { day: "Fri", calls: 19, missed: 7 },
  { day: "Sat", calls: 8, missed: 4 },
  { day: "Sun", calls: 5, missed: 2 },
]

const recentActivity = [
  { id: 1, type: "reply", text: "Auto-reply sent to (512) 555-0147", time: "2 min ago" },
  { id: 2, type: "booked", text: "Lead booked: AC repair for Johnson residence", time: "15 min ago" },
  { id: 3, type: "missed", text: "Missed call from (512) 555-0198", time: "22 min ago" },
  { id: 4, type: "reply", text: "Follow-up #2 sent to (512) 555-0132", time: "1 hr ago" },
  { id: 5, type: "booked", text: "Lead booked: Water heater install for Garcia family", time: "2 hr ago" },
]

const needsAttention = [
  { id: 1, name: "Maria Santos", phone: "(512) 555-0165", reason: "Awaiting reply — 4 hours", urgent: true },
  { id: 2, name: "James Wilson", phone: "(512) 555-0178", reason: "Awaiting reply — 2 hours", urgent: false },
  { id: 3, name: "Linda Chen", phone: "(512) 555-0192", reason: "Follow-up stalled", urgent: true },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
        <p className="text-sm text-muted-foreground">Here is what is happening with your missed calls today.</p>
      </div>

      <KpiCards />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Chart */}
        <Card className="lg:col-span-3 border-border/50 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">Calls vs Missed Calls</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs fill-muted-foreground" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs fill-muted-foreground" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="calls" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Total calls" />
                  <Bar dataKey="missed" fill="var(--destructive)" radius={[4, 4, 0, 0]} name="Missed" opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Needs attention */}
        <Card className="lg:col-span-2 border-border/50 bg-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Needs attention</CardTitle>
              <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10">
                {needsAttention.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {needsAttention.map((item) => (
                <li key={item.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${item.urgent ? "text-destructive" : "text-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.phone}</p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link href="/app/inbox"><ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  item.type === "booked" ? "bg-primary/10" : item.type === "missed" ? "bg-destructive/10" : "bg-muted"
                }`}>
                  {item.type === "reply" && <MessageSquare className="h-3.5 w-3.5 text-primary" />}
                  {item.type === "booked" && <Clock className="h-3.5 w-3.5 text-primary" />}
                  {item.type === "missed" && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-foreground">{item.text}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
