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
