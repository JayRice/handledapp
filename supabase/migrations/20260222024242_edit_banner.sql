-- 0) Ensure we can use gen_random_uuid()
create extension if not exists pgcrypto;

-- 1) Create enum type safely (Postgres doesn't support CREATE TYPE IF NOT EXISTS)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'banner_variant') then
create type public.banner_variant as enum ('info', 'success', 'warn', 'error');
end if;
end$$;

-- 2) Ensure the table exists
create table if not exists public.app_banners (
                                                  id uuid primary key default gen_random_uuid(),
    -- keep org_id nullable in the base definition so create-table can't fail
    -- if organizations table isn't present yet in a fresh environment
    org_id uuid null,
    message text not null,
    variant public.banner_variant not null default 'info',
    action_label text null,
    action_href text null,
    dismissible boolean not null default true,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
    );

-- 3) Ensure org_id column exists (in case table already existed without it)
alter table public.app_banners
    add column if not exists org_id uuid;

-- 4) Add/ensure the FK constraint (must be separate + named)
alter table public.app_banners
drop constraint if exists app_banners_org_id_fkey;

alter table public.app_banners
    add constraint app_banners_org_id_fkey
        foreign key (org_id)
            references public.organizations(id)
            on delete cascade;

-- 5) Helpful index
create index if not exists app_banners_org_id_idx
    on public.app_banners(org_id);
