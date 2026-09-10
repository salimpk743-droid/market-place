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
