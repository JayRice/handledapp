-- Make org_id optional (nullable)
alter table public.profiles
    alter column org_id drop not null;

-- Optional: if you want org deletion to NOT delete profiles
-- (recommended once org_id is nullable)
alter table public.profiles
drop constraint if exists profiles_org_id_fkey;

alter table public.profiles
    add constraint profiles_org_id_fkey
        foreign key (org_id)
            references public.organizations(id)
            on delete set null;