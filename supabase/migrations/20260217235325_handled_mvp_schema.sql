-- Handled MVP schema (team-ready) + RLS
-- Requires: auth enabled in Supabase project

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
do $$ begin
create type public.trade_type as enum ('hvac','plumbing','electrical','general');
exception when duplicate_object then null; end $$;

do $$ begin
create type public.member_role as enum ('owner','admin','member');
exception when duplicate_object then null; end $$;

do $$ begin
create type public.phone_status as enum ('active','provisioning','inactive');
exception when duplicate_object then null; end $$;

do $$ begin
create type public.call_status as enum ('answered','missed','busy','failed','voicemail');
exception when duplicate_object then null; end $$;

do $$ begin
create type public.conversation_status as enum ('new','in_progress','booked','lost','spam','opted_out');
exception when duplicate_object then null; end $$;

do $$ begin
create type public.message_sender as enum ('them','us','system');
exception when duplicate_object then null; end $$;

do $$ begin
create type public.outbox_job_type as enum ('missed_call_initial','followup_1','followup_2');
exception when duplicate_object then null; end $$;

do $$ begin
create type public.job_status as enum ('queued','processing','done','failed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
create type public.billing_status as enum ('trialing','active','paused','canceled','past_due');
exception when duplicate_object then null; end $$;

do $$ begin
create type public.ticket_priority as enum ('low','medium','high','urgent');
exception when duplicate_object then null; end $$;

do $$ begin
create type public.ticket_status as enum ('open','in_progress','resolved','closed');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- TABLES
-- ------------------------------------------------------------

-- Organizations
create table if not exists public.organizations (
                                                    id uuid primary key default gen_random_uuid(),
    name text not null,
    trade public.trade_type not null default 'general',
    address text,
    timezone text not null default 'America/New_York',
    business_hours jsonb not null default '{"open":"08:00","close":"17:00","days":["mon","tue","wed","thu","fri"]}'::jsonb,
    created_at timestamptz not null default now()
    );

-- Profiles (team members)
create table if not exists public.profiles (
                                               id uuid primary key references auth.users(id) on delete cascade,
    org_id uuid not null references public.organizations(id) on delete cascade,
    email text not null,
    name text not null default '',
    avatar_url text,
    phone text,
    role public.member_role not null default 'member',
    onboarding_complete boolean not null default false,
    timezone text,
    created_at timestamptz not null default now(),
    unique (org_id, email)
    );

create index if not exists idx_profiles_org on public.profiles(org_id);
create index if not exists idx_profiles_role on public.profiles(role);

-- Phone numbers
create table if not exists public.phone_numbers (
                                                    id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    number text not null,                     -- E.164 +15551234567
    label text not null default 'Main',
    status public.phone_status not null default 'provisioning',
    provider text not null default 'twilio',
    provider_number_id text,                  -- Twilio IncomingPhoneNumber SID
    forward_to_number text not null,          -- E.164
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    unique (number),
    unique (provider, provider_number_id)
    );

create index if not exists idx_phone_numbers_org on public.phone_numbers(org_id);

-- Calls
create table if not exists public.calls (
                                            id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    phone_number_id uuid not null references public.phone_numbers(id) on delete cascade,
    caller_number text,                       -- E.164
    provider_call_id text,                    -- Twilio Call SID
    status public.call_status not null,
    duration_seconds int not null default 0,
    started_at timestamptz not null,
    ended_at timestamptz,
    created_at timestamptz not null default now()
    );

create index if not exists idx_calls_org on public.calls(org_id);
create index if not exists idx_calls_started_at on public.calls(started_at desc);
create index if not exists idx_calls_provider_call_id on public.calls(provider_call_id);

-- Conversations
create table if not exists public.conversations (
                                                    id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    phone_number_id uuid not null references public.phone_numbers(id) on delete cascade,
    caller_number text,                       -- E.164
    caller_name text,
    status public.conversation_status not null default 'new',
    last_message_at timestamptz,
    last_message_preview text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
    );

-- Unique convo per (phone_number_id, caller_number) (you requested yes)
create unique index if not exists uniq_convo_phone_caller
    on public.conversations(phone_number_id, caller_number)
    where caller_number is not null;

create index if not exists idx_conversations_org on public.conversations(org_id);
create index if not exists idx_conversations_status on public.conversations(status);
create index if not exists idx_conversations_last_message on public.conversations(last_message_at desc);

-- Messages
create table if not exists public.messages (
                                               id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    sender public.message_sender not null,
    text text not null,
    provider_message_id text,                 -- Twilio Message SID
    delivery_status text not null default 'sent', -- sent/delivered/failed/unknown
    created_at timestamptz not null default now()
    );

create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_messages_created_at on public.messages(created_at desc);
create index if not exists idx_messages_provider_message_id on public.messages(provider_message_id);

-- Per-user read state (team-ready unread behavior)
create table if not exists public.conversation_reads (
                                                         id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    profile_id uuid not null references public.profiles(id) on delete cascade,
    last_read_at timestamptz,
    created_at timestamptz not null default now(),
    unique (conversation_id, profile_id)
    );

create index if not exists idx_conversation_reads_org on public.conversation_reads(org_id);

-- Automations (MVP: 3-step sequence + toggles)
create table if not exists public.automations (
                                                  id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    missed_call_enabled boolean not null default true,
    followups_enabled boolean not null default true,
    tone_preset text not null default 'professional' check (tone_preset in ('professional','friendly')),
    after_hours_mode text not null default 'send_after_hours' check (after_hours_mode in ('send_after_hours','wait_until_open')),
    step_1_delay_seconds int not null default 60,
    step_1_message text not null default 'Sorry we missed your call — how can we help you today?',
    step_2_delay_seconds int not null default 7200,
    step_2_message text not null default 'Just checking in — what can we help with?',
    step_3_next_day_time text not null default '09:00',
    step_3_message text not null default 'Good morning — do you still need help today?',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (org_id)
    );

-- Outbox job queue for follow-ups
create table if not exists public.outbox_jobs (
                                                  id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    conversation_id uuid references public.conversations(id) on delete cascade,
    job_type public.outbox_job_type not null,
    run_at timestamptz not null,
    status public.job_status not null default 'queued',
    attempts int not null default 0,
    last_error text,
    created_at timestamptz not null default now()
    );

create index if not exists idx_outbox_jobs_run_at
    on public.outbox_jobs(run_at)
    where status = 'queued';

create index if not exists idx_outbox_jobs_org on public.outbox_jobs(org_id);

-- Webhook idempotency / events log
create table if not exists public.events (
                                             id uuid primary key default gen_random_uuid(),
    org_id uuid references public.organizations(id) on delete cascade,
    provider_event_id text not null unique,
    event_type text not null,
    payload jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
    );

create index if not exists idx_events_org_created on public.events(org_id, created_at desc);

-- Opt-outs
create table if not exists public.opt_outs (
                                               id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    phone text not null,
    name text,
    reason text not null default 'stop_keyword',
    opted_out_at timestamptz not null default now(),
    can_resubscribe boolean not null default false,
    unique (org_id, phone)
    );

-- Usage tracking (simple monthly)
create table if not exists public.usage_tracking (
                                                     id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    month_year text not null, -- YYYY-MM
    sms_used int not null default 0,
    voice_minutes_used int not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (org_id, month_year)
    );

create index if not exists idx_usage_org_month on public.usage_tracking(org_id, month_year);

-- Billing (keep minimal; Stripe portal later)
create table if not exists public.billing (
                                              org_id uuid primary key references public.organizations(id) on delete cascade,
    status public.billing_status not null default 'trialing',
    plan text not null default 'trial' check (plan in ('trial','pro','enterprise')),
    stripe_customer_id text,
    stripe_subscription_id text,
    trial_ends_at timestamptz,
    current_period_end timestamptz,
    created_at timestamptz not null default now()
    );

-- Support tickets
create table if not exists public.support_tickets (
                                                      id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    profile_id uuid references public.profiles(id) on delete set null,
    subject text not null,
    description text not null,
    priority public.ticket_priority not null default 'medium',
    status public.ticket_status not null default 'open',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
    );

-- Team invites (team now)
create table if not exists public.org_invites (
                                                  id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    email text not null,
    role public.member_role not null default 'member',
    token text not null unique,
    expires_at timestamptz not null,
    accepted_at timestamptz,
    created_at timestamptz not null default now(),
    unique (org_id, email)
    );

create index if not exists idx_org_invites_org on public.org_invites(org_id);

-- ------------------------------------------------------------
-- HELPERS (must be after profiles exists)
-- ------------------------------------------------------------
create or replace function public.get_user_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
select org_id
from public.profiles
where id = auth.uid()
    limit 1
$$;

create or replace function public.is_in_org(check_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
select exists(
    select 1 from public.profiles
    where id = auth.uid() and org_id = check_org
)
           $$;

create or replace function public.is_org_admin(check_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
select exists(
    select 1 from public.profiles
    where id = auth.uid()
      and org_id = check_org
      and role in ('owner','admin')
)
           $$;

-- Update conversation last_message fields when new message arrives
create or replace function public.bump_conversation_last_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
update public.conversations
set last_message_at = new.created_at,
    last_message_preview = left(new.text, 180)
where id = new.conversation_id;

return new;
end;
$$;

drop trigger if exists trg_bump_conversation_last_message on public.messages;
create trigger trg_bump_conversation_last_message
    after insert on public.messages
    for each row execute function public.bump_conversation_last_message();

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.phone_numbers enable row level security;
alter table public.calls enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.conversation_reads enable row level security;
alter table public.automations enable row level security;
alter table public.outbox_jobs enable row level security;
alter table public.events enable row level security;
alter table public.opt_outs enable row level security;
alter table public.usage_tracking enable row level security;
alter table public.billing enable row level security;
alter table public.support_tickets enable row level security;
alter table public.org_invites enable row level security;

alter table public.organizations force row level security;
alter table public.profiles force row level security;
alter table public.phone_numbers force row level security;
alter table public.calls force row level security;
alter table public.conversations force row level security;
alter table public.messages force row level security;
alter table public.conversation_reads force row level security;
alter table public.automations force row level security;
alter table public.outbox_jobs force row level security;
alter table public.events force row level security;
alter table public.opt_outs force row level security;
alter table public.usage_tracking force row level security;
alter table public.billing force row level security;
alter table public.support_tickets force row level security;
alter table public.org_invites force row level security;

-- Profiles: user can read/update own
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
                                       to authenticated
                                       using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
                                       to authenticated
                                       using (id = auth.uid())
                       with check (id = auth.uid());

-- Profiles: admins can read org members (team view)
drop policy if exists "profiles_select_org_admin" on public.profiles;
create policy "profiles_select_org_admin"
on public.profiles for select
                                       to authenticated
                                       using (public.is_org_admin(org_id));

-- Organizations: members can view, admins can update
drop policy if exists "org_select_members" on public.organizations;
create policy "org_select_members"
on public.organizations for select
                                            to authenticated
                                            using (public.is_in_org(id));

drop policy if exists "org_update_admin" on public.organizations;
create policy "org_update_admin"
on public.organizations for update
                                            to authenticated
                                            using (public.is_org_admin(id))
                            with check (public.is_org_admin(id));

-- Phone numbers
drop policy if exists "phone_numbers_select_org" on public.phone_numbers;
create policy "phone_numbers_select_org"
on public.phone_numbers for select
                                            to authenticated
                                            using (public.is_in_org(org_id));

drop policy if exists "phone_numbers_update_admin" on public.phone_numbers;
create policy "phone_numbers_update_admin"
on public.phone_numbers for update
                                            to authenticated
                                            using (public.is_org_admin(org_id))
                            with check (public.is_org_admin(org_id));

-- Calls (read)
drop policy if exists "calls_select_org" on public.calls;
create policy "calls_select_org"
on public.calls for select
                                    to authenticated
                                    using (public.is_in_org(org_id));

-- Conversations (read/update)
drop policy if exists "conversations_select_org" on public.conversations;
create policy "conversations_select_org"
on public.conversations for select
                                            to authenticated
                                            using (public.is_in_org(org_id));

drop policy if exists "conversations_update_org" on public.conversations;
create policy "conversations_update_org"
on public.conversations for update
                                            to authenticated
                                            using (public.is_in_org(org_id))
                            with check (public.is_in_org(org_id));

-- Messages (read/insert within org)
drop policy if exists "messages_select_org" on public.messages;
create policy "messages_select_org"
on public.messages for select
                                       to authenticated
                                       using (public.is_in_org(org_id));

drop policy if exists "messages_insert_org" on public.messages;
create policy "messages_insert_org"
on public.messages for insert
to authenticated
with check (public.is_in_org(org_id));

-- Conversation reads (per-user)
drop policy if exists "reads_select_own_org" on public.conversation_reads;
create policy "reads_select_own_org"
on public.conversation_reads for select
                                                             to authenticated
                                                             using (profile_id = auth.uid() and public.is_in_org(org_id));

drop policy if exists "reads_upsert_own_org" on public.conversation_reads;
create policy "reads_upsert_own_org"
on public.conversation_reads for insert
to authenticated
with check (profile_id = auth.uid() and public.is_in_org(org_id));

drop policy if exists "reads_update_own_org" on public.conversation_reads;
create policy "reads_update_own_org"
on public.conversation_reads for update
                                                             to authenticated
                                                             using (profile_id = auth.uid() and public.is_in_org(org_id))
                                 with check (profile_id = auth.uid() and public.is_in_org(org_id));

-- Automations
drop policy if exists "automations_select_org" on public.automations;
create policy "automations_select_org"
on public.automations for select
                                          to authenticated
                                          using (public.is_in_org(org_id));

drop policy if exists "automations_update_admin" on public.automations;
create policy "automations_update_admin"
on public.automations for update
                                          to authenticated
                                          using (public.is_org_admin(org_id))
                          with check (public.is_org_admin(org_id));

-- Jobs (read only to org)
drop policy if exists "jobs_select_org" on public.outbox_jobs;
create policy "jobs_select_org"
on public.outbox_jobs for select
                                          to authenticated
                                          using (public.is_in_org(org_id));

-- Opt outs
drop policy if exists "optouts_select_org" on public.opt_outs;
create policy "optouts_select_org"
on public.opt_outs for select
                                       to authenticated
                                       using (public.is_in_org(org_id));

-- Usage
drop policy if exists "usage_select_org" on public.usage_tracking;
create policy "usage_select_org"
on public.usage_tracking for select
                                             to authenticated
                                             using (public.is_in_org(org_id));

-- Billing
drop policy if exists "billing_select_org" on public.billing;
create policy "billing_select_org"
on public.billing for select
                                      to authenticated
                                      using (public.is_in_org(org_id));

-- Support tickets
drop policy if exists "tickets_select_org" on public.support_tickets;
create policy "tickets_select_org"
on public.support_tickets for select
                                              to authenticated
                                              using (public.is_in_org(org_id));

drop policy if exists "tickets_insert_org" on public.support_tickets;
create policy "tickets_insert_org"
on public.support_tickets for insert
to authenticated
with check (public.is_in_org(org_id));

-- Invites (admins only)
drop policy if exists "invites_select_admin" on public.org_invites;
create policy "invites_select_admin"
on public.org_invites for select
                                                      to authenticated
                                                      using (public.is_org_admin(org_id));

drop policy if exists "invites_insert_admin" on public.org_invites;
create policy "invites_insert_admin"
on public.org_invites for insert
to authenticated
with check (public.is_org_admin(org_id));
