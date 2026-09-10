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
