-- Mobile Market — one-paste additive apply for an EXISTING empty public.listings.
-- Confirmed by operator: table exists, 22 columns, id uuid, seller_id uuid, no rows.
-- Does NOT drop or recreate public.listings.
-- Does NOT DELETE FROM listings (account-delete RPC only removes that user's own ads).
-- Safe to re-run (IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS).
-- Paste this entire file once in the Supabase SQL editor as table owner.
-- Do not use the service-role key in the website.


-- ========== 0001_listings_additive.sql ==========
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

-- ========== 0002_related_tables.sql ==========
-- Related tables. Listings table is not recreated.
-- listing_id is text so it works whether listings.id is uuid or text.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  account_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id text not null,
  seller_id uuid not null,
  storage_path text not null,
  public_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists listing_images_listing_idx on public.listing_images (listing_id);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id text,
  seller_id uuid,
  reporter_id uuid,
  kind text not null default 'listing',
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.blocks (
  blocker_id uuid not null references auth.users (id) on delete cascade,
  blocked_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create table if not exists public.contact_events (
  id uuid primary key default gen_random_uuid(),
  listing_id text not null,
  requester_id uuid,
  requester_ip text,
  created_at timestamptz not null default now()
);

create index if not exists contact_events_listing_time_idx
  on public.contact_events (listing_id, created_at desc);
create index if not exists contact_events_ip_time_idx
  on public.contact_events (requester_ip, created_at desc);

create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  listing_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table if not exists public.moderation_events (
  id uuid primary key default gen_random_uuid(),
  listing_id text,
  actor_id uuid,
  action text not null,
  reason text,
  created_at timestamptz not null default now()
);

-- ========== 0003_rls_grants.sql ==========
-- Grants + RLS. Does not drop public.listings.
-- contact_phone is intentionally omitted from anon/authenticated column grants.

alter table public.listings enable row level security;
alter table public.profiles enable row level security;
alter table public.listing_images enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;
alter table public.contact_events enable row level security;
alter table public.favorites enable row level security;
alter table public.moderation_events enable row level security;

revoke all on table public.listings from anon, authenticated, public;
revoke all on table public.profiles from anon, authenticated, public;
revoke all on table public.listing_images from anon, authenticated, public;
revoke all on table public.reports from anon, authenticated, public;
revoke all on table public.blocks from anon, authenticated, public;
revoke all on table public.contact_events from anon, authenticated, public;
revoke all on table public.favorites from anon, authenticated, public;
revoke all on table public.moderation_events from anon, authenticated, public;

-- Public listing fields (no contact_phone).
grant select (
  id, seller_id, brand, model, storage_gb, ram_gb, price_pkr, city_slug, area,
  pta_status, battery_health, condition, description, color, year, image_url,
  seller_name, status, featured, created_at, updated_at, slug
) on table public.listings to anon, authenticated;

grant insert (
  id, seller_id, brand, model, storage_gb, ram_gb, price_pkr, city_slug, area,
  pta_status, battery_health, condition, description, color, year, image_url,
  seller_name, contact_phone, status, slug
) on table public.listings to authenticated;

grant update (
  brand, model, storage_gb, ram_gb, price_pkr, city_slug, area, pta_status,
  battery_health, condition, description, color, year, image_url, seller_name,
  contact_phone, status, slug, updated_at
) on table public.listings to authenticated;

grant delete on table public.listings to authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select on table public.listing_images to anon, authenticated;
grant insert, update, delete on table public.listing_images to authenticated;
grant select, insert, delete on table public.blocks to authenticated;
grant select, insert, delete on table public.favorites to authenticated;

drop policy if exists mm_listings_select_public on public.listings;
create policy mm_listings_select_public
on public.listings for select
to anon, authenticated
using (status in ('active', 'sold') or (seller_id is not null and seller_id = auth.uid()));

drop policy if exists mm_listings_insert_own on public.listings;
create policy mm_listings_insert_own
on public.listings for insert
to authenticated
with check (seller_id = auth.uid());

drop policy if exists mm_listings_update_own on public.listings;
create policy mm_listings_update_own
on public.listings for update
to authenticated
using (seller_id = auth.uid())
with check (seller_id = auth.uid());

drop policy if exists mm_listings_delete_own on public.listings;
create policy mm_listings_delete_own
on public.listings for delete
to authenticated
using (seller_id = auth.uid());

drop policy if exists mm_profiles_select_own on public.profiles;
create policy mm_profiles_select_own
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists mm_profiles_insert_own on public.profiles;
create policy mm_profiles_insert_own
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists mm_profiles_update_own on public.profiles;
create policy mm_profiles_update_own
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists mm_images_select_public on public.listing_images;
create policy mm_images_select_public
on public.listing_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.listings l
    where l.id::text = listing_id
      and (l.status in ('active', 'sold') or l.seller_id = auth.uid())
  )
);

