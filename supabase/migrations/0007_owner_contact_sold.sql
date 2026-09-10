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
