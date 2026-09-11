# Mobile Market

Pakistan-wide used-phone classifieds. Buyers and sellers deal with each other. Mobile Market does not inspect, certify, or sell phones.

Support: **help@mobilemarket.pk**

This repository is the website. The Android app is a Trusted Web Activity wrapping the same site and is **not** changed in this migration.

## What this migration does

- Next.js App Router is the website.
- Supabase is the only marketplace database (listings, ownership, sold/relist/delete, photos, reports, contact reveal).
- `localStorage` is **not** the database. It may only hold harmless UI preferences.
- Seller contact numbers are **not** in public listing HTML, public selects, or the sitemap.
- Bundled seed/demo ads are **not** shown, counted, or put in Product schema.
- Canonical origin is configurable (`NEXT_PUBLIC_SITE_URL`). Production is `https://mobilemarket.pk`.

## Environment (publishable only)

Set these in the host (Vercel project env). Never put the database password or service-role key in the website, in Git, or in the browser.

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_ANON_KEY
NEXT_PUBLIC_SITE_URL=https://mobilemarket.pk
```

See `.env.example`. Do not commit a real `.env`.

Supabase Auth: enable Email (password) and Google. Confirm email for password signups. Allow redirects `{SITE_URL}/auth/callback` and `{SITE_URL}/auth/update-password`. Google’s callback in the cloud console is `https://YOUR-PROJECT.supabase.co/auth/v1/callback`.

## Database (additive SQL)

`public.listings` already exists in the project. Migrations **refuse to create or drop it**. Apply in the Supabase SQL editor, in order, as the table owner:

1. `supabase/migrations/0001_listings_additive.sql` — add missing columns only
2. `supabase/migrations/0002_related_tables.sql` — profiles, images, reports, blocks, contact events, favorites
3. `supabase/migrations/0003_rls_grants.sql` — revoke broad grants; `contact_phone` is not selectable by anon
4. `supabase/migrations/0004_rpcs.sql` — featured/status guard, `reveal_listing_contact`, `submit_listing_report`, `delete_own_account`
5. `supabase/migrations/0005_storage.sql` — public `listing-images` bucket, owner path `{seller_id}/{listing_id}/{filename}`
6. `supabase/migrations/0006_profile_trigger.sql` — profile row on signup
7. `supabase/migrations/0007_owner_contact_sold.sql` — sold ads stay visible as sold; owner-only contact read; IP report limits
8. `supabase/migrations/0008_listing_category.sql` — category for phones and mobile accessories (power banks, chargers, earbuds, covers, etc.)
9. `supabase/migrations/0009_category_aware_model.sql` — canonical category slugs, nullable phone-only fields, accessory trigger, hide `seller_id` from anon

Read-only inspection queries (no writes) are in `supabase/PHASE0_SCHEMA.md`. After keys exist, `GET /api/health/schema` and `npm run inspect:schema` print **column names only**.

If `0001` raises `public.listings does not exist`, create/verify that table first. Do not let the website create it.

## What is not done from this environment

- Live `public.listings` columns could not be read here: no publishable URL/anon key is present (password and service-role correctly absent).
- SQL has **not** been applied to the live project from here.
- This tree is **not** deployed, committed, or pushed.
- The Android TWA is unchanged.

Until SQL is applied and publishable keys are set, the public catalog is empty on purpose. That is not a bug.

## Local commands

```
npm run dev          # Next.js on 0.0.0.0:8080
npm run build
npm run typecheck
npm test
npm run inspect:schema
```

## Trust and legal

Legal pages live at `/privacy`, `/terms`, `/seller-terms`, `/rules`, `/prohibited`, `/buyer-safety`, `/contact`, `/report`, `/delete-account`. They are product copy, not legal advice. Pakistani PECA, consumer, PTA/DIRBS, and tax questions need a qualified lawyer.

`vercel.json` is the original header file (assetlinks + manifest content types). It was not rewritten for Next.js.
