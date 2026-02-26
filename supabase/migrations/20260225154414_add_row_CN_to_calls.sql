-- Add caller_name column to calls table
alter table public.calls
    add column if not exists caller_name text;

-- Optional: add a comment for clarity
comment on column public.calls.caller_name
is 'CNAM or lookup-based caller name. Nullable because not all numbers return a name.';