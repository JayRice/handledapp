"use client"

import { useState, useMemo } from "react"
import { useAppStore } from "@/lib/store/app-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  Search,
  Download,
  ArrowUpDown,
  MessageSquare,
} from "lucide-react"
import { toast } from "sonner"



function getTypeIcon(type: string) {
  switch (type) {
    case "answered": return <PhoneIncoming className="h-4 w-4 text-primary" />
    case "missed": return <PhoneMissed className="h-4 w-4 text-destructive" />
    case "voicemail": return <PhoneOff className="h-4 w-4 text-muted-foreground" />
    default: return <Phone className="h-4 w-4" />
  }
}

function getFollowUpBadge(status: string) {
  switch (status) {
    case "auto-sms": return <Badge className="bg-primary/10 text-primary border-primary/20">Auto SMS sent</Badge>
    case "pending": return <Badge variant="outline" className="text-amber-500 border-amber-500/30">Pending</Badge>
    case "replied": return <Badge className="bg-primary/10 text-primary border-primary/20">Customer replied</Badge>
    default: return <span className="text-muted-foreground text-sm">-</span>
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const dayMs = 86400000
  if (diff < dayMs) return `Today ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
  if (diff < 2 * dayMs) return `Yesterday ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + ` ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
}

export default function CallsPage() {
  const MOCK_CALLS = useAppStore((s) => s.calls)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [followUpFilter, setFollowUpFilter] = useState("all")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const filtered = useMemo(() => {
    let out = [...MOCK_CALLS]
    if (search) {
      const q = search.toLowerCase()
      out = out.filter(c => c.caller.toLowerCase().includes(q) || c.phone.includes(q))
    }
    if (typeFilter !== "all") out = out.filter(c => c.type === typeFilter)
    if (followUpFilter !== "all") out = out.filter(c => c.followUp === followUpFilter)
    out.sort((a, b) => sortDir === "desc"
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    return out
  }, [search, typeFilter, followUpFilter, sortDir])

  const stats = {
    total: MOCK_CALLS.length,
    missed: MOCK_CALLS.filter(c => c.type === "missed").length,
    recovered: MOCK_CALLS.filter(c => c.followUp === "auto-sms" || c.followUp === "replied").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Call Log</h1>
          <p className="text-sm text-muted-foreground">Complete history of all inbound calls and follow-ups</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.success("CSV exported (demo)")}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Phone className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total calls today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <PhoneMissed className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.missed}</p>
                <p className="text-xs text-muted-foreground">Missed calls</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.recovered}</p>
                <p className="text-xs text-muted-foreground">Auto-recovered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-foreground">All Calls</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search caller or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 w-[200px] bg-background border-border text-foreground"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-[130px] bg-background border-border text-foreground">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="voicemail">Voicemail</SelectItem>
                </SelectContent>
              </Select>
              <Select value={followUpFilter} onValueChange={setFollowUpFilter}>
                <SelectTrigger className="h-9 w-[140px] bg-background border-border text-foreground">
                  <SelectValue placeholder="Follow-up" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All follow-ups</SelectItem>
                  <SelectItem value="auto-sms">Auto SMS</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Caller</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Phone</TableHead>
                  <TableHead className="text-muted-foreground cursor-pointer" onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")}>
                    <span className="flex items-center gap-1">
                      Date <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">Duration</TableHead>
                  <TableHead className="text-muted-foreground">Follow-up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((call) => (
                  <TableRow key={call.id} className="border-border hover:bg-muted/30">
                    <TableCell>{getTypeIcon(call.type)}</TableCell>
                    <TableCell className="font-medium text-foreground">{call.caller}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">{call.phone}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(call.date)}</TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">{call.duration}</TableCell>
                    <TableCell>{getFollowUpBadge(call.followUp)}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No calls match your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {MOCK_CALLS.length} calls
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
