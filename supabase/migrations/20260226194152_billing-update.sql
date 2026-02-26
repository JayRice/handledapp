-- 1) Add columns
alter table public.billing
    add column if not exists stripe_price_id text,
    add column if not exists stripe_subscription_item_id text,
    add column if not exists cancel_at_period_end boolean not null default false,
    add column if not exists canceled_at timestamptz,
    add column if not exists updated_at timestamptz not null default now();

-- 2) Uniques (one billing row per org + avoid Stripe collisions)
create unique index if not exists billing_org_id_unique
    on public.billing (org_id);

create unique index if not exists billing_stripe_customer_id_unique
    on public.billing (stripe_customer_id)
    where stripe_customer_id is not null;

create unique index if not exists billing_stripe_subscription_id_unique
    on public.billing (stripe_subscription_id)
    where stripe_subscription_id is not null;

-- 3) Helpful index for status queries
create index if not exists billing_status_idx
    on public.billing (status);