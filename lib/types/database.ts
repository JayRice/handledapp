export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          owner_name: string
          owner_email: string
          owner_phone: string | null
          trade: string | null
          timezone: string
          business_hours: Json
          tone_preset: 'professional' | 'friendly'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_name: string
          owner_email: string
          owner_phone?: string | null
          trade?: string | null
          timezone?: string
          business_hours?: Json
          tone_preset?: 'professional' | 'friendly'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_name?: string
          owner_email?: string
          owner_phone?: string | null
          trade?: string | null
          timezone?: string
          business_hours?: Json
          tone_preset?: 'professional' | 'friendly'
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id: string
          organization_id: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
      }
      phone_numbers: {
        Row: {
          id: string
          organization_id: string
          provider: string
          provider_number_id: string
          phone_number: string
          forward_to_number: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          provider?: string
          provider_number_id: string
          phone_number: string
          forward_to_number: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          provider?: string
          provider_number_id?: string
          phone_number?: string
          forward_to_number?: string
          is_active?: boolean
          created_at?: string
        }
      }
      calls: {
        Row: {
          id: string
          organization_id: string
          phone_number_id: string
          caller_number: string | null
          call_status: 'answered' | 'missed' | 'busy' | 'failed'
          duration_seconds: number
          provider_call_id: string | null
          started_at: string
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          phone_number_id: string
          caller_number?: string | null
          call_status: 'answered' | 'missed' | 'busy' | 'failed'
          duration_seconds?: number
          provider_call_id?: string | null
          started_at: string
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          phone_number_id?: string
          caller_number?: string | null
          call_status?: 'answered' | 'missed' | 'busy' | 'failed'
          duration_seconds?: number
          provider_call_id?: string | null
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          organization_id: string
          phone_number_id: string
          caller_number: string | null
          status: 'new' | 'in_progress' | 'booked' | 'lost' | 'spam' | 'opted_out'
          last_message_at: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          phone_number_id: string
          caller_number?: string | null
          status?: 'new' | 'in_progress' | 'booked' | 'lost' | 'spam' | 'opted_out'
          last_message_at?: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          phone_number_id?: string
          caller_number?: string | null
          status?: 'new' | 'in_progress' | 'booked' | 'lost' | 'spam' | 'opted_out'
          last_message_at?: string
          metadata?: Json
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          direction: 'inbound' | 'outbound'
          body: string
          provider_message_id: string | null
          delivery_status: 'sent' | 'failed' | 'delivered' | 'unknown'
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          direction: 'inbound' | 'outbound'
          body: string
          provider_message_id?: string | null
          delivery_status?: 'sent' | 'failed' | 'delivered' | 'unknown'
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          direction?: 'inbound' | 'outbound'
          body?: string
          provider_message_id?: string | null
          delivery_status?: 'sent' | 'failed' | 'delivered' | 'unknown'
          created_at?: string
        }
      }
      automations: {
        Row: {
          id: string
          organization_id: string
          missed_call_enabled: boolean
          followup_enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          missed_call_enabled?: boolean
          followup_enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          missed_call_enabled?: boolean
          followup_enabled?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          provider_event_id: string
          event_type: string
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          provider_event_id: string
          event_type: string
          payload?: Json
          created_at?: string
        }
        Update: {
          id?: string
          provider_event_id?: string
          event_type?: string
          payload?: Json
          created_at?: string
        }
      }
      outbox_jobs: {
        Row: {
          id: string
          organization_id: string
          type: 'missed_call_initial' | 'followup_1' | 'followup_2'
          conversation_id: string | null
          run_at: string
          status: 'queued' | 'processing' | 'done' | 'failed' | 'cancelled'
          attempts: number
          last_error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          type: 'missed_call_initial' | 'followup_1' | 'followup_2'
          conversation_id?: string | null
          run_at: string
          status?: 'queued' | 'processing' | 'done' | 'failed' | 'cancelled'
          attempts?: number
          last_error?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          type?: 'missed_call_initial' | 'followup_1' | 'followup_2'
          conversation_id?: string | null
          run_at?: string
          status?: 'queued' | 'processing' | 'done' | 'failed' | 'cancelled'
          attempts?: number
          last_error?: string | null
          created_at?: string
        }
      }
      billing: {
        Row: {
          organization_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'paused'
          trial_ends_at: string | null
          current_period_end: string | null
          created_at: string
        }
        Insert: {
          organization_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'paused'
          trial_ends_at?: string | null
          current_period_end?: string | null
          created_at?: string
        }
        Update: {
          organization_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'paused'
          trial_ends_at?: string | null
          current_period_end?: string | null
          created_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          organization_id: string
          month_year: string
          sms_sent: number
          voice_minutes_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          month_year: string
          sms_sent?: number
          voice_minutes_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          month_year?: string
          sms_sent?: number
          voice_minutes_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          organization_id: string
          subject: string
          message: string
          status: 'open' | 'in_progress' | 'resolved'
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          subject: string
          message: string
          status?: 'open' | 'in_progress' | 'resolved'
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          subject?: string
          message?: string
          status?: 'open' | 'in_progress' | 'resolved'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_month_usage: {
        Args: { org_id: string }
        Returns: { sms_sent: number; voice_minutes_used: number }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
