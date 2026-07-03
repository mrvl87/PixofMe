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

### Supabase Auth production

Implemented auth flow:
- `/signup.html` collects username, first name, last name, email, strong password, and password confirmation.
- `POST /api/auth/password` validates with Zod, rate-limits attempts, checks duplicate username/email from `profiles`, calls Supabase Auth, then creates the profile row server-side.
- Passwords are never stored by Pixforme. They are sent only to the server/Supabase Auth over HTTPS in production and stored by Supabase Auth using its password hashing system.
- Signups always return `needsEmailConfirmation=true`; if Supabase returns a session because email confirmation is disabled, the route signs it out immediately.
- `/auth/callback` exchanges the verification code and marks `profiles.email_verified_at`.

Required Supabase Dashboard settings for real email verification:
- Authentication > Providers > Email: enable email provider and email confirmations.
- Authentication > URL Configuration: set Site URL to the production domain.
- Add Redirect URL: `https://YOUR_DOMAIN/auth/callback` and local `http://localhost:3000/auth/callback` for development.
- Authentication > Emails > SMTP Settings: configure custom SMTP for real deliverability.
- Apply `docs/SUPABASE_SCHEMA.sql` after the profile-column update.
### Supabase

Required for app auth/data:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET=pixforme-photos` private report photo bucket
- `SUPABASE_HOMEPAGE_HERO_BUCKET=pixforme-homepage-hero` public homepage hero bucket
- `SUPABASE_HOMEPAGE_WORKFLOW_BUCKET=pixforme-homepage-workflow` public workflow images bucket
- `SUPABASE_HOMEPAGE_TEMPLATE_BUCKET=pixforme-homepage-templates` public template preview images bucket

Use the service-role key only in server code. Never expose it through `NEXT_PUBLIC_`.

Auth and workspace endpoints:

- `POST /api/auth/password` handles email/password login and signup.
- `GET /api/workspace` returns or creates the current user's workspace, then lists only that user's projects.
- `POST /api/workspace/projects` creates a project under the current user's workspace.
- `PATCH /api/workspace/projects` activates or updates a project scoped to the current user's workspace.
- `DELETE /api/workspace/projects?projectId=...` deletes a project scoped to the current user's workspace.
Storage upload endpoint:

- `POST /api/storage/upload` accepts multipart `file` and `kind`.
- `kind=report-photo` uploads to the private report bucket and returns a signed URL for preview.
- `kind=homepage-hero`, `homepage-workflow`, or `homepage-template` uploads to public homepage buckets and returns a public CDN URL.
- Max image size is 15MB; accepted MIME types are JPG, PNG, and WebP.

### Auth Guard

Default app flow now protects workspace and wizard routes when Supabase env is configured:

```env
NEXT_PUBLIC_AUTH_GUARD_ENABLED=true
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
- `MAPS_DEFAULT_ZOOM=16`
- `MAPS_MAX_ZOOM=18`
- `MAPS_TILE_GRID_RADIUS=2`
- `MAPS_REVERSE_GEOCODE_DECIMALS=4`
- `MAPS_GEOCODE_PER_MINUTE=30`
- `MAPS_GEOCODE_PER_DAY=1000`

Prefer the server route for geocoding so API usage can later be rate-limited and logged per user/project.

Server endpoint examples:

```txt
GET /api/maps/config
GET /api/maps/geocode?address=Jayapura
GET /api/maps/geocode?lat=-2.5916&lng=140.669
```


### Map Cost Controls

Current safeguards:

- Tile config is cached by `/api/maps/config`.
- Max zoom is capped with `MAPS_MAX_ZOOM`.
- Tile grid size is capped with `MAPS_TILE_GRID_RADIUS`; radius `2` means about 25 visible tiles per viewport.
- Reverse geocoding only runs after drag ends, not while the map is moving.
- Reverse geocode cache rounds coordinates using `MAPS_REVERSE_GEOCODE_DECIMALS` so nearby points can reuse one provider result.
- `/api/maps/geocode` returns `X-Pixforme-Map-*` headers for request kind, cache state, and remaining minute/day budget.
- In-memory request limits protect prototype/server runtime; production should persist usage by user/project in Supabase before billing enforcement.
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
6. Workspace/project CRUD now uses Supabase session via `/api/workspace` and `/api/workspace/projects`; localStorage remains only as client-side wizard draft state.
7. Generate real database types from Supabase later and replace `lib/supabase/database.types.ts`.


