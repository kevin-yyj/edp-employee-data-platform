-- Seed data for EDP MVP
-- Run after schema.sql

insert into public.roles (role_code, role_name)
values
  ('admin', '管理员'),
  ('hr', 'HR'),
  ('hrbp', 'HRBP')
on conflict (role_code) do update set role_name = excluded.role_name;

insert into public.permissions (perm_code, perm_name)
values
  ('employee.read', '查看员工数据'),
  ('employee.write', '编辑员工数据'),
  ('datasource.read', '查看数据源'),
  ('datasource.write', '管理数据源'),
  ('api.read', '查看API服务'),
  ('api.write', '管理API服务'),
  ('rbac.read', '查看权限配置'),
  ('rbac.write', '管理角色权限'),
  ('audit.read', '查看审计日志'),
  ('ai.read', '查看AI会话'),
  ('ai.write', '管理AI会话')
on conflict (perm_code) do update set perm_name = excluded.perm_name;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on (
  (r.role_code = 'admin')
  or (r.role_code = 'hr' and p.perm_code in ('employee.read', 'employee.write', 'datasource.read', 'api.read', 'ai.read', 'ai.write'))
  or (r.role_code = 'hrbp' and p.perm_code in ('employee.read', 'datasource.read', 'ai.read'))
)
on conflict (role_id, permission_id) do nothing;

insert into public.organizations (org_code, org_name)
values
  ('ENG', 'Engineering'),
  ('SALES', 'Sales'),
  ('PROD', 'Product'),
  ('MKT', 'Marketing'),
  ('FIN', 'Finance')
on conflict (org_code) do update set org_name = excluded.org_name;

insert into public.positions (position_code, position_name, job_level)
values
  ('P-ENG-SR', 'Senior Software Engineer', 'L4'),
  ('P-PM-MGR', 'Product Manager', 'L4'),
  ('P-SALES-AE', 'Account Executive', 'L3'),
  ('P-MKT-DIR', 'Marketing Director', 'L5'),
  ('P-FIN-AN', 'Financial Analyst', 'L3')
on conflict (position_code) do update
set position_name = excluded.position_name,
    job_level = excluded.job_level;

with refs as (
  select
    (select id from public.organizations where org_code = 'ENG') as eng_org,
    (select id from public.organizations where org_code = 'SALES') as sales_org,
    (select id from public.organizations where org_code = 'PROD') as prod_org,
    (select id from public.organizations where org_code = 'MKT') as mkt_org,
    (select id from public.organizations where org_code = 'FIN') as fin_org,
    (select id from public.positions where position_code = 'P-ENG-SR') as pos_eng,
    (select id from public.positions where position_code = 'P-SALES-AE') as pos_sales,
    (select id from public.positions where position_code = 'P-PM-MGR') as pos_pm,
    (select id from public.positions where position_code = 'P-MKT-DIR') as pos_mkt,
    (select id from public.positions where position_code = 'P-FIN-AN') as pos_fin
)
insert into public.employees (
  employee_code, full_name, email, country, org_id, position_id, department, role_title, hire_date, status, avatar_url
)
select * from (
  select 'EMP-2024-001', 'Sarah Jenkins', 'sarah.jenkins@company.com', 'United States', refs.eng_org, refs.pos_eng, 'Engineering', 'Senior Dev', '2021-01-12'::date, 'Onboarded', 'https://example.com/avatar-1.png' from refs
  union all
  select 'EMP-2024-042', 'Marcus Thorne', 'marcus.thorne@company.com', 'Germany', refs.sales_org, refs.pos_sales, 'Sales', 'Account Exec', '2019-03-05'::date, 'Resigned', 'https://example.com/avatar-2.png' from refs
  union all
  select 'EMP-2024-118', 'Elena Zhao', 'elena.zhao@company.com', 'Singapore', refs.prod_org, refs.pos_pm, 'Product', 'Manager', '2022-11-22'::date, 'Onboarded', 'https://example.com/avatar-3.png' from refs
  union all
  select 'EMP-2024-089', 'David Okafor', 'david.okafor@company.com', 'United Kingdom', refs.mkt_org, refs.pos_mkt, 'Marketing', 'Director', '2023-06-15'::date, 'Onboarded', 'https://example.com/avatar-4.png' from refs
  union all
  select 'EMP-2024-215', 'Chloe Smith', 'chloe.smith@company.com', 'Canada', refs.fin_org, refs.pos_fin, 'Finance', 'Analyst', '2024-02-10'::date, 'Onboarded', 'https://example.com/avatar-5.png' from refs
) payload
on conflict (employee_code) do update
set full_name = excluded.full_name,
    email = excluded.email,
    country = excluded.country,
    org_id = excluded.org_id,
    position_id = excluded.position_id,
    department = excluded.department,
    role_title = excluded.role_title,
    hire_date = excluded.hire_date,
    status = excluded.status,
    avatar_url = excluded.avatar_url;

insert into public.data_sources (source_name, source_type, sync_mode, status, success_rate, last_sync_at)
values
  ('Workday HRIS', 'HRIS', 'API', 'connected', 99.9, now() - interval '2 hour'),
  ('Greenhouse Recruiting', 'Recruiting', 'Webhook', 'connected', 100.0, now() - interval '1 hour'),
  ('Lattice Performance', 'Performance', 'ETL', 'disconnected', 0.0, now() - interval '1 day'),
  ('Kronos Attendance', 'Attendance', 'API', 'connected', 98.5, now() - interval '30 minutes')
on conflict do nothing;

insert into public.sync_jobs (data_source_id, records_synced, duration_seconds, status, message)
select id, 8420, 84, 'success', 'Workday sync completed'
from public.data_sources
where source_name = 'Workday HRIS'
limit 1
on conflict do nothing;

insert into public.sync_jobs (data_source_id, records_synced, duration_seconds, status, message)
select id, 12100, 192, 'success', 'Entra sync completed'
from public.data_sources
where source_name = 'Greenhouse Recruiting'
limit 1
on conflict do nothing;

insert into public.sync_jobs (data_source_id, records_synced, duration_seconds, status, message)
select id, 0, 4, 'failed', 'CSV parse failed'
from public.data_sources
where source_name = 'Lattice Performance'
limit 1
on conflict do nothing;

insert into public.performance_records (employee_id, review_period, score)
select e.id, x.review_period, x.score
from public.employees e
join (
  values
    ('EMP-2024-001', '2021', 3.2::numeric),
    ('EMP-2024-001', '2022', 4.5::numeric),
    ('EMP-2024-001', '2023-Q1', 4.8::numeric),
    ('EMP-2024-001', '2023-Q2', 3.9::numeric),
    ('EMP-2024-001', '2023-Q3', 4.9::numeric)
) as x(employee_code, review_period, score)
on e.employee_code = x.employee_code
on conflict do nothing;

insert into public.attendance_records (employee_id, work_date, attendance_status)
select e.id, current_date - g, case when g % 7 in (0, 6) then 'Leave' else 'Present' end
from public.employees e
cross join generate_series(1, 30) as g
where e.employee_code = 'EMP-2024-001'
on conflict do nothing;
