import {ConversationUpdate, type Message} from "@/types/handled";

export type GhostConversationType = Pick<
    ConversationUpdate,
    | "status"
    | "unread"
    | "automation_active"
    | "metadata"
    | "caller_name"
    | "last_message_preview"
>

export type GhostMessageType =  Pick<Message, "text" | "delivery_status" | "id" | "source" | "created_at" | "sender" | "conversation_id" >

