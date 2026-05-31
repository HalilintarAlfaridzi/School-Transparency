-- Run this in Supabase SQL Editor for an existing School Transparency project.
-- It is designed for the current project state: base tables exist, but seed data
-- and the financial_reports table may be missing.

alter table public.schools add column if not exists student_count integer not null default 0;
alter table public.schools add column if not exists class_count integer not null default 0;
alter table public.schools add column if not exists program_count integer not null default 0;

create table if not exists public.financial_reports (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  school_year_id uuid references public.school_years(id) on delete set null,
  title text not null,
  period text not null,
  school_year text not null,
  total_income numeric(14, 2) not null default 0,
  total_expense numeric(14, 2) not null default 0,
  file_path text,
  file_type text not null default 'PDF',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.financial_reports enable row level security;
create index if not exists reports_public_idx on public.financial_reports(school_id, status, published_at desc);

drop policy if exists "Public reads published reports" on public.financial_reports;
create policy "Public reads published reports"
on public.financial_reports for select
using (status = 'published');

drop policy if exists "School staff read school reports" on public.financial_reports;
create policy "School staff read school reports"
on public.financial_reports for select
using (
  school_id = public.current_school_id()
  and public.current_role() in ('treasurer', 'principal', 'admin')
);

drop policy if exists "Admins manage school reports" on public.financial_reports;
create policy "Admins manage school reports"
on public.financial_reports for all
using (public.is_school_admin() and school_id = public.current_school_id())
with check (public.is_school_admin() and school_id = public.current_school_id());

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_school_id uuid;
begin
  select id into default_school_id
  from public.schools
  where is_active = true
  order by created_at
  limit 1;

  insert into public.profiles (id, school_id, full_name, email, role, status)
  values (
    new.id,
    default_school_id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    'parent',
    'active'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists create_profile_after_signup on auth.users;
create trigger create_profile_after_signup
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.apply_approval_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' then
    update public.transactions
      set status = 'approved',
          approved_at = new.reviewed_at,
          rejected_at = null,
          published_at = case
            when is_public = true and visibility = 'public' then coalesce(published_at, new.reviewed_at)
            else published_at
          end,
          updated_at = now()
      where id = new.transaction_id and status = 'pending';

    insert into public.audit_logs (school_id, actor_id, action, target_table, target_id, old_values, new_values)
    select
      t.school_id,
      new.reviewer_id,
      'approve_transaction',
      'transactions',
      new.transaction_id,
      jsonb_build_object('status', 'pending'),
      jsonb_build_object('status', 'approved', 'note', new.note)
    from public.transactions t
    where t.id = new.transaction_id;
  elsif new.status = 'rejected' then
    update public.transactions
      set status = 'rejected',
          rejected_at = new.reviewed_at,
          updated_at = now()
      where id = new.transaction_id and status = 'pending';

    insert into public.audit_logs (school_id, actor_id, action, target_table, target_id, old_values, new_values)
    select
      t.school_id,
      new.reviewer_id,
      'reject_transaction',
      'transactions',
      new.transaction_id,
      jsonb_build_object('status', 'pending'),
      jsonb_build_object('status', 'rejected', 'note', new.note)
    from public.transactions t
    where t.id = new.transaction_id;
  end if;

  return new;
end;
$$;

drop trigger if exists sync_transaction_approval_status on public.approvals;
create trigger sync_transaction_approval_status
after insert on public.approvals
for each row execute function public.apply_approval_decision();

insert into public.schools (
  name,
  slug,
  address,
  phone,
  email,
  description,
  student_count,
  class_count,
  program_count,
  is_active
)
values (
  'SMP Nusantara 1',
  'smp-nusantara-1',
  'Jl. Pendidikan No. 18, Bandung',
  '+62 22 730 2001',
  'info@smpnusantara.sch.id',
  'Sekolah menengah pertama dengan komitmen transparansi dana kegiatan, operasional, dan pengembangan fasilitas.',
  812,
  27,
  8,
  true
)
on conflict (slug) do update
set name = excluded.name,
    address = excluded.address,
    phone = excluded.phone,
    email = excluded.email,
    description = excluded.description,
    student_count = excluded.student_count,
    class_count = excluded.class_count,
    program_count = excluded.program_count,
    is_active = excluded.is_active;

insert into public.school_years (school_id, name, start_date, end_date, is_active)
select id, '2025/2026', '2025-07-01', '2026-06-30', true
from public.schools
where slug = 'smp-nusantara-1'
and not exists (
  select 1 from public.school_years y
  where y.school_id = schools.id and y.name = '2025/2026'
);

insert into public.income_categories (school_id, name, description)
select s.id, c.name, c.description
from public.schools s
cross join (
  values
    ('SPP', 'Rekap penerimaan pembayaran rutin orang tua.'),
    ('Dana BOS', 'Bantuan operasional sekolah dari pemerintah.'),
    ('Donasi', 'Dukungan dana dari alumni, orang tua, atau komunitas.'),
    ('Sponsorship', 'Dukungan sponsor kegiatan sekolah.'),
    ('Dana Kegiatan', 'Dana masuk terkait kegiatan sekolah.')
) as c(name, description)
where s.slug = 'smp-nusantara-1'
and not exists (
  select 1 from public.income_categories existing
  where existing.school_id = s.id and existing.name = c.name
);

insert into public.expense_categories (school_id, name, description)
select s.id, c.name, c.description
from public.schools s
cross join (
  values
    ('Operasional', 'ATK, listrik, air, internet, dan administrasi.'),
    ('Renovasi', 'Perbaikan kelas, toilet, dan fasilitas umum.'),
    ('Pembelian Alat', 'Peralatan belajar, komputer, proyektor, dan alat lab.'),
    ('Kegiatan Siswa', 'Lomba, ekstrakurikuler, event, dan transportasi kegiatan.'),
    ('Gaji Agregat', 'Ringkasan gaji agregat tanpa nama individu.'),
    ('Maintenance', 'Perawatan fasilitas, kebersihan, dan servis alat.')
) as c(name, description)
where s.slug = 'smp-nusantara-1'
and not exists (
  select 1 from public.expense_categories existing
  where existing.school_id = s.id and existing.name = c.name
);
