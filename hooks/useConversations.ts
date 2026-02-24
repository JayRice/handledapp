import useSWR from "swr"
import {Conversation} from "@/types/handled";

const fetcher = async <T>(url: string): Promise<T> =>
    fetch(url).then((res) => res.json())

export function useConversations() {
    return useSWR<Conversation[]>("/api/conversations", fetcher)
}