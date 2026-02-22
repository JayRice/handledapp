-- 1) Create enum (safe)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'banner_variant') then
create type public.banner_variant as enum ('info', 'success', 'warn', 'error');
end if;
end$$;

-- 2) Add UI fields
alter table public.app_banners
    add column if not exists action_label text,
    add column if not exists action_href text,
    add column if not exists dismissible boolean not null default true;

-- 3) Drop the existing default on variant (this is what was blocking the cast)
alter table public.app_banners
    alter column variant drop default;

-- 4) Normalize existing values so the cast won't fail
update public.app_banners
set variant = lower(variant)
where variant is not null;

update public.app_banners
set variant = 'info'
where variant is null
   or variant not in ('info', 'success', 'warn', 'error');

-- 5) Convert the column to the enum
alter table public.app_banners
alter column variant type public.banner_variant
  using variant::public.banner_variant;

-- 6) Re-set default + not-null
alter table public.app_banners
    alter column variant set default 'info',
alter column variant set not null;
