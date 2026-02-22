"use client"

import { useState } from "react"
import { useDevMode } from "@/components/providers/dev-mode-provider"
import { useAppStore } from "@/lib/store/app-store"
import { SectionHeader } from "@/components/handled/common/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Clock,
  Zap,
  Plus,
  Pencil,
  Copy,
  Trash2,
  Phone,
  Calendar,
  Star,
  ArrowRight,
  Unplug,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"

import type { Automation } from "@/types/handled"

function getTriggerLabel(trigger: string) {
  switch (trigger) {
    case "missed_call": return "Missed Call"
    case "after_hours": return "After Hours"
    case "no_reply": return "No Reply"
    case "job_complete": return "Job Complete"
    default: return trigger
  }
}

function getTriggerIcon(trigger: string) {
  switch (trigger) {
    case "missed_call": return <Phone className="h-4 w-4" />
    case "after_hours": return <Clock className="h-4 w-4" />
    case "no_reply": return <MessageSquare className="h-4 w-4" />
    case "job_complete": return <Star className="h-4 w-4" />
    default: return <Zap className="h-4 w-4" />
  }
}

function getDelayLabel(delay: string) {
  switch (delay) {
    case "instant": return "Instant"
    case "30_seconds": return "30 seconds"
    case "2_minutes": return "2 minutes"
    case "5_minutes": return "5 minutes"
    case "2_hours": return "2 hours"
    case "24_hours": return "24 hours"
    default: return delay
  }
}