drop policy if exists mm_images_write_own on public.listing_images;
create policy mm_images_write_own
on public.listing_images for all
to authenticated
using (seller_id = auth.uid())
with check (seller_id = auth.uid());

drop policy if exists mm_reports_insert on public.reports;
drop policy if exists mm_reports_no_client on public.reports;
create policy mm_reports_no_client
on public.reports for all
to anon, authenticated
using (false)
with check (false);

drop policy if exists mm_blocks_own on public.blocks;
create policy mm_blocks_own
on public.blocks for all
to authenticated
using (blocker_id = auth.uid())
with check (blocker_id = auth.uid());

drop policy if exists mm_favorites_own on public.favorites;
create policy mm_favorites_own
on public.favorites for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists mm_contact_events_no_client on public.contact_events;
create policy mm_contact_events_no_client
on public.contact_events for all
to anon, authenticated
using (false)
with check (false);

drop policy if exists mm_moderation_no_client on public.moderation_events;
create policy mm_moderation_no_client
on public.moderation_events for all
to anon, authenticated
using (false)
with check (false);

-- ========== 0004_rpcs.sql ==========
-- Controlled RPCs. No service-role key is used by the website.

create or replace function public.mm_listings_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.seller_id := auth.uid();
    new.featured := false;
    if new.status is null or new.status not in ('active', 'pending_moderation') then
      new.status := 'active';
    end if;
    if new.created_at is null then
      new.created_at := now();
    end if;
    new.updated_at := now();
  elsif tg_op = 'UPDATE' then
    new.seller_id := old.seller_id;
    new.featured := old.featured;
    new.created_at := old.created_at;
    new.updated_at := now();
    if new.status is null or new.status not in ('active', 'sold', 'removed', 'pending_moderation') then
      new.status := old.status;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists mm_listings_guard on public.listings;
create trigger mm_listings_guard
before insert or update on public.listings
for each row execute function public.mm_listings_guard();

