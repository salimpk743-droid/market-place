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
