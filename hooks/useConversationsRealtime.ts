import {useEffect, useMemo, useRef} from "react"
import { createClient } from "@/lib/supabase/client"
import {Conversation} from "@/types/handled"; // your browser client

export function useConversationsRealtime(
    conversations: Conversation[] | undefined,
    mutateConversations: (data?: any, opts?: any) => any
) {

    const idsRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        idsRef.current = new Set((conversations ?? []).map(c => c.id))
    }, [conversations])

    useEffect(() => {
        const supabase = createClient()

        const channel = supabase
            .channel("rt:conversations")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "conversations" },
                (payload) => {
                    const row = (payload.new ?? payload.old) as Conversation | null
                    if (!row?.id) return

                    // only apply if this convo is in our current list
                    if (!idsRef.current.has(row.id)) return

                    // patch SWR cache in memory (no refetch)
                    mutateConversations((curr: Conversation[] = []) => {
                        const i = curr.findIndex(c => c.id === row.id)
                        if (i === -1) return curr
                        const copy = curr.slice()
                        copy[i] = { ...copy[i], ...row }
                        return copy
                    }, false)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [idsRef, mutateConversations])
}