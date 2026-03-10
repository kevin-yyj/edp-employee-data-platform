-- EDP MVP schema for Supabase (Postgres)
-- Run in Supabase SQL editor before seed.sql

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  org_code text unique not null,
  org_name text not null,
  parent_org_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  position_code text unique not null,
  position_name text not null,
  job_level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_code text unique not null,
  full_name text not null,
  email text unique,
  gender text,
  country text not null,
  org_id uuid references public.organizations(id) on delete set null,
  position_id uuid references public.positions(id) on delete set null,
  department text not null,
  role_title text not null,
  hire_date date not null,
  status text not null check (status in ('Onboarded', 'Resigned', 'On Leave')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.performance_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  review_period text not null,
  score numeric(4,2) not null check (score >= 0 and score <= 5),
  created_at timestamptz not null default now()
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  work_date date not null,
  attendance_status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.data_sources (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_type text not null,
  sync_mode text not null check (sync_mode in ('API', 'ETL', 'Webhook')),
  status text not null check (status in ('connected', 'disconnected')),
  success_rate numeric(5,2) not null default 100,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sync_jobs (
  id uuid primary key default gen_random_uuid(),
  data_source_id uuid not null references public.data_sources(id) on delete cascade,
  records_synced integer not null default 0,
  duration_seconds integer not null default 0,
  status text not null check (status in ('success', 'failed', 'running')),
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.api_clients (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  api_key_hash text not null,
  status text not null check (status in ('active', 'disabled')) default 'active',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.api_call_logs (
  id uuid primary key default gen_random_uuid(),
  api_client_id uuid references public.api_clients(id) on delete set null,
  endpoint text not null,
  status_code integer not null,
  latency_ms integer not null,
  request_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  role_code text unique not null,
  role_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  perm_code text unique not null,
  perm_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  unique (user_id, role_id)
);

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  unique (role_id, permission_id)
);

create table if not exists public.access_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource text not null,
  success boolean not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ai_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_org_updated_at on public.organizations;
create trigger trg_org_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists trg_position_updated_at on public.positions;
create trigger trg_position_updated_at
before update on public.positions
for each row execute function public.set_updated_at();

drop trigger if exists trg_employee_updated_at on public.employees;
create trigger trg_employee_updated_at
before update on public.employees
for each row execute function public.set_updated_at();

drop trigger if exists trg_data_sources_updated_at on public.data_sources;
create trigger trg_data_sources_updated_at
before update on public.data_sources
for each row execute function public.set_updated_at();

drop trigger if exists trg_ai_sessions_updated_at on public.ai_sessions;
create trigger trg_ai_sessions_updated_at
before update on public.ai_sessions
for each row execute function public.set_updated_at();

create or replace function public.current_user_permission_codes()
returns table(perm_code text)
language sql
security definer
set search_path = public
as $$
  select p.perm_code
  from public.user_roles ur
  join public.role_permissions rp on ur.role_id = rp.role_id
  join public.permissions p on rp.permission_id = p.id
  where ur.user_id = auth.uid()
$$;

alter table public.organizations enable row level security;
alter table public.positions enable row level security;
alter table public.employees enable row level security;
alter table public.performance_records enable row level security;
alter table public.attendance_records enable row level security;
alter table public.data_sources enable row level security;
alter table public.sync_jobs enable row level security;
alter table public.api_clients enable row level security;
alter table public.api_call_logs enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.access_audit_logs enable row level security;
alter table public.ai_sessions enable row level security;
alter table public.ai_messages enable row level security;

create policy "read core tables with read permission" on public.employees
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'employee.read'));

create policy "manage employees with write permission" on public.employees
for all to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'employee.write'))
with check (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'employee.write'));

create policy "read data sources" on public.data_sources
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'datasource.read'));

create policy "manage data sources" on public.data_sources
for all to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'datasource.write'))
with check (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'datasource.write'));

create policy "read ai sessions own or admin" on public.ai_sessions
for select to authenticated
using (
  user_id = auth.uid()
  or exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'ai.read')
);

create policy "insert ai sessions own" on public.ai_sessions
for insert to authenticated
with check (user_id = auth.uid() or user_id is null);

create policy "read ai messages with session access" on public.ai_messages
for select to authenticated
using (
  exists (
    select 1 from public.ai_sessions s
    where s.id = ai_messages.session_id
      and (s.user_id = auth.uid() or exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'ai.read'))
  )
);

create policy "insert ai messages with session access" on public.ai_messages
for insert to authenticated
with check (
  exists (
    select 1 from public.ai_sessions s
    where s.id = ai_messages.session_id
      and (s.user_id = auth.uid() or exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'ai.write'))
  )
);

create policy "read roles" on public.roles
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'rbac.read'));

create policy "read permissions" on public.permissions
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'rbac.read'));

create policy "manage role mapping" on public.user_roles
for all to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'rbac.write'))
with check (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'rbac.write'));

create policy "read audit logs" on public.access_audit_logs
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'audit.read'));

create policy "insert audit logs" on public.access_audit_logs
for insert to authenticated
with check (true);

-- permissive read policies for supporting tables under employee.read
create policy "read orgs" on public.organizations
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'employee.read'));

create policy "read positions" on public.positions
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'employee.read'));

create policy "read performance records" on public.performance_records
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'employee.read'));

create policy "read attendance records" on public.attendance_records
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'employee.read'));

create policy "read sync jobs" on public.sync_jobs
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'datasource.read'));

create policy "read api clients" on public.api_clients
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'api.read'));

create policy "manage api clients" on public.api_clients
for all to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'api.write'))
with check (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'api.write'));

create policy "read api call logs" on public.api_call_logs
for select to authenticated
using (exists (select 1 from public.current_user_permission_codes() c where c.perm_code = 'api.read'));