create or replace function public.reveal_listing_contact(p_listing_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec record;
  uid uuid := auth.uid();
  hdr jsonb;
  ip text;
  recent_user int;
  recent_listing int;
begin
  begin
    hdr := nullif(current_setting('request.headers', true), '')::jsonb;
  exception when others then
    hdr := '{}'::jsonb;
  end;
  ip := btrim(split_part(coalesce(hdr->>'x-forwarded-for', hdr->>'x-real-ip', 'unknown'), ',', 1));

  select id, seller_name, contact_phone, status
    into rec
  from public.listings
  where id::text = p_listing_id;

  if rec.id is null or rec.status is distinct from 'active' then
    raise exception 'listing_unavailable' using errcode = 'P0001';
  end if;

  if rec.contact_phone is null or btrim(rec.contact_phone) = '' then
    raise exception 'listing_unavailable' using errcode = 'P0001';
  end if;

  select count(*) into recent_user
  from public.contact_events
  where created_at > now() - interval '1 hour'
    and (
      (uid is not null and requester_id = uid)
      or (uid is null and requester_ip = ip)
    );

  if recent_user >= 12 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  select count(*) into recent_listing
  from public.contact_events
  where listing_id = p_listing_id
    and requester_ip = ip
    and created_at > now() - interval '1 hour';

  if recent_listing >= 6 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.contact_events (listing_id, requester_id, requester_ip)
  values (p_listing_id, uid, ip);

  return jsonb_build_object(
    'seller_name', rec.seller_name,
    'contact_phone', rec.contact_phone
  );
end;
$$;

revoke all on function public.reveal_listing_contact(text) from public;
grant execute on function public.reveal_listing_contact(text) to anon, authenticated;

create or replace function public.submit_listing_report(
  p_listing_id text,
  p_kind text,
  p_reason text,
  p_details text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  sid uuid;
  recent int;
  ip text;
  hdr jsonb;
begin
  if p_reason is null or char_length(btrim(p_reason)) < 3 then
    raise exception 'invalid_report' using errcode = 'P0001';
  end if;
  if char_length(coalesce(p_details, '')) > 4000 then
    raise exception 'invalid_report' using errcode = 'P0001';
  end if;

  begin
    hdr := nullif(current_setting('request.headers', true), '')::jsonb;
  exception when others then
    hdr := '{}'::jsonb;
  end;
  ip := btrim(split_part(coalesce(hdr->>'x-forwarded-for', 'unknown'), ',', 1));

  select count(*) into recent
  from public.reports
  where created_at > now() - interval '1 hour'
    and (
      (auth.uid() is not null and reporter_id = auth.uid())
      or (details is not null and details like '%' || ip || '%')
    );
  -- simple cap; also count by reporter
  select count(*) into recent from public.reports
  where created_at > now() - interval '1 hour'
    and reporter_id is not distinct from auth.uid();
  if recent >= 8 and auth.uid() is not null then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  select seller_id into sid from public.listings where id::text = p_listing_id;

  insert into public.reports (listing_id, seller_id, reporter_id, kind, reason, details)
  values (
    p_listing_id,
    sid,
    auth.uid(),
    case when p_kind in ('listing', 'seller') then p_kind else 'listing' end,
    left(btrim(p_reason), 200),
    left(nullif(btrim(p_details), ''), 4000)
  );
end;
$$;

revoke all on function public.submit_listing_report(text, text, text, text) from public;
grant execute on function public.submit_listing_report(text, text, text, text) to anon, authenticated;

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  delete from public.favorites where user_id = uid;
  delete from public.blocks where blocker_id = uid or blocked_id = uid;
  delete from public.listing_images where seller_id = uid;
  delete from public.listings where seller_id = uid;
  delete from public.profiles where id = uid;
  delete from storage.objects
  where bucket_id = 'listing-images'
    and split_part(name, '/', 1) = uid::text;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;

-- ========== 0005_storage.sql ==========
-- listing-images bucket. Public object GET only for active/sold listings.
-- Path: {seller_id}/{listing_id}/{filename}. Owner write/delete in own prefix.
-- Bucket is private so storage.objects RLS applies to reads (public buckets
-- serve /object/public/ without policy checks).

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', false)
on conflict (id) do update set public = false;

drop policy if exists mm_listing_images_public_read on storage.objects;
create policy mm_listing_images_public_read
on storage.objects for select
to public
using (
  bucket_id = 'listing-images'
  and exists (
    select 1
    from public.listings l
    where l.id::text = split_part(name, '/', 2)
      and l.seller_id::text = split_part(name, '/', 1)
      and l.status in ('active', 'sold')
  )
);

drop policy if exists mm_listing_images_owner_read on storage.objects;
create policy mm_listing_images_owner_read
on storage.objects for select
to authenticated
using (
  bucket_id = 'listing-images'
  and split_part(name, '/', 1) = auth.uid()::text
);
drop policy if exists mm_listing_images_insert_own on storage.objects;
create policy mm_listing_images_insert_own
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-images'
  and split_part(name, '/', 1) = auth.uid()::text
  and lower(coalesce(split_part(name, '.', -1), '')) in ('jpg', 'jpeg', 'png', 'webp')
);

drop policy if exists mm_listing_images_update_own on storage.objects;
create policy mm_listing_images_update_own
on storage.objects for update
to authenticated
using (
  bucket_id = 'listing-images'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'listing-images'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists mm_listing_images_delete_own on storage.objects;
create policy mm_listing_images_delete_own
on storage.objects for delete
to authenticated
using (
  bucket_id = 'listing-images'
  and split_part(name, '/', 1) = auth.uid()::text
);

-- ========== 0006_profile_trigger.sql ==========
create or replace function public.mm_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists mm_on_auth_user_created on auth.users;
create trigger mm_on_auth_user_created
after insert on auth.users
for each row execute function public.mm_handle_new_user();

-- ========== 0007_owner_contact_sold.sql ==========
-- Sold ads stay publicly readable (marked sold). Removed ads stay owner-only.
-- Owner-only contact read for the edit form. Anon report rate-limit by IP.

drop policy if exists mm_listings_select_public on public.listings;
create policy mm_listings_select_public
on public.listings for select
to anon, authenticated
using (
  status in ('active', 'sold')
  or (seller_id is not null and seller_id = auth.uid())
);

drop policy if exists mm_images_select_public on public.listing_images;
create policy mm_images_select_public
on public.listing_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.listings l
    where l.id::text = listing_id
      and (l.status in ('active', 'sold') or l.seller_id = auth.uid())
  )
);

