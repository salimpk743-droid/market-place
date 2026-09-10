# Phase 0 / Phase 1 — `public.listings` schema verification

**Status: blocked on live inspection from this environment (9 September 2026).**

This workspace does not contain:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- database password (correctly absent)
- service-role key (correctly absent)

No live OpenAPI probe ran. `GET /api/health/schema` returns `{ configured: false }`.
Existing listing rows (if any) were **not** read or deleted.

## What must be run in the Supabase SQL editor (read-only) before applying 0009

```sql
select table_schema, table_name
from information_schema.tables
where table_schema = 'public' and table_name = 'listings';

select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'listings'
order by ordinal_position;

select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'public.listings'::regclass;

select relname, relrowsecurity, relforcerowsecurity
from pg_class
where oid = 'public.listings'::regclass;

select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public';

select id, name, public from storage.buckets where id = 'listing-images';
```

Do not print `contact_phone` or row contents.

## Migration that is required (not executed from this environment)

Apply in order, as table owner, **additive only**:

1. `0001`–`0007` if not already applied (listings columns, RLS, RPCs, storage, sold visibility)
2. `0008` optional (older category names)
3. **`0009_category_aware_model.sql` — required for accessories**

`0009` does **not** drop `public.listings` and does **not** delete ads. It:

- Adds `category` if missing
- Remaps old slugs (`phones` → `phone`, `chargers` → `charger-cable`, …)
- Drops NOT NULL on phone-only fields (`storage_gb`, `ram_gb`, `pta_status`, `battery_health`)
- CHECK: category allow-list; `pta_status` null or official/cpid/non-pta/jv
- BEFORE trigger: accessories cannot store fake PTA/storage/RAM/battery
- Revokes `seller_id` SELECT from `anon` (authenticated keep it for My Ads)

The website **cannot** apply this SQL. Paste it in the Supabase SQL editor.

## Constraints that must change because accessories exist

| Constraint | Phone-only product | Marketplace with accessories |
|---|---|---|
| `pta_status NOT NULL` | OK | Must be nullable |
| `storage_gb NOT NULL` | OK | Must be nullable |
| `ram_gb NOT NULL` | OK | Must be nullable |
| `battery_health NOT NULL` | OK | Must be nullable |
| dummy PTA `n/a` on accessories | Avoid | Trigger stores NULL instead |
| category free text | Too loose | CHECK + trigger allow-list |

## Implementation rule

Migrations under `supabase/migrations/`:

- Refuse to `CREATE TABLE public.listings`
- Do not `DROP TABLE` or `DELETE FROM listings`
- Do not change existing column types
- Do not grant `contact_phone` to anon
