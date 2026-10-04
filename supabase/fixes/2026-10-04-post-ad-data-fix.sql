-- One-off data fix for the posting bug (owner approved 4 Oct 2026). Safe to run more than once.
-- The website already does both of these on its own after PR deploy (cover fallback + self-heal, and the
-- REMOVED_LISTING_IDS blocklist), so this file is only needed to make the database rows match.

-- 1) Ads that have photos in listing_images but an empty cover: use the first photo (lowest sort_order).
--    Only photos stored under the same seller and ad folder are used.
update public.listings l
set image_url = f.storage_path
from (
  select distinct on (listing_id) listing_id, storage_path
  from public.listing_images
  order by listing_id, sort_order, created_at
) f
where l.id::text = f.listing_id
  and l.image_url is null
  and f.storage_path like l.seller_id::text || '/' || l.id::text || '/%';

-- 2) Approved duplicate removals (reversible: set status back to 'active' and remove the IDs from
--    src/lib/market/listing-blocklist.ts to restore). Kept: 705d03c0 (Vivo Y11d) and 1db923a7 (Nothing Phone (1)).
update public.listings
set status = 'removed'
where id in ('d14a5b5c-f270-4fdd-903b-9be04b742f62', '85c270e5-cf9c-4cfe-abc1-9cd9f4b4646a')
  and status = 'active';
