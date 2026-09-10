-- Mobile Market — additive listings columns.
-- Does NOT create or drop public.listings. Does NOT delete rows.

do $$
begin
  if not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'listings'
  ) then
    raise exception 'public.listings does not exist — refusing to create it. Create/verify the table first, then re-run.';
  end if;
end $$;

create extension if not exists pgcrypto;

alter table public.listings add column if not exists seller_id uuid;
alter table public.listings add column if not exists brand text;
alter table public.listings add column if not exists model text;
alter table public.listings add column if not exists storage_gb integer;
alter table public.listings add column if not exists ram_gb integer;
alter table public.listings add column if not exists price_pkr integer;
alter table public.listings add column if not exists city_slug text;
alter table public.listings add column if not exists area text;
alter table public.listings add column if not exists pta_status text;
alter table public.listings add column if not exists battery_health integer;
alter table public.listings add column if not exists condition text;
alter table public.listings add column if not exists description text;
alter table public.listings add column if not exists color text;
alter table public.listings add column if not exists year integer;
alter table public.listings add column if not exists image_url text;
alter table public.listings add column if not exists seller_name text;
alter table public.listings add column if not exists contact_phone text;
alter table public.listings add column if not exists status text;
alter table public.listings add column if not exists featured boolean;
alter table public.listings add column if not exists created_at timestamptz;
alter table public.listings add column if not exists updated_at timestamptz;
alter table public.listings add column if not exists slug text;

-- Defaults that do not rewrite existing types.
alter table public.listings alter column featured set default false;
alter table public.listings alter column status set default 'active';
alter table public.listings alter column created_at set default now();
alter table public.listings alter column updated_at set default now();

update public.listings
set status = 'active'
where status is null or btrim(status) = '';

update public.listings
set featured = false
where featured is null;

update public.listings
set created_at = now()
where created_at is null;

update public.listings
set updated_at = now()
where updated_at is null;

create index if not exists listings_status_created_idx
  on public.listings (status, created_at desc);
create index if not exists listings_seller_idx
  on public.listings (seller_id);
create index if not exists listings_city_idx
  on public.listings (city_slug);
create index if not exists listings_brand_idx
  on public.listings (brand);
create index if not exists listings_pta_idx
  on public.listings (pta_status);

comment on table public.listings is 'Used-phone marketplace listings. contact_phone is not granted to anon.';
comment on column public.listings.contact_phone is 'Seller contact. Not exposed in public selects; reveal via RPC only.';
comment on column public.listings.featured is 'Staff-only flag. Application and trigger force false for sellers.';
comment on column public.listings.status is 'active | sold | removed | pending_moderation';
