import useSWRInfinite from "swr/infinite"
import {Conversation} from "@/types/handled";

import {fetcher} from "@/lib/utils/common-utilities";

export function useConversations(limit = 50) {
    return useSWRInfinite<ConversationsCache>(
        (pageIndex, previousPageData) => {
            if (previousPageData && !previousPageData.nextCursor) return null

            if (pageIndex === 0)
                return `/api/conversations?limit=${limit}`

            return `/api/conversations?limit=${limit}&cursor=${previousPageData?.nextCursor}`
        },
        fetcher
    )
}
export type ConversationsCache = {
    items: Conversation[]
    nextCursor: string | null
}