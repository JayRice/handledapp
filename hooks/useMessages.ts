// hooks/useMessages.ts
import useSWRInfinite from "swr/infinite"
import { Message } from "@/types/handled"

import {fetcher} from "@/lib/utils/common-utilities";

export type MessagesPage = {
    conversationId: string
    messages: Message[]
    nextCursor: string | null
}

export function useMessages(conversationId: string | null, limit = 50) {
    return useSWRInfinite<MessagesPage>(
        (pageIndex, prev) => {
            if (!conversationId) return null
            if (prev && !prev.nextCursor) return null

            const base = `/api/conversations/${conversationId}/messages?limit=${limit}`
            if (pageIndex === 0) return base
            return `${base}&cursor=${encodeURIComponent(prev?.nextCursor)}`
        },
        fetcher,
        {
            revalidateFirstPage: false,
        }
    )
}