alter table public.reports add column if not exists reporter_ip text;
create index if not exists reports_ip_time_idx on public.reports (reporter_ip, created_at desc);

create or replace function public.get_own_listing_contact(p_listing_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec record;
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  select seller_id, contact_phone
    into rec
  from public.listings
  where id::text = p_listing_id;

  if rec.seller_id is null or rec.seller_id is distinct from uid then
    raise exception 'not_owner' using errcode = 'P0001';
  end if;

  return jsonb_build_object('contact_phone', rec.contact_phone);
end;
$$;

revoke all on function public.get_own_listing_contact(text) from public;
grant execute on function public.get_own_listing_contact(text) to authenticated;

create or replace function public.submit_listing_report(
  p_listing_id text,
  p_kind text,
  p_reason text,
  p_details text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  sid uuid;
  recent int;
  ip text;
  hdr jsonb;
begin
  if p_reason is null or char_length(btrim(p_reason)) < 3 then
    raise exception 'invalid_report' using errcode = 'P0001';
  end if;
  if char_length(coalesce(p_details, '')) > 4000 then
    raise exception 'invalid_report' using errcode = 'P0001';
  end if;

  begin
    hdr := nullif(current_setting('request.headers', true), '')::jsonb;
  exception when others then
    hdr := '{}'::jsonb;
  end;
  ip := btrim(split_part(coalesce(hdr->>'x-forwarded-for', hdr->>'x-real-ip', 'unknown'), ',', 1));

  if auth.uid() is not null then
    select count(*) into recent
    from public.reports
    where created_at > now() - interval '1 hour'
      and reporter_id = auth.uid();
    if recent >= 8 then
      raise exception 'rate_limited' using errcode = 'P0001';
    end if;
  else
    select count(*) into recent
    from public.reports
    where created_at > now() - interval '1 hour'
      and reporter_ip = ip;
    if recent >= 8 then
      raise exception 'rate_limited' using errcode = 'P0001';
    end if;
  end if;

  select seller_id into sid from public.listings where id::text = p_listing_id;

  insert into public.reports (listing_id, seller_id, reporter_id, reporter_ip, kind, reason, details)
  values (
    p_listing_id,
    sid,
    auth.uid(),
    ip,
    case when p_kind in ('listing', 'seller') then p_kind else 'listing' end,
    left(btrim(p_reason), 200),
    left(nullif(btrim(p_details), ''), 4000)
  );
end;
$$;

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  delete from public.favorites where user_id = uid;
  delete from public.blocks where blocker_id = uid or blocked_id = uid;
  delete from public.listing_images where seller_id = uid;
  delete from public.listings where seller_id = uid;
  delete from public.profiles where id = uid;
  delete from storage.objects
  where bucket_id = 'listing-images'
    and split_part(name, '/', 1) = uid::text;

  begin
    delete from auth.users where id = uid;
  exception when others then
    insert into public.profiles (id, display_name, account_status)
    values (uid, null, 'deleted')
    on conflict (id) do update
      set display_name = null, account_status = 'deleted', updated_at = now();
  end;
end;
$$;

-- ========== 0008_listing_category.sql ==========
-- Mobile Market — listing category for phones and mobile accessories.
-- Additive only. Does not create or drop public.listings.

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

alter table public.listings add column if not exists category text;

update public.listings
set category = 'phones'
where category is null or btrim(category) = '';

alter table public.listings alter column category set default 'phones';

create index if not exists listings_category_idx
  on public.listings (category);

comment on column public.listings.category is
  'phones | power-banks | chargers | earbuds | headphones | covers | screen-protectors | smartwatches | other';

grant select (category) on table public.listings to anon, authenticated;
grant insert (category) on table public.listings to authenticated;
grant update (category) on table public.listings to authenticated;

-- ========== 0009_category_aware_model.sql ==========
-- Mobile Market — category-aware marketplace model.
-- Additive only. Does NOT create, drop, or truncate public.listings.
-- Does NOT delete rows. Does NOT use service-role from the website.
--
-- Required because the product now sells phones AND mobile accessories.
-- Phone-only columns (storage, RAM, PTA, battery) must be nullable.
-- Accessories must not be forced to fake PTA/storage values.
--
-- Apply in the Supabase SQL editor as the table owner, after 0001–0008
-- (0008 may be skipped; this file includes a compatible category remap).

do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'listings'
  ) then
    raise exception 'public.listings does not exist — refusing to create it.';
  end if;
end $$;

alter table public.listings add column if not exists category text;
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

-- Phone-only fields must be nullable so accessories are not given fake values.
do $$
declare
  col text;
begin
  foreach col in array array['storage_gb','ram_gb','pta_status','battery_health','year','color']
  loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'listings'
        and column_name = col and is_nullable = 'NO'
    ) then
      execute format('alter table public.listings alter column %I drop not null', col);
    end if;
  end loop;
