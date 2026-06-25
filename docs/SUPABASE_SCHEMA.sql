-- PIXFORME Supabase schema draft
-- Purpose: production database baseline for the current Next.js/prototype workflow.
-- Apply in Supabase SQL editor or convert to a real Supabase migration with `supabase migration new`.

begin;

create extension if not exists pgcrypto with schema extensions;

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Accounts and workspaces
-- -----------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  ai_credit_balance integer not null default 0 check (ai_credit_balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Workspace Utama',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  institution_name text,
  job_name text,
  activity_location text,
  header_text text,
  header_mode text not null default 'all' check (header_mode in ('all', 'first')),
  show_logo_instansi boolean not null default true,
  show_logo_perusahaan boolean not null default true,
  rab_text text,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id),
  foreign key (workspace_id, owner_id) references public.workspaces(id, owner_id) on delete cascade
);

create table if not exists public.project_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  sort_order integer not null default 0,
  name text not null,
  source text not null default 'rab' check (source in ('rab', 'manual')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (project_id, owner_id) references public.projects(id, owner_id) on delete cascade
);

create unique index if not exists project_items_project_lower_name_idx
  on public.project_items(project_id, lower(name));

-- -----------------------------------------------------------------------------
-- Reports, photos, geotag, preview, export
-- -----------------------------------------------------------------------------

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  period_text text,
  status text not null default 'draft' check (status in ('draft', 'ready', 'exported', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id),
  foreign key (project_id, owner_id) references public.projects(id, owner_id) on delete cascade
);

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid,
  source_type text not null default 'laporan' check (source_type in ('laporan', 'bukti_lapangan', 'ai_generated')),
  storage_path text not null,
  public_url text,
  filename text not null,
  mime_type text,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  checksum_sha256 text,
  original_photo_id uuid references public.gallery_photos(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id),
  foreign key (project_id, owner_id) references public.projects(id, owner_id) on delete cascade
);

create table if not exists public.report_photos (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  photo_id uuid references public.gallery_photos(id) on delete set null,
  sort_order integer not null default 0,
  job_name text,
  project_item_id uuid references public.project_items(id) on delete set null,
  item_name text,
  progress numeric(5,2) check (progress is null or (progress >= 0 and progress <= 100)),
  fit_mode text not null default 'crop' check (fit_mode in ('crop', 'contain')),
  crop_y integer not null default 50 check (crop_y >= 0 and crop_y <= 100),
  ai_extended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id),
  foreign key (report_id, owner_id) references public.reports(id, owner_id) on delete cascade
);

