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
