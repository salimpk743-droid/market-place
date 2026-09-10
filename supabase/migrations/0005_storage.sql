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