end $$;

-- Canonical slugs. Remap earlier working names without deleting ads.
update public.listings set category = 'phone' where category is null or btrim(category) = '' or category in ('phones', 'used-phones');
update public.listings set category = 'power-bank' where category in ('power-banks', 'powerbank');
update public.listings set category = 'charger-cable' where category in ('chargers', 'charger', 'cables');
update public.listings set category = 'cover-case' where category in ('covers', 'cases', 'cover');
update public.listings set category = 'screen-protector' where category in ('screen-protectors');
update public.listings set category = 'smartwatch-band' where category in ('smartwatches', 'smartwatch', 'bands');
update public.listings set category = 'other-accessory' where category in ('other', 'accessories');

-- Clear leftover placeholder PTA on accessory rows (do not invent a status).
update public.listings
set pta_status = null, storage_gb = null, ram_gb = null, battery_health = null
where category is distinct from 'phone'
  and (
    pta_status is not null
    or storage_gb is not null
    or ram_gb is not null
    or battery_health is not null
  );

alter table public.listings alter column category set default 'phone';

alter table public.listings drop constraint if exists mm_listings_category_check;
alter table public.listings
  add constraint mm_listings_category_check
  check (category in (
    'phone',
    'power-bank',
    'charger-cable',
    'earbuds',
    'headphones',
    'cover-case',
    'screen-protector',
    'smartwatch-band',
    'other-accessory'
  ));

alter table public.listings drop constraint if exists mm_listings_pta_check;
alter table public.listings
  add constraint mm_listings_pta_check
  check (pta_status is null or pta_status in ('official', 'cpid', 'non-pta', 'jv'));

create index if not exists listings_category_idx on public.listings (category);
create index if not exists listings_status_category_idx on public.listings (status, category, created_at desc);

