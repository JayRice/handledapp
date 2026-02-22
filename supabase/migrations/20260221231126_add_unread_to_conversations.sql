alter table public.conversations
    add column if not exists unread boolean not null default false;