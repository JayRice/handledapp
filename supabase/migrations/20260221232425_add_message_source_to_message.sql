-- 1️⃣ Create enum type (if not exists)
do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'message_source'
  ) then
create type public.message_source as enum (
      'manual',
      'automation',
      'ai',
      'system',
      'webhook'
    );
end if;
end$$;

-- 2️⃣ Add source column
alter table public.messages
    add column if not exists source public.message_source
    not null
    default 'manual';

-- 3️⃣ Add automation reference (optional but recommended)
alter table public.messages
    add column if not exists automation_id uuid
    references public.automations(id)
    on delete set null;
