// hooks/useMessages.ts
"use client"

import useSWR from "swr"
import {Message} from "@/types/handled";

const fetcher = async <T>(url: string): Promise<T> => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(await res.text())
    return res.json()
}



export function useMessages(conversationId: string | null) {
    return useSWR<{messages: Message[], nextCursor: string, conversationId: string}>(
        conversationId ? `/api/conversations/${conversationId}/messages?limit=50` : null,
        fetcher,
        { keepPreviousData: true }
    )
}