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
