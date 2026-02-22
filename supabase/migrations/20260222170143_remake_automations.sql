-- ===========
-- Automations v2 (drop + recreate)
-- ===========

-- 0) Extensions (gen_random_uuid)
create extension if not exists pgcrypto;

-- 1) Drop old table (and dependent objects)
drop table if exists public.automations cascade;

-- 2) Drop old enum types if they exist (so we can recreate cleanly)
do $$
begin
  if exists (select 1 from pg_type where typname = 'automation_trigger') then
drop type public.automation_trigger;
end if;

  if exists (select 1 from pg_type where typname = 'automation_delay') then
drop type public.automation_delay;
end if;
end$$;

-- 3) Create enums that match your UI
create type public.automation_trigger as enum (
  'missed_call',
  'after_hours',
  'no_reply',
  'job_complete'
);

create type public.automation_delay as enum (
  'instant',
  '30_seconds',
  '2_minutes',
  '5_minutes',
  '2_hours',
  '24_hours'
);

-- 4) Create new automations table (comprehensive but still MVP-friendly)
create table public.automations (
                                    id uuid primary key default gen_random_uuid(),

                                    org_id uuid not null
                                        references public.organizations(id)
                                            on delete cascade,

    -- Optional scope for later (multiple numbers)
                                    phone_number_id uuid null
    references public.phone_numbers(id)
    on delete set null,

                                    name text not null,
                                    trigger public.automation_trigger not null,
                                    delay public.automation_delay not null default 'instant',

    -- SMS template
                                    message text not null,

                                    enabled boolean not null default true,

    -- simple MVP metrics (you can later compute these from message logs)
                                    sends bigint not null default 0,
                                    replies bigint not null default 0,
                                    bookings bigint not null default 0,

    -- optional dynamic behavior hooks (safe to ignore for MVP)
                                    keywords_include text[] null,
                                    keywords_exclude text[] null,

    -- future-proof: store extra config without migrations
                                    config jsonb not null default '{}'::jsonb,

                                    created_at timestamptz not null default now(),
                                    updated_at timestamptz not null default now()
);

-- 5) Helpful indexes
create index automations_org_id_idx on public.automations(org_id);
create index automations_org_trigger_idx on public.automations(org_id, trigger);
create index automations_org_enabled_idx on public.automations(org_id, enabled);

-- 6) updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
return new;
end;
$$;

drop trigger if exists automations_set_updated_at on public.automations;

create trigger automations_set_updated_at
    before update on public.automations
    for each row
    execute function public.set_updated_at();