create table if not exists public.report_photo_geotags (
  report_photo_id uuid primary key references public.report_photos(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  address text,
  latitude numeric(10,7) not null check (latitude >= -90 and latitude <= 90),
  longitude numeric(10,7) not null check (longitude >= -180 and longitude <= 180),
  captured_date date,
  captured_time time,
  timezone text not null default 'Asia/Jayapura',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.report_preview_settings (
  report_id uuid primary key references public.reports(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  template_id text not null default 't1' check (template_id in ('t1', 't2', 't3', 't4', 't5')),
  paper_size text not null default 'a4' check (paper_size in ('a4', 'f4')),
  grid_geo_color text not null default '#FFFFFF',
  grid_geo_size integer not null default 7 check (grid_geo_size between 5 and 18),
  grid_geo_contrast_applied boolean not null default true,
  accent_color text not null default '#FF6B1A',
  spacing integer not null default 8 check (spacing between 0 and 24),
  font_size integer not null default 8 check (font_size between 6 and 14),
  show_photo_border boolean not null default false,
  border_width integer not null default 1 check (border_width between 0 and 6),
  border_radius integer not null default 3 check (border_radius between 0 and 8),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.report_exports (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  format text not null default 'pdf' check (format in ('pdf')),
  status text not null default 'queued' check (status in ('queued', 'rendering', 'done', 'error')),
  storage_path text,
  page_count integer check (page_count is null or page_count >= 0),
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes >= 0),
  error_message text,
  exported_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- AI credits, AI jobs, and payments
-- -----------------------------------------------------------------------------

create table if not exists public.ai_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('free_grant', 'purchase', 'reserve', 'refund', 'usage', 'adjustment')),
  delta integer not null,
  balance_after integer not null check (balance_after >= 0),
  reference_type text,
  reference_id uuid,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  report_photo_id uuid references public.report_photos(id) on delete set null,
  job_type text not null check (job_type in ('ai_extend', 'geotag_burn_in', 'watermark_remove', 'watermark_replace')),
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  credit_reserved integer not null default 0 check (credit_reserved >= 0),
  credit_spent integer not null default 0 check (credit_spent >= 0),
  provider text,
  model text,
  input_photo_id uuid references public.gallery_photos(id) on delete set null,
  output_photo_id uuid references public.gallery_photos(id) on delete set null,
  request_payload jsonb not null default '{}'::jsonb,
  result_payload jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'midtrans' check (provider in ('midtrans')),
  order_id text not null unique,
  sku text not null,
  amount integer not null check (amount >= 0),
  currency text not null default 'IDR',
  transaction_status text not null default 'created',
  payment_type text,
  fraud_status text,
  snap_token text,
  redirect_url text,
  raw_payload jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'midtrans' check (provider in ('midtrans')),
  order_id text,
  event_key text,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_error text
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

create index if not exists workspaces_owner_idx on public.workspaces(owner_id);
create index if not exists projects_workspace_idx on public.projects(workspace_id, status, updated_at desc);
create index if not exists projects_owner_idx on public.projects(owner_id, updated_at desc);
create index if not exists project_items_project_sort_idx on public.project_items(project_id, sort_order, name);
create index if not exists reports_project_idx on public.reports(project_id, updated_at desc);
create index if not exists reports_owner_idx on public.reports(owner_id, updated_at desc);
create index if not exists gallery_photos_project_idx on public.gallery_photos(project_id, created_at desc);
create index if not exists gallery_photos_owner_source_idx on public.gallery_photos(owner_id, source_type, created_at desc);
create index if not exists report_photos_report_sort_idx on public.report_photos(report_id, sort_order);
create index if not exists report_photos_photo_idx on public.report_photos(photo_id) where photo_id is not null;
create index if not exists report_photo_geotags_owner_idx on public.report_photo_geotags(owner_id);
create index if not exists report_exports_report_idx on public.report_exports(report_id, created_at desc);
create index if not exists ai_credit_ledger_owner_idx on public.ai_credit_ledger(owner_id, created_at desc);
create index if not exists ai_jobs_owner_status_idx on public.ai_jobs(owner_id, status, created_at desc);
create index if not exists billing_orders_owner_idx on public.billing_orders(owner_id, created_at desc);
create index if not exists billing_orders_order_id_idx on public.billing_orders(order_id);
create index if not exists billing_webhook_events_order_idx on public.billing_webhook_events(order_id, received_at desc);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_project_items_updated_at on public.project_items;
create trigger set_project_items_updated_at before update on public.project_items
for each row execute function public.set_updated_at();

drop trigger if exists set_reports_updated_at on public.reports;
create trigger set_reports_updated_at before update on public.reports
for each row execute function public.set_updated_at();

drop trigger if exists set_gallery_photos_updated_at on public.gallery_photos;
create trigger set_gallery_photos_updated_at before update on public.gallery_photos
for each row execute function public.set_updated_at();

drop trigger if exists set_report_photos_updated_at on public.report_photos;
create trigger set_report_photos_updated_at before update on public.report_photos
for each row execute function public.set_updated_at();

drop trigger if exists set_report_photo_geotags_updated_at on public.report_photo_geotags;
create trigger set_report_photo_geotags_updated_at before update on public.report_photo_geotags
for each row execute function public.set_updated_at();

drop trigger if exists set_report_preview_settings_updated_at on public.report_preview_settings;
create trigger set_report_preview_settings_updated_at before update on public.report_preview_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_report_exports_updated_at on public.report_exports;
create trigger set_report_exports_updated_at before update on public.report_exports
for each row execute function public.set_updated_at();

drop trigger if exists set_ai_jobs_updated_at on public.ai_jobs;
create trigger set_ai_jobs_updated_at before update on public.ai_jobs
for each row execute function public.set_updated_at();

drop trigger if exists set_billing_orders_updated_at on public.billing_orders;
create trigger set_billing_orders_updated_at before update on public.billing_orders
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.projects enable row level security;
alter table public.project_items enable row level security;
alter table public.reports enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.report_photos enable row level security;
alter table public.report_photo_geotags enable row level security;
alter table public.report_preview_settings enable row level security;
alter table public.report_exports enable row level security;
alter table public.ai_credit_ledger enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.billing_orders enable row level security;
alter table public.billing_webhook_events enable row level security;

-- Profile: users can manage only their own profile row.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert to authenticated
with check (
  (select auth.uid()) = id
  and plan = 'free'
  and ai_credit_balance = 0
);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Owner-scoped app tables.
drop policy if exists workspaces_select_own on public.workspaces;
create policy workspaces_select_own on public.workspaces for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists workspaces_insert_own on public.workspaces;
create policy workspaces_insert_own on public.workspaces for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists workspaces_update_own on public.workspaces;
create policy workspaces_update_own on public.workspaces for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists workspaces_delete_own on public.workspaces;
create policy workspaces_delete_own on public.workspaces for delete to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists projects_select_own on public.projects;
create policy projects_select_own on public.projects for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists projects_insert_own on public.projects;
create policy projects_insert_own on public.projects for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists projects_update_own on public.projects;
create policy projects_update_own on public.projects for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists projects_delete_own on public.projects;
create policy projects_delete_own on public.projects for delete to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists project_items_select_own on public.project_items;
create policy project_items_select_own on public.project_items for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists project_items_insert_own on public.project_items;
create policy project_items_insert_own on public.project_items for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists project_items_update_own on public.project_items;
create policy project_items_update_own on public.project_items for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists project_items_delete_own on public.project_items;
create policy project_items_delete_own on public.project_items for delete to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists reports_select_own on public.reports;
create policy reports_select_own on public.reports for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists reports_insert_own on public.reports;
create policy reports_insert_own on public.reports for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists reports_update_own on public.reports;
create policy reports_update_own on public.reports for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists reports_delete_own on public.reports;
create policy reports_delete_own on public.reports for delete to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists gallery_photos_select_own on public.gallery_photos;
create policy gallery_photos_select_own on public.gallery_photos for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists gallery_photos_insert_own on public.gallery_photos;
create policy gallery_photos_insert_own on public.gallery_photos for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists gallery_photos_update_own on public.gallery_photos;
create policy gallery_photos_update_own on public.gallery_photos for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists gallery_photos_delete_own on public.gallery_photos;
create policy gallery_photos_delete_own on public.gallery_photos for delete to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists report_photos_select_own on public.report_photos;
create policy report_photos_select_own on public.report_photos for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists report_photos_insert_own on public.report_photos;
create policy report_photos_insert_own on public.report_photos for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists report_photos_update_own on public.report_photos;
create policy report_photos_update_own on public.report_photos for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists report_photos_delete_own on public.report_photos;
create policy report_photos_delete_own on public.report_photos for delete to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists report_photo_geotags_select_own on public.report_photo_geotags;
create policy report_photo_geotags_select_own on public.report_photo_geotags for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists report_photo_geotags_insert_own on public.report_photo_geotags;
create policy report_photo_geotags_insert_own on public.report_photo_geotags for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists report_photo_geotags_update_own on public.report_photo_geotags;
create policy report_photo_geotags_update_own on public.report_photo_geotags for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists report_photo_geotags_delete_own on public.report_photo_geotags;
create policy report_photo_geotags_delete_own on public.report_photo_geotags for delete to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists report_preview_settings_select_own on public.report_preview_settings;
create policy report_preview_settings_select_own on public.report_preview_settings for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists report_preview_settings_insert_own on public.report_preview_settings;
create policy report_preview_settings_insert_own on public.report_preview_settings for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists report_preview_settings_update_own on public.report_preview_settings;
create policy report_preview_settings_update_own on public.report_preview_settings for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists report_preview_settings_delete_own on public.report_preview_settings;
create policy report_preview_settings_delete_own on public.report_preview_settings for delete to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists report_exports_select_own on public.report_exports;
create policy report_exports_select_own on public.report_exports for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists report_exports_insert_own on public.report_exports;
create policy report_exports_insert_own on public.report_exports for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists report_exports_update_own on public.report_exports;
create policy report_exports_update_own on public.report_exports for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists report_exports_delete_own on public.report_exports;
create policy report_exports_delete_own on public.report_exports for delete to authenticated using ((select auth.uid()) = owner_id);

-- AI jobs, credit ledger, and billing writes should happen from server/service role.
-- Users can only read their own rows for status/history.
drop policy if exists ai_jobs_select_own on public.ai_jobs;
create policy ai_jobs_select_own on public.ai_jobs for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists ai_jobs_insert_own on public.ai_jobs;
drop policy if exists ai_jobs_update_own on public.ai_jobs;

drop policy if exists ai_credit_ledger_select_own on public.ai_credit_ledger;
create policy ai_credit_ledger_select_own on public.ai_credit_ledger for select to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists billing_orders_select_own on public.billing_orders;
create policy billing_orders_select_own on public.billing_orders for select to authenticated using ((select auth.uid()) = owner_id);

-- No client policies for billing_webhook_events. Server/service role only.

-- -----------------------------------------------------------------------------
-- Storage bucket and private object policies
-- Path convention: {auth.uid()}/{workspace_id}/{project_id}/{filename}
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pixforme-photos',
  'pixforme-photos',
  false,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists pixforme_photos_select_own on storage.objects;
create policy pixforme_photos_select_own on storage.objects for select to authenticated
using (
  bucket_id = 'pixforme-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists pixforme_photos_insert_own on storage.objects;
create policy pixforme_photos_insert_own on storage.objects for insert to authenticated
with check (
  bucket_id = 'pixforme-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists pixforme_photos_update_own on storage.objects;
create policy pixforme_photos_update_own on storage.objects for update to authenticated
using (
  bucket_id = 'pixforme-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'pixforme-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists pixforme_photos_delete_own on storage.objects;
create policy pixforme_photos_delete_own on storage.objects for delete to authenticated
using (
  bucket_id = 'pixforme-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- -----------------------------------------------------------------------------
-- Data API grants. RLS remains the real row-level boundary.
-- -----------------------------------------------------------------------------

grant usage on schema public to authenticated;

grant select, insert on public.profiles to authenticated;
grant update(email, full_name, updated_at) on public.profiles to authenticated;

grant select, insert, update, delete on
  public.workspaces,
  public.projects,
  public.project_items,
  public.reports,
  public.gallery_photos,
  public.report_photos,
  public.report_photo_geotags,
  public.report_preview_settings,
  public.report_exports
to authenticated;

grant select on public.ai_jobs, public.ai_credit_ledger, public.billing_orders to authenticated;
revoke all on public.billing_webhook_events from anon, authenticated;

commit;

