"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  AlertTriangle,
  Activity,
  Server,
  MessageSquare,
  Phone,
  Globe,
  Database,
} from "lucide-react"

const SERVICES = [
  { name: "SMS Delivery", status: "operational", icon: MessageSquare, uptime: "99.97%", latency: "142ms" },
  { name: "Call Detection", status: "operational", icon: Phone, uptime: "99.99%", latency: "38ms" },
  { name: "Web Dashboard", status: "operational", icon: Globe, uptime: "99.95%", latency: "89ms" },
  { name: "API", status: "operational", icon: Server, uptime: "99.98%", latency: "52ms" },
  { name: "Database", status: "operational", icon: Database, uptime: "99.99%", latency: "12ms" },
  { name: "Webhooks", status: "operational", icon: Activity, uptime: "99.93%", latency: "201ms" },
]

const INCIDENTS = [
  {
    date: "Feb 10, 2026",
    title: "SMS delivery delays",
    status: "resolved",
    description: "Some SMS messages experienced 2-3 minute delays due to carrier throttling. Issue resolved by switching to a backup delivery route.",
    duration: "47 minutes",
  },
  {
    date: "Jan 28, 2026",
    title: "Dashboard slow loading",
    status: "resolved",
    description: "Dashboard pages took longer than usual to load due to a database query optimization issue. Hotfix deployed.",
    duration: "22 minutes",
  },
  {
    date: "Jan 15, 2026",
    title: "Scheduled maintenance",
    status: "completed",
    description: "Planned maintenance window for infrastructure upgrades. No service interruption for active users.",
    duration: "2 hours (planned)",
  },
]

function StatusBadge({ status }: { status: string }) {
  if (status === "operational") {
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
        <CheckCircle2 className="h-3 w-3" /> Operational
      </Badge>
    )
  }
  return (
    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1">
      <AlertTriangle className="h-3 w-3" /> Degraded
    </Badge>
  )
}

export default function StatusPage() {
  const allOperational = SERVICES.every(s => s.status === "operational")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Status</h1>
        <p className="text-sm text-muted-foreground">Real-time status of all Handled services</p>
      </div>

      <Card className={`border-border ${allOperational ? "bg-primary/5 border-primary/20" : "bg-amber-500/5 border-amber-500/20"}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            {allOperational ? (
              <CheckCircle2 className="h-8 w-8 text-primary" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            )}
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {allOperational ? "All Systems Operational" : "Some Systems Experiencing Issues"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SERVICES.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.name} className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{service.name}</p>
                      <p className="text-xs text-muted-foreground">Uptime: {service.uptime} | Latency: {service.latency}</p>
                    </div>
                  </div>
                  <StatusBadge status={service.status} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Uptime bars */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">90-Day Uptime</CardTitle>
        </CardHeader>
        <CardContent>
          {SERVICES.map((service) => (
            <div key={service.name} className="mb-4 last:mb-0">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{service.name}</span>
                <span className="text-xs text-primary font-medium">{service.uptime}</span>
              </div>
              <div className="flex gap-[2px]">
                {Array.from({ length: 90 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 flex-1 rounded-[1px] ${
                      i === 41 || i === 58 ? "bg-amber-500/50" : "bg-primary/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-primary/40" /> No downtime
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-amber-500/50" /> Incident
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {INCIDENTS.map((incident, i) => (
              <div key={i} className="rounded-lg border border-border p-4 bg-background">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-medium text-foreground">{incident.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{incident.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{incident.date}</span>
                      <span>Duration: {incident.duration}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-primary border-primary/20">
                    {incident.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
