"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDevMode } from "@/components/handled/providers/dev-mode-provider"
import { useAppStore } from "@/lib/store/app-store"
import {
  QUICK_REPLIES,
  AI_SUGGESTIONS,
  STATUS_COLORS,
  STATUS_LABELS,
  FILTERS,
} from "@/lib/mock/seed-data"
import type { ConversationStatus } from "@/types/handled"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Search,
  Send,
  MoreVertical,
  CalendarCheck,
  X,
  AlertTriangle,
  Ban,
  ChevronDown,
  Sparkles,
  MessageSquare,
  Inbox,
  Unplug,
  ArrowLeft,
} from "lucide-react"
import { toast } from "sonner"

export default function InboxPage() {
  const { devMode } = useDevMode()
  const searchParams = useSearchParams()
  const router = useRouter()

  const conversations = useAppStore((s) => s.conversations)
  const messages = useAppStore((s) => s.messages)
  const setConversationStatus = useAppStore((s) => s.setConversationStatus)
  const addMessage = useAppStore((s) => s.addMessage)

  const paramId = searchParams.get("c")
  const [activeConvo, setActiveConvo] = useState<number | null>(paramId ? Number(paramId) : null)
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [composer, setComposer] = useState("")
  const [showOptOutDialog, setShowOptOutDialog] = useState(false)
  const [mobileShowThread, setMobileShowThread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cParam = searchParams.get("c")
    if (cParam) {
      setActiveConvo(Number(cParam))
      setMobileShowThread(true)
    }
  }, [searchParams])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeConvo])

  function selectConversation(id: number) {
    setActiveConvo(id)
    setMobileShowThread(true)
    router.replace(`/app/inbox?c=${id}`, { scroll: false })
  }

  function handleStatusChange(id: number, status: ConversationStatus) {
    setConversationStatus(id, status)
    toast.success(`Status changed to ${STATUS_LABELS[status]} (demo)`)
  }

  function handleSend() {
    if (!composer.trim() || !activeConvo) return
    addMessage(activeConvo, {
      conversationId: activeConvo,
      sender: "us",
      text: composer.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    })
    setComposer("")
    toast.success("Message sent (demo)")
  }

  function handleOptOut() {
    if (!activeConvo) return
    setConversationStatus(activeConvo, "opted_out")
    setShowOptOutDialog(false)
    toast.success("Contact opted out (demo)")
  }

  if (!devMode) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <Unplug className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-3 text-lg font-semibold text-foreground">Backend not connected</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">Connect Supabase and Twilio to load conversations. Enable Dev Mode to preview with mock data.</p>
        </div>
      </div>
    )
  }

  const filtered = conversations.filter((c) => {
    if (filter !== "All") {
      const filterKey = filter.toLowerCase().replace(" ", "_")
      if (c.status !== filterKey) return false
    }
    if (search) {
      const q = search.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.phone.includes(q)
    }
    return true
  })

  const active = conversations.find((c) => c.id === activeConvo)
  const activeMessages = activeConvo ? messages[activeConvo] || [] : []

  return (
    <div className="-mx-4 -my-4 lg:-mx-6 lg:-my-6 flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left panel */}
      <div className={cn(
        "flex w-full flex-col border-r border-border md:w-80 lg:w-96",
        mobileShowThread && "hidden md:flex"
      )}>
        <div className="flex flex-col gap-2 border-b border-border p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 h-8 text-sm bg-muted/30" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-2 py-1 text-xs transition-colors",
                  filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
                {f !== "All" && (
                  <span className="ml-1 opacity-60">
                    {conversations.filter((c) => c.status === f.toLowerCase().replace(" ", "_")).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">No conversations</p>
              <p className="text-xs text-muted-foreground">No conversations match your filter.</p>
            </div>
          ) : (
            filtered.map((convo) => (
              <button
                key={convo.id}
                onClick={() => selectConversation(convo.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border/50 p-3 text-left transition-colors",
                  activeConvo === convo.id ? "bg-accent" : "hover:bg-muted/30"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                  {convo.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm font-medium", convo.unread ? "text-foreground" : "text-muted-foreground")}>{convo.name}</span>
                    <span className="text-[10px] text-muted-foreground">{convo.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{convo.lastMessage}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", STATUS_COLORS[convo.status])}>
                      {STATUS_LABELS[convo.status]}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{convo.trade}</span>
                  </div>
                </div>
                {convo.unread && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className={cn(
        "flex-1 flex-col",
        mobileShowThread ? "flex" : "hidden md:flex"
      )}>
        {active ? (
          <>
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="md:hidden text-muted-foreground"
                  onClick={() => {
                    setMobileShowThread(false)
                    router.replace("/app/inbox", { scroll: false })
                  }}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{active.name}</h2>
                  <p className="text-xs text-muted-foreground">{active.phone} - {active.trade}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={active.status}
                  onValueChange={(v) => handleStatusChange(active.id, v as ConversationStatus)}
                >
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                  </SelectContent>
                </Select>

                <Button size="sm" variant="outline" className="h-8 text-xs hidden sm:flex" onClick={() => handleStatusChange(active.id, "booked")}>
                  <CalendarCheck className="mr-1 h-3 w-3" /> Booked
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs hidden sm:flex" onClick={() => handleStatusChange(active.id, "lost")}>
                  <X className="mr-1 h-3 w-3" /> Lost
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="More actions"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="sm:hidden" onClick={() => handleStatusChange(active.id, "booked")}>
                      <CalendarCheck className="mr-2 h-4 w-4" /> Mark booked
                    </DropdownMenuItem>
                    <DropdownMenuItem className="sm:hidden" onClick={() => handleStatusChange(active.id, "lost")}>
                      <X className="mr-2 h-4 w-4" /> Mark lost
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(active.id, "spam")}>
                      <AlertTriangle className="mr-2 h-4 w-4" /> Mark spam
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowOptOutDialog(true)} className="text-destructive focus:text-destructive">
                      <Ban className="mr-2 h-4 w-4" /> Opt out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[75%]",
                    msg.sender === "us" ? "items-end self-end" : msg.sender === "system" ? "items-center self-center max-w-full" : "items-start self-start"
                  )}
                >
                  {msg.sender === "system" ? (
                    <div className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">{msg.text}</div>
                  ) : (
                    <div className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm",
                      msg.sender === "us" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                    )}>
                      {msg.text}
                    </div>
                  )}
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                    {msg.auto && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 border-primary/30 text-primary">Auto</Badge>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border p-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea
                    placeholder="Type a message..."
                    className="min-h-[60px] resize-none text-sm bg-muted/30"
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">Quick replies <ChevronDown className="ml-1 h-3 w-3" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {QUICK_REPLIES.map((r) => (
                          <DropdownMenuItem key={r} onClick={() => setComposer(r)}>{r}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Sparkles className="mr-1 h-3 w-3" /> AI assist
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium text-foreground">AI suggestions</p>
                          {AI_SUGGESTIONS.map((s) => (
                            <Button key={s.label} variant="outline" size="sm" className="justify-start text-xs" onClick={() => { setComposer(s.text); toast.info("AI suggestion applied") }}>
                              {s.label}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button size="icon" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSend} disabled={!composer.trim()} aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">Select a conversation</p>
              <p className="text-xs text-muted-foreground">Click on a conversation from the list to view it here.</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showOptOutDialog} onOpenChange={setShowOptOutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opt out this contact?</DialogTitle>
            <DialogDescription>
              This will stop all automated messages to {active?.name}. They will be added to the opt-out list. This action can be reversed from the opt-outs page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOptOutDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleOptOut}>Confirm opt out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
