import useSWR from "swr"
import {Call, Conversation} from "@/types/handled";

const fetcher = async <T>(url: string): Promise<T> =>
    fetch(url).then((res) => res.json())

export function useCalls() {
    return useSWR<Call[]>("/api/calls", fetcher)
}