-- Server-side category rules. Frontend checks are not sufficient.
create or replace function public.mm_listings_category_normalize()
returns trigger
language plpgsql
as $$
begin
  if new.category is null or btrim(new.category) = '' then
    new.category := 'phone';
  end if;

  new.category := case new.category
    when 'phones' then 'phone'
    when 'power-banks' then 'power-bank'
    when 'chargers' then 'charger-cable'
    when 'covers' then 'cover-case'
    when 'screen-protectors' then 'screen-protector'
    when 'smartwatches' then 'smartwatch-band'
    when 'other' then 'other-accessory'
    else new.category
  end;

  if new.category not in (
    'phone','power-bank','charger-cable','earbuds','headphones',
    'cover-case','screen-protector','smartwatch-band','other-accessory'
  ) then
    raise exception 'invalid_category' using errcode = 'P0001';
  end if;

  if new.brand is null or btrim(new.brand) = '' then
    raise exception 'brand_required' using errcode = 'P0001';
  end if;
  if new.model is null or btrim(new.model) = '' then
    raise exception 'model_required' using errcode = 'P0001';
  end if;

  if new.category = 'phone' then
    if new.pta_status is null or new.pta_status not in ('official', 'cpid', 'non-pta', 'jv') then
      raise exception 'pta_required' using errcode = 'P0001';
    end if;
  else
    -- Accessories: do not store fake PTA/storage/RAM/battery values.
    new.pta_status := null;
    new.storage_gb := null;
    new.ram_gb := null;
    new.battery_health := null;
  end if;

  return new;
end;
$$;

drop trigger if exists mm_listings_category_normalize on public.listings;
create trigger mm_listings_category_normalize
before insert or update on public.listings
for each row execute function public.mm_listings_category_normalize();

-- Public catalog: category is readable. seller_id is not granted to anon.
grant select (category) on table public.listings to anon, authenticated;
grant insert (category) on table public.listings to authenticated;
grant update (category) on table public.listings to authenticated;

revoke select (seller_id) on table public.listings from anon;
grant select (seller_id) on table public.listings to authenticated;

comment on column public.listings.category is
  'phone | power-bank | charger-cable | earbuds | headphones | cover-case | screen-protector | smartwatch-band | other-accessory';
comment on column public.listings.pta_status is
  'Phone-only. Null for accessories. official | cpid | non-pta | jv';

-- ========== 0010_grants_and_id_default.sql ==========
-- Final grant snapshot + listing id default.
-- Additive. Does not drop public.listings or delete rows.
-- Apply after 0001–0009.

do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'listings'
  ) then
    raise exception 'public.listings does not exist — refusing to create it.';
  end if;
end $$;

do $$
declare
  id_type text;
  id_default text;
begin
  select data_type, column_default
    into id_type, id_default
  from information_schema.columns
  where table_schema = 'public' and table_name = 'listings' and column_name = 'id';

  if id_type = 'uuid' and id_default is null then
    alter table public.listings alter column id set default gen_random_uuid();
  elsif id_type = 'text' and id_default is null then
    alter table public.listings alter column id set default gen_random_uuid()::text;
  end if;
end $$;

-- Public catalog columns. No contact_phone. No seller_id for anon.
grant select (
  id, category, brand, model, storage_gb, ram_gb, price_pkr, city_slug, area,
  pta_status, battery_health, condition, description, color, year, image_url,
  seller_name, status, featured, created_at, updated_at, slug
) on table public.listings to anon, authenticated;

grant select (seller_id) on table public.listings to authenticated;
revoke select (seller_id) on table public.listings from anon;
revoke select (contact_phone) on table public.listings from anon, authenticated, public;

grant insert (
  id, seller_id, category, brand, model, storage_gb, ram_gb, price_pkr, city_slug, area,
  pta_status, battery_health, condition, description, color, year, image_url,
  seller_name, contact_phone, status, slug
) on table public.listings to authenticated;

grant update (
  category, brand, model, storage_gb, ram_gb, price_pkr, city_slug, area, pta_status,
  battery_health, condition, description, color, year, image_url, seller_name,
  contact_phone, status, slug, updated_at
) on table public.listings to authenticated;
