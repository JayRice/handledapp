"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDevMode } from "@/components/providers/dev-mode-provider"
import { useAppStore } from "@/lib/store/app-store"
import {
  QUICK_REPLIES,
  AI_SUGGESTIONS,
  STATUS_COLORS,
  STATUS_LABELS,
  FILTERS,
} from "@/lib/mock/seed-data"
import type {Conversation, ConversationStatus, ConversationUpdate, Message} from "@/types/handled"
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
import {useAuth} from "@/components/providers/AuthProvider";
import {useConversations} from "@/hooks/useConversations";
import { InboxSkeleton } from "@/components/handled/common/skeletons"
import {MessagesPage, useMessages} from "@/hooks/useMessages";


import { createClient } from "@/lib/supabase/client"
import {formatChattyTime} from "@/lib/utils/formatChattyTime";
import {EditText} from "@/components/handled/EditText";


import {GhostConversationType, GhostMessageType} from "@/lib/types/ghost";
import {useConversationsRealtime} from "@/hooks/useConversationsRealtime";

export default function InboxPage() {
  const { devMode } = useDevMode()
  const { organization} = useAuth();
  const searchParams = useSearchParams()
  const router = useRouter()


  const { data: conversationPages,
    error,
    isLoading: isConversationsLoading,
    size: convoPgSize,
    setSize: setConvoPgSize,
    mutate: mutateConversations } = useConversations();

  const conversations = conversationPages?.flatMap(page => page.items) ?? []

  useConversationsRealtime(conversations, mutateConversations)



  const paramId = searchParams.get("c")
  const [activeConvo, setActiveConvo] = useState<string | null>(null)
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [composer, setComposer] = useState("")
  const [showOptOutDialog, setShowOptOutDialog] = useState(false)
  const [mobileShowThread, setMobileShowThread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)


  const [ghostConversations, setGhostConversations] = useState<Record<string, GhostConversationType>>({})
  const [ghostMessages, setGhostMessages] = useState<Record<string, GhostMessageType >>({})

  const [messageLoading, setMessageLoading] = useState(false)


  const {
    data: msgPages,
    size: msgSize,
    setSize: setMsgSize,
    mutate: mutateMessages,
    isValidating: isMessagesValidating,
  } = useMessages(activeConvo, 50)

  // flatten pages into one list
  const pages = msgPages?.flatMap(p => p.messages) ?? []

  const all_messages = pages.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  // whether more older messages exist
  const hasMoreOlderMessages =
      msgPages?.length ? Boolean(msgPages[msgPages.length - 1]?.nextCursor) : false

  const [convoCursor, setConvoCursor] = useState<string | null>(null)
  const [convoHasMore, setConvoHasMore] = useState(true)
  const [convoLoading, setConvoLoading] = useState(false)
  const convoListRef = useRef<HTMLDivElement | null>(null)


  const [msgCursor, setMsgCursor] = useState<string | null>(null)
  const [msgHasMore, setMsgHasMore] = useState(true)
  const messagesListRef = useRef<HTMLDivElement | null>(null)


  const canLoadRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      canLoadRef.current = true
    }, 3000)

    return () => clearTimeout(timer)
  }, [])


  useEffect(() => {
    const cParam = searchParams.get("c")
    if (cParam) {
      setActiveConvo(cParam)
      setMobileShowThread(true)
    }
  }, [searchParams])

  useEffect(() => {
    if(messageLoading) {return}
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  }, [activeConvo, all_messages])

  useEffect(() => {
    if (!activeConvo) return


    const supabase = createClient()

    console.log("created")
    const channel = supabase
        .channel(`messages:${activeConvo}`)
        .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `conversation_id=eq.${activeConvo}`,
            },
             () => {
              // simplest: refetch messages for that convo
               mutateMessages()


            }
        )
        .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeConvo, mutateMessages])

  useEffect(() => {
    if (!activeConvo) return
    setMsgCursor(null)
    setMsgHasMore(true)
    // load initial page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvo])


  async function loadMoreConversations(limit: 10 | 50 = 10) {
    if (!canLoadRef.current) {return}

    console.log('loading more convos: ', convoHasMore)
    if (convoLoading || !convoHasMore ) return
    setConvoPgSize(convoPgSize + 1);
  }

  function onConvoScroll() {
    const el = convoListRef.current
    if (!el) return

    const threshold = 160 // px from bottom
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold

    if (nearBottom) loadMoreConversations(10)
  }



  async function loadOlderMessages(limit: 10 | 50 = 50) {

    if (!canLoadRef.current) {return}
    console.log('loading more messages: ', hasMoreOlderMessages)

    if (messageLoading || !hasMoreOlderMessages) return
    setMsgSize(msgSize + 1)
  }


  function onMessagesScroll() {
    const el = messagesListRef.current
    if (!el) return

    const threshold = 120 // px from top
    const nearTop = el.scrollTop <= threshold

    if (nearTop) loadOlderMessages(50)
  }


  function selectConversation(id: string) {
    setActiveConvo(id)
    setMobileShowThread(true)
    router.replace(`/app/inbox?c=${id}`, { scroll: false })
  }

  async function updateConversation(id: string, updates: ConversationUpdate) {
    // optimistic overlay
    setGhostConversations(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), ...updates },
    }))

    const res = await fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })

    if (!res.ok) {
      // rollback optimistic overlay
      setGhostConversations(prev => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
      return
    }

    const {data} = await res.json()

    // write server truth into SWR cache (NO refetch)
    await mutateConversations(
        pages => {
          if (!pages) return pages

          return pages.map(page => ({
            ...page,
            items: page.items.map(c =>
                c.id === id ? { ...c, ...data } : c
            ),
          }))
        },
        false
    )

    // clear ghost overlay
    setGhostConversations(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })

    // DO NOT immediately mutateConversations() refetch here
    // Let realtime / periodic revalidate handle it
  }
  function handleStatusChange(id: string, status: ConversationStatus) {
    updateConversation(id, {status: status})
    toast.success(`Status changed to ${STATUS_LABELS[status]} (demo)`)
  }

  async function handleSend() {
    if (!composer.trim() || !activeConvo) return

    const reference_id = crypto.randomUUID()

    const ghostMessage: GhostMessageType = {
      text: composer.trim(),
      delivery_status: "sending",
      created_at: new Date().toISOString(),
      id: reference_id,
      source: "manual",
      sender: "us",
      conversation_id: ""
    }

    // IMPORTANT: functional update (avoids stale ghostMessages)
    setGhostMessages(prev => ({ ...prev, [reference_id]: ghostMessage }))

    setComposer("")

    const res = await fetch(`/api/conversations/${activeConvo}`, {
      method: "POST",
      body: JSON.stringify({ input_message: ghostMessage.text, reference_key: reference_id }),
      headers: { "Content-Type": "application/json" },
    })

    const json = await res.json()
    const referenceKey = json.reference_key as string
    const message = json.message;



    if (!message) {return}
    // Always attempt removal using functional update
    setGhostMessages(prev => {
      if (!(referenceKey in prev)) return prev
      const copy = { ...prev }

      copy[referenceKey] = {...copy[referenceKey], id: message.id, conversation_id: message.conversation_id , delivery_status: "sent"}
      return copy
    })
  }
  function handleOptOut() {
    if (!activeConvo) return
    // setConversationStatus(activeConvo, "opted_out")
    setShowOptOutDialog(false)
    toast.success("Contact opted out (demo)")
  }


  const currentGhostConversation = activeConvo ? (ghostConversations[activeConvo] as Conversation) : null;

  if (isConversationsLoading && conversations?.length == 0) return <InboxSkeleton/>
  if (error) return <div>Failed to load conversations.</div>


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

  const filtered = conversations?.filter((c) => {
    if (filter !== "All") {
      const filterKey = filter.toLowerCase().replace(" ", "_")
      if ((ghostConversations[c.id]?.status || c.status) !== filterKey) return false
    }
    if (search) {
      const q = search.toLowerCase()
      return (ghostConversations[c.id].caller_name || c.caller_name)?.toLowerCase().includes(q) || c.caller_number?.includes(q)
    }
    return true
  })

  const active = conversations?.find((c) => c.id === activeConvo)


  console.log("messages: ", all_messages)
  const messages = [
    ...(all_messages || []),
    ...Object.values(ghostMessages).filter(
        ghost => !(all_messages || []).some(m => (m.id === ghost.id) )
    )
  ]
  const mergedConversations = (conversations ?? []).map(c => ({
    ...c,
    ...(ghostConversations[c.id] ?? {}),
  }))


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
          <div ref={convoListRef} onScroll={onConvoScroll} className="flex-1 overflow-y-auto flex-wrap gap-1">
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
                    { mergedConversations?.filter((c) => c.status === f.toLowerCase().replace(" ", "_")).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">No conversations</p>
              <p className="text-xs text-muted-foreground">No conversations match your filter.</p>
            </div>
          ) : (
            filtered?.map((convo) => {
              return (
              <button
                key={convo.id}
                onClick={() => selectConversation(convo.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border/50 p-3 text-left transition-colors",
                  activeConvo === convo.id ? "bg-accent" : "hover:bg-muted/30"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                  {(ghostConversations[convo.id]?.caller_name || convo?.caller_name)?.split(" ").slice(0,2).map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm font-medium", ghostConversations[convo.id]?.unread || convo.unread ? "text-foreground" : "text-muted-foreground")}>{convo.caller_name}</span>
                    <span className="text-[10px] text-muted-foreground">{formatChattyTime(convo.last_message_at)}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{ghostConversations[convo.id]?.last_message_preview || convo.last_message_preview}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", STATUS_COLORS[ghostConversations[convo.id]?.status || convo.status])}>
                      {STATUS_LABELS[ghostConversations[convo.id]?.status || convo.status]}
                    </Badge>
                  </div>
                </div>
                {ghostConversations[convo.id]?.unread || convo.unread && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            )
            })
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
                  <EditText
                      value={currentGhostConversation?.caller_name || active.caller_name}
                      placeholder="Unknown"
                      className="text-sm font-medium text-muted-foreground"
                      onChange={(v) => {
                      }
                      }
                      onCommit={async (v) => {
                        if (!active) {return}
                        if (!activeConvo) {return}


                        if (active.caller_name === v) {return}

                        setGhostConversations((prev) => ({ ...prev, [activeConvo]: {...ghostConversations[activeConvo], caller_name: v } }));

                        await updateConversation(activeConvo , { caller_name: v })

                      }}
                  />
                  <p className="text-xs text-muted-foreground">{active.caller_number} </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={currentGhostConversation?.status || active.status}
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

            <div ref={messagesListRef} onScroll={onMessagesScroll} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg) => (
                  <div
                      key={msg.id}
                      className={cn(
                          "flex flex-col max-w-[75%]",
                          msg.sender === "us"
                              ? "items-end self-end"
                              : msg.sender === "system"
                                  ? "items-center self-center max-w-full"
                                  : "items-start self-start",

                          msg.delivery_status === "sending" && "opacity-60"
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
                    <span className="text-[10px] text-muted-foreground">{formatChattyTime(msg.created_at)}</span>
                    {msg.source == "automation" && (
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
                    disabled={messageLoading}
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
                        <Button variant="outline" size="sm" className="h-7 text-xs" disabled={messageLoading}>Quick replies <ChevronDown className="ml-1 h-3 w-3" /></Button>
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
                            <Button key={s.label} variant="outline" size="sm" className="justify-start text-xs" disabled={messageLoading} onClick={() => { setComposer(s.text); toast.info("AI suggestion applied") }}>
                              {s.label}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button  size="icon" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSend} disabled={!composer.trim() || messageLoading} aria-label="Send message">
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
              This will stop all automated messages to {active?.caller_number}. They will be added to the opt-out list. This action can be reversed from the opt-outs page.
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
