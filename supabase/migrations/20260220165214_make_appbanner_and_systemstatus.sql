create table if not exists public.app_banners (
                                                  id uuid primary key default gen_random_uuid(),

    title text not null,
    message text not null,

    -- style variants: info | success | warning | error
    variant text not null default 'info',

    -- where to show it
    show_on_dashboard boolean not null default true,
    show_on_landing boolean not null default false,

    -- optional expiration
    starts_at timestamptz default now(),
    ends_at timestamptz,

    is_active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
    );

create type public.system_status_type as enum (
    'operational',
    'degraded',
    'partial_outage',
    'major_outage',
    'maintenance'
);

create table if not exists public.system_status (
                                                    id integer primary key default 1,

                                                    status public.system_status_type not null default 'operational',
                                                    message text,

    -- example: twilio, database, api
                                                    affected_service text,

                                                    maintenance_mode boolean not null default false,

                                                    updated_at timestamptz not null default now(),

    constraint single_row check (id = 1)
    );


alter table public.app_banners enable row level security;
alter table public.system_status enable row level security;

create policy "Public can read banners"
on public.app_banners
for select
               using (true);

create policy "Public can read system status"
on public.system_status
for select
               using (true);