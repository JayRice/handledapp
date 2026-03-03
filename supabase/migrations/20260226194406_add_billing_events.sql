create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
return new;
end;
$$;

drop trigger if exists billing_set_updated_at on public.billing;

create trigger billing_set_updated_at
    before update on public.billing
    for each row
    execute function public.set_updated_at();


create table if not exists public.billing_events (
                                                     id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    org_id uuid not null references public.organizations(id) on delete cascade,
    stripe_event_id text not null,
    type text not null,
    payload jsonb not null,
    processed_at timestamptz
    );

create unique index if not exists billing_events_stripe_event_id_unique
    on public.billing_events (stripe_event_id);

create index if not exists billing_events_org_id_created_at_idx
    on public.billing_events (org_id, created_at desc);