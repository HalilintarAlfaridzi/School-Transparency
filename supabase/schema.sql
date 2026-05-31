-- School Transparency baseline schema for Supabase PostgreSQL.
-- Run in a fresh Supabase project, then review every policy with real demo accounts.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('parent', 'treasurer', 'principal', 'admin');
create type public.user_status as enum ('active', 'inactive', 'suspended');
create type public.transaction_type as enum ('income', 'expense');
create type public.transaction_status as enum ('draft', 'pending', 'approved', 'rejected');
create type public.visibility as enum ('public', 'internal');
create type public.approval_status as enum ('approved', 'rejected');

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  address text,
  phone text,
  email text,
  logo_url text,
  description text,
  student_count integer not null default 0,
  class_count integer not null default 0,
  program_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid references public.schools(id) on delete restrict,
  full_name text not null,
  email text not null,
  role public.user_role not null default 'parent',
  avatar_url text,
  status public.user_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.school_years (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.income_categories (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  school_year_id uuid not null references public.school_years(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,
  type public.transaction_type not null,
  income_category_id uuid references public.income_categories(id) on delete restrict,
  expense_category_id uuid references public.expense_categories(id) on delete restrict,
  title text not null,
  description text,
  amount numeric(14, 2) not null check (amount > 0),
  transaction_date date not null,
  status public.transaction_status not null default 'draft',
  visibility public.visibility not null default 'internal',
  is_public boolean not null default false,
  approved_at timestamptz,
  rejected_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transaction_category_matches_type check (
    (type = 'income' and income_category_id is not null and expense_category_id is null)
    or
    (type = 'expense' and expense_category_id is not null and income_category_id is null)
  )
);

create table public.transaction_evidence (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  file_name text not null,
  file_path text not null,
  file_type text not null,
  file_size integer not null check (file_size > 0),
  visibility public.visibility not null default 'internal',
  description text,
  created_at timestamptz not null default now()
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  status public.approval_status not null,
  note text,
  reviewed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  is_read boolean not null default false,
  link_url text,
  created_at timestamptz not null default now()
);

create table public.financial_reports (
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

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_table text not null,
  target_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  key text not null,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, key)
);

create index profiles_school_role_idx on public.profiles(school_id, role);
create index profiles_email_idx on public.profiles(email);
create index transactions_public_idx on public.transactions(status, is_public, visibility);
create index transactions_school_status_idx on public.transactions(school_id, status);
create index transactions_date_idx on public.transactions(transaction_date);
create index evidence_transaction_idx on public.transaction_evidence(transaction_id, visibility);
create index approvals_transaction_idx on public.approvals(transaction_id, reviewed_at);
create index audit_school_created_idx on public.audit_logs(school_id, created_at desc);
create index reports_public_idx on public.financial_reports(school_id, status, published_at desc);

alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.school_years enable row level security;
alter table public.income_categories enable row level security;
alter table public.expense_categories enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_evidence enable row level security;
alter table public.approvals enable row level security;
alter table public.notifications enable row level security;
alter table public.financial_reports enable row level security;
alter table public.audit_logs enable row level security;
alter table public.settings enable row level security;

create or replace function public.current_profile()
returns public.profiles
language sql
stable
security definer
set search_path = public
as $$
  select * from public.profiles where id = auth.uid()
$$;

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and status = 'active'
$$;

create or replace function public.current_school_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_id from public.profiles where id = auth.uid() and status = 'active'
$$;

create or replace function public.is_school_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() = 'admin'
$$;

create policy "Public can read active schools"
on public.schools for select
using (is_active = true);

create policy "Users can read own profile"
on public.profiles for select
using (id = auth.uid() or (public.is_school_admin() and school_id = public.current_school_id()));

create policy "Users can update own non-role profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Admins can manage profiles in school"
on public.profiles for all
using (public.is_school_admin() and school_id = public.current_school_id())
with check (public.is_school_admin() and school_id = public.current_school_id());

create policy "Public can read active school years"
on public.school_years for select
using (school_id in (select id from public.schools where is_active = true));

create policy "School users read categories"
on public.income_categories for select
using (school_id = public.current_school_id() or auth.role() = 'anon');

create policy "School users read expense categories"
on public.expense_categories for select
using (school_id = public.current_school_id() or auth.role() = 'anon');

create policy "Admins manage income categories"
on public.income_categories for all
using (public.is_school_admin() and school_id = public.current_school_id())
with check (public.is_school_admin() and school_id = public.current_school_id());

create policy "Admins manage expense categories"
on public.expense_categories for all
using (public.is_school_admin() and school_id = public.current_school_id())
with check (public.is_school_admin() and school_id = public.current_school_id());

create policy "Public reads approved public transactions"
on public.transactions for select
using (status = 'approved' and is_public = true and visibility = 'public');

create policy "School staff read school transactions"
on public.transactions for select
using (
  school_id = public.current_school_id()
  and public.current_role() in ('treasurer', 'principal', 'admin')
);

create policy "Treasurer creates draft transactions"
on public.transactions for insert
with check (
  school_id = public.current_school_id()
  and created_by = auth.uid()
  and public.current_role() = 'treasurer'
  and status in ('draft', 'pending')
);

create policy "Treasurer updates editable transactions"
on public.transactions for update
using (
  school_id = public.current_school_id()
  and created_by = auth.uid()
  and public.current_role() = 'treasurer'
  and status in ('draft', 'rejected')
)
with check (
  school_id = public.current_school_id()
  and created_by = auth.uid()
  and public.current_role() = 'treasurer'
  and status in ('draft', 'pending')
);

create policy "Admin reads and manages non-approved transactions"
on public.transactions for all
using (public.is_school_admin() and school_id = public.current_school_id())
with check (public.is_school_admin() and school_id = public.current_school_id());

create policy "Public reads public evidence for public transactions"
on public.transaction_evidence for select
using (
  visibility = 'public'
  and exists (
    select 1 from public.transactions t
    where t.id = transaction_id
      and t.status = 'approved'
      and t.is_public = true
      and t.visibility = 'public'
  )
);

create policy "School staff read evidence"
on public.transaction_evidence for select
using (
  exists (
    select 1 from public.transactions t
    where t.id = transaction_id
      and t.school_id = public.current_school_id()
      and public.current_role() in ('treasurer', 'principal', 'admin')
  )
);

create policy "Treasurer uploads evidence for own editable transactions"
on public.transaction_evidence for insert
with check (
  uploaded_by = auth.uid()
  and exists (
    select 1 from public.transactions t
    where t.id = transaction_id
      and t.created_by = auth.uid()
      and t.school_id = public.current_school_id()
      and t.status in ('draft', 'rejected')
  )
);

create policy "Principal inserts approval decisions"
on public.approvals for insert
with check (
  reviewer_id = auth.uid()
  and public.current_role() = 'principal'
  and exists (
    select 1 from public.transactions t
    where t.id = transaction_id
      and t.school_id = public.current_school_id()
      and t.status = 'pending'
      and t.created_by <> auth.uid()
  )
);

create policy "Staff read approvals in school"
on public.approvals for select
using (
  exists (
    select 1 from public.transactions t
    where t.id = transaction_id
      and t.school_id = public.current_school_id()
      and public.current_role() in ('treasurer', 'principal', 'admin')
  )
);

create policy "Users read own notifications"
on public.notifications for select
using (user_id = auth.uid());

create policy "Users update own notifications"
on public.notifications for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Public reads published reports"
on public.financial_reports for select
using (status = 'published');

create policy "School staff read school reports"
on public.financial_reports for select
using (
  school_id = public.current_school_id()
  and public.current_role() in ('treasurer', 'principal', 'admin')
);

create policy "Admins manage school reports"
on public.financial_reports for all
using (public.is_school_admin() and school_id = public.current_school_id())
with check (public.is_school_admin() and school_id = public.current_school_id());

create policy "Admins read audit logs"
on public.audit_logs for select
using (public.is_school_admin() and school_id = public.current_school_id());

create policy "Authenticated users insert audit logs for own school"
on public.audit_logs for insert
with check (school_id = public.current_school_id() and actor_id = auth.uid());

create policy "Admins manage settings"
on public.settings for all
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

create trigger create_profile_after_signup
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id and not public.is_school_admin() then
    if new.role is distinct from old.role
      or new.school_id is distinct from old.school_id
      or new.status is distinct from old.status then
      raise exception 'Users cannot change own role, school, or account status';
    end if;
  end if;

  return new;
end;
$$;

create trigger protect_profile_privileges
before update on public.profiles
for each row execute function public.prevent_profile_privilege_escalation();

create or replace function public.prevent_approved_transaction_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status = 'approved' then
    if new.type is distinct from old.type
      or new.income_category_id is distinct from old.income_category_id
      or new.expense_category_id is distinct from old.expense_category_id
      or new.title is distinct from old.title
      or new.description is distinct from old.description
      or new.amount is distinct from old.amount
      or new.transaction_date is distinct from old.transaction_date
      or new.created_by is distinct from old.created_by
      or new.school_id is distinct from old.school_id
      or new.school_year_id is distinct from old.school_year_id then
      raise exception 'Approved transactions are immutable. Use a correction transaction.';
    end if;
  end if;

  return new;
end;
$$;

create trigger protect_approved_transactions
before update on public.transactions
for each row execute function public.prevent_approved_transaction_mutation();

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
