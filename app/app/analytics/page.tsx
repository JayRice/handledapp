"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Phone,
  PhoneMissed,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ArrowUpRight,
  BarChart3,
  Clock,
} from "lucide-react"

const DAILY_DATA = [
  { day: "Mon", calls: 18, missed: 7, recovered: 5 },
  { day: "Tue", calls: 24, missed: 9, recovered: 8 },
  { day: "Wed", calls: 21, missed: 6, recovered: 5 },
  { day: "Thu", calls: 28, missed: 11, recovered: 9 },
  { day: "Fri", calls: 32, missed: 14, recovered: 12 },
  { day: "Sat", calls: 12, missed: 8, recovered: 7 },
  { day: "Sun", calls: 5, missed: 4, recovered: 3 },
]

const HOURLY_PEAKS = [
  { hour: "8 AM", calls: 8 },
  { hour: "9 AM", calls: 14 },
  { hour: "10 AM", calls: 18 },
  { hour: "11 AM", calls: 15 },
  { hour: "12 PM", calls: 10 },
  { hour: "1 PM", calls: 12 },
  { hour: "2 PM", calls: 16 },
  { hour: "3 PM", calls: 20 },
  { hour: "4 PM", calls: 17 },
  { hour: "5 PM", calls: 11 },
  { hour: "6 PM", calls: 6 },
]

const RESPONSE_METRICS = [
  { label: "Avg. response time", value: "8 sec", trend: "down", change: "23%" },
  { label: "Reply rate", value: "48.6%", trend: "up", change: "5.2%" },
  { label: "Booking conv. rate", value: "28.1%", trend: "up", change: "3.8%" },
  { label: "Opt-out rate", value: "1.2%", trend: "down", change: "0.4%" },
]

export default function AnalyticsPage() {
  const [range, setRange] = useState("7d")

  const totalCalls = DAILY_DATA.reduce((s, d) => s + d.calls, 0)
  const totalMissed = DAILY_DATA.reduce((s, d) => s + d.missed, 0)
  const totalRecovered = DAILY_DATA.reduce((s, d) => s + d.recovered, 0)
  const recoveryRate = Math.round((totalRecovered / totalMissed) * 100)
  const maxCalls = Math.max(...DAILY_DATA.map(d => d.calls))
  const maxHourly = Math.max(...HOURLY_PEAKS.map(h => h.calls))
  const avgJobValue = 285
  const recoveredRevenue = totalRecovered * avgJobValue

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track call volumes, recovery rates, and revenue impact</p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[150px] bg-background border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calls</p>
                <p className="text-3xl font-bold text-foreground">{totalCalls}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% vs last week</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Phone className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Missed Calls</p>
                <p className="text-3xl font-bold text-foreground">{totalMissed}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <TrendingDown className="h-3 w-3" />
                  <span>-8% vs last week</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                <PhoneMissed className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recovery Rate</p>
                <p className="text-3xl font-bold text-primary">{recoveryRate}%</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                  <TrendingUp className="h-3 w-3" />
                  <span>+5.2% vs last week</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Recovered</p>
                <p className="text-3xl font-bold text-foreground">${recoveredRevenue.toLocaleString()}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>At ${avgJobValue} avg job</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Volume Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Weekly Call Volume</CardTitle>
              <Badge variant="outline" className="border-border text-muted-foreground gap-1">
                <BarChart3 className="h-3 w-3" /> This week
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DAILY_DATA.map((day) => (
                <div key={day.day} className="flex items-center gap-3">
                  <span className="w-8 text-xs text-muted-foreground font-medium">{day.day}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-7 bg-muted/50 rounded-md overflow-hidden relative">
                      <div
                        className="absolute inset-y-0 left-0 rounded-md bg-primary/20"
                        style={{ width: `${(day.calls / maxCalls) * 100}%` }}
                      />
                      <div
                        className="absolute inset-y-0 left-0 rounded-md bg-destructive/30"
                        style={{ width: `${(day.missed / maxCalls) * 100}%` }}
                      />
                      <div
                        className="absolute inset-y-0 left-0 rounded-md bg-primary/60"
                        style={{ width: `${(day.recovered / maxCalls) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-foreground font-medium w-6 text-right">{day.calls}</span>
                    <span className="text-destructive w-5 text-right">{day.missed}</span>
                    <span className="text-primary w-5 text-right">{day.recovered}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-sm bg-primary/20" /> Total
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-sm bg-destructive/30" /> Missed
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-sm bg-primary/60" /> Recovered
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Peak Call Hours</CardTitle>
              <Badge variant="outline" className="border-border text-muted-foreground gap-1">
                <Clock className="h-3 w-3" /> Today
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-[220px]">
              {HOURLY_PEAKS.map((h) => (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-foreground">{h.calls}</span>
                  <div className="w-full relative rounded-t-md bg-muted/50 overflow-hidden" style={{ height: "180px" }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t-md bg-primary/40 transition-all"
                      style={{ height: `${(h.calls / maxHourly) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{h.hour.replace(" ", "\n")}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Metrics */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Response Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RESPONSE_METRICS.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <div className={`flex items-center gap-1 text-xs ${metric.trend === "up" ? "text-primary" : metric.label.includes("Opt") ? "text-primary" : "text-primary"}`}>
                  {metric.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{metric.change} vs last period</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Impact */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <CardContent className="relative pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Revenue Impact Summary</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {totalRecovered} recovered jobs at ${avgJobValue} average job value
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Without Handled</p>
                  <p className="text-xl font-bold text-destructive line-through">$0</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-primary" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">With Handled</p>
                  <p className="text-xl font-bold text-primary">${recoveredRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