export default function AutomationsPage() {
  const { devMode } = useDevMode()
  const automations = useAppStore((s) => s.automations)
  const storeToggle = useAppStore((s) => s.toggleAutomation)
  const storeUpdate = useAppStore((s) => s.updateAutomation)
  const storeAdd = useAppStore((s) => s.addAutomation)
  const storeDelete = useAppStore((s) => s.deleteAutomation)
  const resetAll = useAppStore((s) => s.resetAll)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingAuto, setEditingAuto] = useState<Automation | null>(null)
  const [newName, setNewName] = useState("")
  const [newTrigger, setNewTrigger] = useState("missed_call")
  const [newMessage, setNewMessage] = useState("")
  const [newDelay, setNewDelay] = useState("instant")

  // Edit form state
  const [editName, setEditName] = useState("")
  const [editTrigger, setEditTrigger] = useState("")
  const [editMessage, setEditMessage] = useState("")
  const [editDelay, setEditDelay] = useState("")

  function openEdit(auto: Automation) {
    if (!devMode) {
      toast.info("Not connected yet. Enable Dev Mode to edit.")
      return
    }
    setEditingAuto(auto)
    setEditName(auto.)
    setEditTrigger(auto.trigger)
    setEditMessage(auto.message)
    setEditDelay(auto.delay)
    setEditOpen(true)
  }

  function saveEdit() {
    if (!editingAuto) return
    storeUpdate(editingAuto.id, { name: editName, trigger: editTrigger, message: editMessage, delay: editDelay })
    setEditOpen(false)
    toast.success("Automation updated (demo)")
  }

  function toggleAutomation(id: string) {
    if (!devMode) { toast.info("Not connected yet. Enable Dev Mode to toggle."); return }
    storeToggle(id)
    const auto = automations.find(a => a.id === id)
    toast.success(auto?.enabled ? `"${auto.name}" disabled (demo)` : `"${auto?.name}" enabled (demo)`)
  }

  function duplicateAutomation(id: string) {
    if (!devMode) { toast.info("Not connected yet."); return }
    const auto = automations.find(a => a.id === id)
    if (!auto) return
    storeAdd({ ...auto, id: Date.now().toString(), name: `${auto.name} (Copy)`, enabled: false, sends: 0, replies: 0, bookings: 0 })
    toast.success("Automation duplicated (demo)")
  }

  function deleteAutomation(id: string) {
    if (!devMode) { toast.info("Not connected yet."); return }
    storeDelete(id)
    toast.success("Automation deleted (demo)")
  }

  function createAutomation() {
    if (!newName || !newMessage) { toast.error("Please fill in all fields"); return }
    storeAdd({
      id: Date.now().toString(),
      name: newName,
      trigger: newTrigger,
      message: newMessage,
      delay: newDelay,
      enabled: true,
      sends: 0,
      replies: 0,
      bookings: 0,
    })
    setNewName(""); setNewMessage(""); setNewTrigger("missed_call"); setNewDelay("instant")
    setCreateOpen(false)
    toast.success("Automation created (demo)")
  }

  function resetDefaults() {
    resetAll()
    toast.success("All data reset to defaults (demo)")
  }

  if (!devMode) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Automations" description="Configure automatic SMS follow-ups for every scenario" />
        <div className="flex items-center justify-center py-20 text-center">
          <div>
            <Unplug className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-3 text-lg font-semibold text-foreground">Backend not connected</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">Connect your backend to configure automations. Enable Dev Mode to preview with mock data.</p>
          </div>
        </div>
      </div>
    )
  }

  const activeCount = automations.filter(a => a.enabled).length
  const totalSends = automations.reduce((s, a) => s + a.sends, 0)
  const totalReplies = automations.reduce((s, a) => s + a.replies, 0)
  const totalBookings = automations.reduce((s, a) => s + a.bookings, 0)

  return (
    <div className="space-y-6">
      <SectionHeader title="Automations" description="Configure automatic SMS follow-ups for every scenario">
        <Button variant="outline" size="sm" className="gap-2" onClick={resetDefaults}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset defaults
        </Button>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" /> New Automation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Automation</DialogTitle>
              <DialogDescription>Set up a new auto-response rule</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-foreground">Automation Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Weekend Auto Reply" className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Trigger</Label>
                <Select value={newTrigger} onValueChange={setNewTrigger}>
                  <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="missed_call">Missed Call</SelectItem>
                    <SelectItem value="after_hours">After Hours Call</SelectItem>
                    <SelectItem value="no_reply">No Reply (Follow-up)</SelectItem>
                    <SelectItem value="job_complete">Job Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Delay</Label>
                <Select value={newDelay} onValueChange={setNewDelay}>
                  <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="30_seconds">30 seconds</SelectItem>
                    <SelectItem value="2_minutes">2 minutes</SelectItem>
                    <SelectItem value="5_minutes">5 minutes</SelectItem>
                    <SelectItem value="2_hours">2 hours</SelectItem>
                    <SelectItem value="24_hours">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Message</Label>
                <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your auto-response message..." rows={4} className="bg-background border-border text-foreground resize-none" />
                <p className="text-xs text-muted-foreground">{newMessage.length}/320 characters</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={createAutomation} className="bg-primary text-primary-foreground hover:bg-primary/90">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SectionHeader>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active automations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <MessageSquare className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalSends.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">SMS sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <ArrowRight className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalReplies.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Replies received</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalBookings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Jobs booked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All ({automations.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({automations.length - activeCount})</TabsTrigger>
        </TabsList>

        {["all", "active", "inactive"].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {automations
              .filter(a => tab === "all" || (tab === "active" ? a.enabled : !a.enabled))
              .map(auto => (
                <Card key={auto.id} className={`border-border bg-card transition-all ${!auto.enabled ? "opacity-60" : ""}`}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Switch checked={auto.enabled} onCheckedChange={() => toggleAutomation(auto.id)} />
                          <div>
                            <h3 className="font-semibold text-foreground">{auto.name}</h3>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge variant="outline" className="gap-1 text-xs border-border text-muted-foreground">
                                {getTriggerIcon(auto.trigger)}
                                {getTriggerLabel(auto.trigger)}
                              </Badge>
                              <Badge variant="outline" className="gap-1 text-xs border-border text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {getDelayLabel(auto.delay)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {/* SMS preview bubble */}
                        <div className="rounded-lg bg-muted/50 p-3 border border-border">
                          <p className="text-sm text-foreground leading-relaxed">{auto.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 lg:gap-8">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold text-foreground">{auto.sends}</p>
                            <p className="text-xs text-muted-foreground">Sent</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-foreground">{auto.replies}</p>
                            <p className="text-xs text-muted-foreground">Replies</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-primary">{auto.bookings}</p>
                            <p className="text-xs text-muted-foreground">Booked</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(auto)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => duplicateAutomation(auto.id)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteAutomation(auto.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Automation Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Automation</DialogTitle>
            <DialogDescription>Modify the automation settings and message template</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Name</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Trigger</Label>
                <Select value={editTrigger} onValueChange={setEditTrigger}>
                  <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="missed_call">Missed Call</SelectItem>
                    <SelectItem value="after_hours">After Hours Call</SelectItem>
                    <SelectItem value="no_reply">No Reply (Follow-up)</SelectItem>
                    <SelectItem value="job_complete">Job Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Delay</Label>
                <Select value={editDelay} onValueChange={setEditDelay}>
                  <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="30_seconds">30 seconds</SelectItem>
                    <SelectItem value="2_minutes">2 minutes</SelectItem>
                    <SelectItem value="5_minutes">5 minutes</SelectItem>
                    <SelectItem value="2_hours">2 hours</SelectItem>
                    <SelectItem value="24_hours">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Message Template</Label>
                <Textarea value={editMessage} onChange={(e) => setEditMessage(e.target.value)} rows={5} className="bg-background border-border text-foreground resize-none" />
                <p className="text-xs text-muted-foreground">{editMessage.length}/320 characters</p>
              </div>
            </div>
            {/* Live SMS preview */}
            <div className="space-y-2">
              <Label className="text-foreground">SMS Preview</Label>
              <div className="rounded-xl border border-border bg-background p-4 h-full min-h-[200px]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Smith HVAC</p>
                      <p className="text-[10px] text-muted-foreground">+1 (555) 867-5309</p>
                    </div>
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-primary px-4 py-2.5 text-sm text-primary-foreground max-w-[90%]">
                    {editMessage || "Your message preview will appear here..."}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {getDelayLabel(editDelay)} after {getTriggerLabel(editTrigger).toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
