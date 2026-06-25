# Pixforme Integrations Setup

Status: scaffold placeholder for Supabase, Esri World Imagery, Geoapify, Midtrans, and AI provider wiring.

## Files Added

- `.env.example`: environment variable template.
- `proxy.ts`: Next.js 16 proxy layer for Supabase session refresh with optional auth guard.
- `lib/env.ts`: typed env accessors.
- `lib/supabase/client.ts`: browser Supabase client.
- `lib/supabase/server.ts`: server and service-role Supabase clients.
- `lib/supabase/middleware.ts`: shared session refresh and optional route protection logic.
- `lib/supabase/database.types.ts`: temporary hand-written type placeholder matching `docs/SUPABASE_SCHEMA.sql`.
- `lib/maps.ts`: Esri World Imagery tile config and server-side Geoapify geocoding helpers.
- `app/api/maps/geocode/route.ts`: server route for geocode/reverse geocode.
- `app/api/maps/config/route.ts`: server route exposing public Esri tile config.
- `app/auth/callback/route.ts`: Supabase OAuth/email callback exchange route.
- `app/auth/sign-out/route.ts`: sign-out route.

## Required Environment

Copy `.env.example` to `.env.local`, then fill real values.

### Supabase

Required for app auth/data:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET=pixforme-photos`

Use the service-role key only in server code. Never expose it through `NEXT_PUBLIC_`.

### Auth Guard

Default scaffold keeps the prototype accessible:

```env
NEXT_PUBLIC_AUTH_GUARD_ENABLED=false
```

When Supabase auth is ready, switch to:

```env
NEXT_PUBLIC_AUTH_GUARD_ENABLED=true
```

Protected route prefixes:

- `/workspace.html`
- `/wizard-step1.html`
- `/wizard-step2.html`
- `/wizard-step3.html`
- `/wizard-step4.html`

Unauthenticated users are redirected to `/login.html?next=...`.

### Maps

Satellite basemap:

- `NEXT_PUBLIC_MAP_PROVIDER=esri-world-imagery`
- Tile URL: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
- Attribution must be shown in any map UI using this basemap.

Geocoding:

- `NEXT_PUBLIC_GEOCODING_PROVIDER=geoapify`
- `GEOAPIFY_API_KEY`: server-side Geoapify key for `/api/maps/geocode`.
- `NEXT_PUBLIC_GEOAPIFY_API_KEY`: optional browser key if a future map picker calls Geoapify directly.
- `MAPS_DEFAULT_LANGUAGE=id`
- `MAPS_DEFAULT_COUNTRY_CODE=id`

Prefer the server route for geocoding so API usage can later be rate-limited and logged per user/project.

Server endpoint examples:

```txt
GET /api/maps/config
GET /api/maps/geocode?address=Jayapura
GET /api/maps/geocode?lat=-2.5916&lng=140.669
```

## Supabase SQL
Baseline schema is in:

- `docs/SUPABASE_SCHEMA.sql`

Apply it in Supabase SQL Editor or convert it to a real migration when Supabase CLI is available.

Important security decisions:

- Public tables use RLS.
- App data is scoped by `owner_id = auth.uid()`.
- Billing webhook events have no client access.
- AI credit ledger is read-only to client; writes should use server/service-role code.
- Photo storage bucket is private and path-scoped by user id.

## Next Steps

1. Create Supabase project.
2. Apply `docs/SUPABASE_SCHEMA.sql`.
3. Create `.env.local` from `.env.example`.
4. Configure Supabase redirect URL: `/auth/callback`.
5. Configure Geoapify key restrictions and show Esri attribution in the map UI.
6. Replace prototype localStorage reads/writes with Supabase queries in a separate approved implementation pass.
7. Generate real database types from Supabase later and replace `lib/supabase/database.types.ts`.


