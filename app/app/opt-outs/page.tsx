"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  UserX,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

interface OptOut {
  id: string
  phone: string
  name: string | null
  reason: string
  date: string
  source: "auto" | "manual"
}

const INITIAL_OPTOUTS: OptOut[] = [
  { id: "1", phone: "(512) 555-0147", name: "John Smith", reason: "Replied STOP", date: "2026-02-15", source: "auto" },
  { id: "2", phone: "(512) 555-0283", name: null, reason: "Replied STOP", date: "2026-02-14", source: "auto" },
  { id: "3", phone: "(512) 555-0391", name: "Maria Lopez", reason: "Customer request via phone", date: "2026-02-12", source: "manual" },
  { id: "4", phone: "(512) 555-0445", name: "Dave Wilson", reason: "Replied STOP", date: "2026-02-10", source: "auto" },
  { id: "5", phone: "(512) 555-0512", name: null, reason: "Replied UNSUBSCRIBE", date: "2026-02-08", source: "auto" },
  { id: "6", phone: "(512) 555-0628", name: "Lisa Anderson", reason: "Added manually", date: "2026-02-05", source: "manual" },
]

export default function OptOutsPage() {
  const [optOuts, setOptOuts] = useState<OptOut[]>(INITIAL_OPTOUTS)
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [newPhone, setNewPhone] = useState("")
  const [newName, setNewName] = useState("")

  const filtered = search
    ? optOuts.filter(o =>
        o.phone.includes(search) ||
        (o.name && o.name.toLowerCase().includes(search.toLowerCase()))
      )
    : optOuts

  function addOptOut() {
    if (!newPhone) {
      toast.error("Please enter a phone number")
      return
    }
    const newEntry: OptOut = {
      id: Date.now().toString(),
      phone: newPhone,
      name: newName || null,
      reason: "Added manually",
      date: new Date().toISOString().split("T")[0],
      source: "manual",
    }
    setOptOuts(prev => [newEntry, ...prev])
    setNewPhone("")
    setNewName("")
    setAddOpen(false)
    toast.success("Number added to opt-out list")
  }

  function removeOptOut(id: string) {
    setOptOuts(prev => prev.filter(o => o.id !== id))
    toast.success("Number removed from opt-out list. They may receive messages again.")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Opt-Outs</h1>
          <p className="text-sm text-muted-foreground">Manage numbers that have unsubscribed from automated messages</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 border-border text-foreground">
              <Plus className="h-4 w-4" /> Add Number
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add to Opt-Out List</DialogTitle>
              <DialogDescription>This number will no longer receive automated messages</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="(555) 555-0000" className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name (optional)</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Contact name" className="bg-background border-border text-foreground" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={addOptOut} className="bg-primary text-primary-foreground hover:bg-primary/90">Add to List</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border bg-card border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">TCPA Compliance</h3>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                Numbers on this list will never receive automated SMS from your account. When someone replies STOP to any message, they are automatically added here. Removing a number means they may receive automated messages again — only do this with explicit consent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <UserX className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{optOuts.length}</p>
                <p className="text-xs text-muted-foreground">Total opt-outs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <AlertCircle className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{optOuts.filter(o => o.source === "auto").length}</p>
                <p className="text-xs text-muted-foreground">Auto (STOP replies)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Plus className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{optOuts.filter(o => o.source === "manual").length}</p>
                <p className="text-xs text-muted-foreground">Manually added</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-foreground">Opt-Out List</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by phone or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 w-[240px] bg-background border-border text-foreground"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">Reason</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-muted-foreground">Source</TableHead>
                  <TableHead className="text-muted-foreground w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((opt) => (
                  <TableRow key={opt.id} className="border-border hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">{opt.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{opt.name || "Unknown"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">{opt.reason}</TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden md:table-cell">{opt.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${opt.source === "auto" ? "border-primary/20 text-primary" : "border-border text-muted-foreground"}`}>
                        {opt.source === "auto" ? "Auto" : "Manual"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeOptOut(opt.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No opt-outs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Showing {filtered.length} of {optOuts.length} entries</p>
        </CardContent>
      </Card>
    </div>
  )
}
