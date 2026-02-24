-- ============================================================
-- Migration: Convert automations.delay enum -> delay_seconds int
--            Add conversation automation fields
--            Drop automation_delay enum type
-- ============================================================

-- 1) Add new delay_seconds column (integer seconds)
alter table public.automations
    add column if not exists delay_seconds integer;

-- 2) Backfill delay_seconds from the existing enum values
-- Old enum values: "instant" | "30_seconds" | "2_minutes" | "5_minutes" | "2_hours" | "24_hours"
update public.automations
set delay_seconds = case delay::text
    when 'instant' then 0
  when '30_seconds' then 30
  when '2_minutes' then 120
  when '5_minutes' then 300
  when '2_hours' then 7200
  when '24_hours' then 86400
  else 0
end
where delay_seconds is null;

-- 3) Enforce NOT NULL on delay_seconds
alter table public.automations
    alter column delay_seconds set not null;

-- 4) Drop old delay column (enum)
alter table public.automations
drop column if exists delay;

-- 5) Drop the enum type
drop type if exists public.automation_delay;



-- ============================================================
-- Conversations: add automation tracking fields
-- ============================================================

alter table public.conversations
    add column if not exists automation_active boolean not null default false,
    add column if not exists next_automation_id uuid null,
    add column if not exists next_automation_at timestamptz null;

-- FK: next_automation_id -> automations(id)
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'conversations_next_automation_id_fkey'
  ) then
alter table public.conversations
    add constraint conversations_next_automation_id_fkey
        foreign key (next_automation_id)
            references public.automations(id)
            on delete set null;
end if;
end $$;



-- ============================================================
-- Indexes for cron + lookup performance
-- ============================================================

create index if not exists idx_conversations_automation_due
    on public.conversations (automation_active, next_automation_at);

create index if not exists idx_automations_org_trigger_delay_seconds
    on public.automations (org_id, trigger, delay_seconds);
