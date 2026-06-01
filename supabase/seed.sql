-- Public dashboard seed data for School Transparency.
-- This seed only fills the public landing/dashboard data.
-- Demo role shortcuts stay localStorage-only in the React app.

begin;

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
    is_active = excluded.is_active,
    updated_at = now();

insert into public.school_years (school_id, name, start_date, end_date, is_active)
select s.id, '2025/2026', '2025-07-01', '2026-06-30', true
from public.schools s
where s.slug = 'smp-nusantara-1'
and not exists (
  select 1
  from public.school_years y
  where y.school_id = s.id
    and y.name = '2025/2026'
);

update public.school_years y
set start_date = '2025-07-01',
    end_date = '2026-06-30',
    is_active = true
from public.schools s
where y.school_id = s.id
  and s.slug = 'smp-nusantara-1'
  and y.name = '2025/2026';

with seeded_school as (
  select id from public.schools where slug = 'smp-nusantara-1'
),
income_seed(name, description) as (
  values
    ('SPP', 'Rekap penerimaan pembayaran rutin orang tua.'),
    ('Dana BOS', 'Bantuan operasional sekolah dari pemerintah.'),
    ('Donasi', 'Dukungan dana dari alumni, orang tua, atau komunitas.'),
    ('Sponsorship', 'Dukungan sponsor kegiatan sekolah.'),
    ('Dana Kegiatan', 'Dana masuk terkait kegiatan sekolah.')
)
insert into public.income_categories (school_id, name, description, is_active)
select s.id, c.name, c.description, true
from seeded_school s
cross join income_seed c
where not exists (
  select 1
  from public.income_categories existing
  where existing.school_id = s.id
    and existing.name = c.name
);

with seeded_school as (
  select id from public.schools where slug = 'smp-nusantara-1'
),
income_seed(name, description) as (
  values
    ('SPP', 'Rekap penerimaan pembayaran rutin orang tua.'),
    ('Dana BOS', 'Bantuan operasional sekolah dari pemerintah.'),
    ('Donasi', 'Dukungan dana dari alumni, orang tua, atau komunitas.'),
    ('Sponsorship', 'Dukungan sponsor kegiatan sekolah.'),
    ('Dana Kegiatan', 'Dana masuk terkait kegiatan sekolah.')
)
update public.income_categories category
set description = c.description,
    is_active = true
from seeded_school s, income_seed c
where category.school_id = s.id
  and category.name = c.name;

with seeded_school as (
  select id from public.schools where slug = 'smp-nusantara-1'
),
expense_seed(name, description) as (
  values
    ('Operasional', 'ATK, listrik, air, internet, dan administrasi.'),
    ('Renovasi', 'Perbaikan kelas, toilet, dan fasilitas umum.'),
    ('Pembelian Alat', 'Peralatan belajar, komputer, proyektor, dan alat lab.'),
    ('Kegiatan Siswa', 'Lomba, ekstrakurikuler, event, dan transportasi kegiatan.'),
    ('Gaji Agregat', 'Ringkasan gaji agregat tanpa nama individu.'),
    ('Maintenance', 'Perawatan fasilitas, kebersihan, dan servis alat.')
)
insert into public.expense_categories (school_id, name, description, is_active)
select s.id, c.name, c.description, true
from seeded_school s
cross join expense_seed c
where not exists (
  select 1
  from public.expense_categories existing
  where existing.school_id = s.id
    and existing.name = c.name
);

with seeded_school as (
  select id from public.schools where slug = 'smp-nusantara-1'
),
expense_seed(name, description) as (
  values
    ('Operasional', 'ATK, listrik, air, internet, dan administrasi.'),
    ('Renovasi', 'Perbaikan kelas, toilet, dan fasilitas umum.'),
    ('Pembelian Alat', 'Peralatan belajar, komputer, proyektor, dan alat lab.'),
    ('Kegiatan Siswa', 'Lomba, ekstrakurikuler, event, dan transportasi kegiatan.'),
    ('Gaji Agregat', 'Ringkasan gaji agregat tanpa nama individu.'),
    ('Maintenance', 'Perawatan fasilitas, kebersihan, dan servis alat.')
)
update public.expense_categories category
set description = c.description,
    is_active = true
from seeded_school s, expense_seed c
where category.school_id = s.id
  and category.name = c.name;

-- Required only because transactions.created_by must reference profiles.
-- This is not a demo login account and no known password is stored in the app.
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values (
  '11111111-1111-4111-8111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'seed-publisher@school-transparency.local',
  crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Seed Data Publisher"}'::jsonb,
  now(),
  now(),
  encode(gen_random_bytes(16), 'hex'),
  '',
  encode(gen_random_bytes(16), 'hex'),
  encode(gen_random_bytes(16), 'hex')
)
on conflict (id) do update
set email = excluded.email,
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    updated_at = now();

insert into public.profiles (
  id,
  school_id,
  full_name,
  email,
  role,
  status
)
select
  '11111111-1111-4111-8111-111111111111',
  s.id,
  'Seed Data Publisher',
  'seed-publisher@school-transparency.local',
  'treasurer',
  'inactive'
from public.schools s
where s.slug = 'smp-nusantara-1'
on conflict (id) do update
set school_id = excluded.school_id,
    full_name = excluded.full_name,
    email = excluded.email,
    role = excluded.role,
    status = excluded.status,
    updated_at = now();

with seed_transactions(id) as (
  values
    ('20000000-0000-4000-8000-000000000001'::uuid),
    ('20000000-0000-4000-8000-000000000002'::uuid),
    ('20000000-0000-4000-8000-000000000003'::uuid),
    ('20000000-0000-4000-8000-000000000004'::uuid),
    ('20000000-0000-4000-8000-000000000005'::uuid),
    ('20000000-0000-4000-8000-000000000006'::uuid),
    ('20000000-0000-4000-8000-000000000007'::uuid),
    ('20000000-0000-4000-8000-000000000008'::uuid),
    ('20000000-0000-4000-8000-000000000009'::uuid),
    ('20000000-0000-4000-8000-000000000010'::uuid),
    ('20000000-0000-4000-8000-000000000011'::uuid)
)
delete from public.transaction_evidence evidence
using seed_transactions seeded
where evidence.transaction_id = seeded.id;

with seed_transactions(id) as (
  values
    ('20000000-0000-4000-8000-000000000001'::uuid),
    ('20000000-0000-4000-8000-000000000002'::uuid),
    ('20000000-0000-4000-8000-000000000003'::uuid),
    ('20000000-0000-4000-8000-000000000004'::uuid),
    ('20000000-0000-4000-8000-000000000005'::uuid),
    ('20000000-0000-4000-8000-000000000006'::uuid),
    ('20000000-0000-4000-8000-000000000007'::uuid),
    ('20000000-0000-4000-8000-000000000008'::uuid),
    ('20000000-0000-4000-8000-000000000009'::uuid),
    ('20000000-0000-4000-8000-000000000010'::uuid),
    ('20000000-0000-4000-8000-000000000011'::uuid)
)
delete from public.transactions tx
using seed_transactions seeded
where tx.id = seeded.id;

with seed_reports(id) as (
  values
    ('30000000-0000-4000-8000-000000000001'::uuid),
    ('30000000-0000-4000-8000-000000000002'::uuid),
    ('30000000-0000-4000-8000-000000000003'::uuid)
)
delete from public.financial_reports report_row
using seed_reports seeded
where report_row.id = seeded.id;

with seeded_school as (
  select id from public.schools where slug = 'smp-nusantara-1'
),
active_year as (
  select y.id, y.name
  from public.school_years y
  join seeded_school s on s.id = y.school_id
  where y.name = '2025/2026'
  limit 1
),
transaction_seed(
  id,
  type,
  category_name,
  title,
  description,
  amount,
  transaction_date,
  approved_at
) as (
  values
    (
      '20000000-0000-4000-8000-000000000001'::uuid,
      'income',
      'SPP',
      'Penerimaan SPP Juli 2025',
      'Rekap pembayaran SPP bulan Juli 2025 dari orang tua siswa.',
      65400000.00,
      '2025-07-08'::date,
      '2025-07-10 09:15:00+07'::timestamptz
    ),
    (
      '20000000-0000-4000-8000-000000000002'::uuid,
      'expense',
      'Operasional',
      'Pembelian ATK semester ganjil',
      'Pengadaan kertas, tinta printer, map arsip, dan perlengkapan administrasi semester ganjil.',
      8700000.00,
      '2025-07-12'::date,
      '2025-07-13 13:20:00+07'::timestamptz
    ),
    (
      '20000000-0000-4000-8000-000000000003'::uuid,
      'income',
      'Dana BOS',
      'Pencairan Dana BOS tahap 1',
      'Dana BOS tahap pertama untuk dukungan operasional dan kegiatan pembelajaran.',
      185000000.00,
      '2025-08-05'::date,
      '2025-08-06 10:00:00+07'::timestamptz
    ),
    (
      '20000000-0000-4000-8000-000000000004'::uuid,
      'expense',
      'Renovasi',
      'Renovasi ruang perpustakaan',
      'Perbaikan plafon, pengecatan, rak buku, dan lampu baca untuk ruang perpustakaan.',
      43500000.00,
      '2025-08-18'::date,
      '2025-08-20 14:45:00+07'::timestamptz
    ),
    (
      '20000000-0000-4000-8000-000000000005'::uuid,
      'expense',
      'Pembelian Alat',
      'Pengadaan alat praktikum IPA',
      'Pembelian mikroskop siswa, alat ukur, bahan praktikum, dan perlengkapan laboratorium.',
      31800000.00,
      '2025-09-09'::date,
      '2025-09-10 11:35:00+07'::timestamptz
    ),
    (
      '20000000-0000-4000-8000-000000000006'::uuid,
      'income',
      'Donasi',
      'Donasi alumni untuk perpustakaan',
      'Dukungan alumni untuk penambahan koleksi buku dan pojok baca siswa.',
      22500000.00,
      '2025-09-22'::date,
      '2025-09-23 08:40:00+07'::timestamptz
    ),
    (
      '20000000-0000-4000-8000-000000000007'::uuid,
      'expense',
      'Kegiatan Siswa',
      'Transportasi lomba sains kota',
      'Biaya transportasi, konsumsi, dan registrasi peserta lomba sains tingkat kota.',
      9600000.00,
      '2025-10-14'::date,
      '2025-10-15 15:05:00+07'::timestamptz
    ),
    (
      '20000000-0000-4000-8000-000000000008'::uuid,
      'income',
      'Dana Kegiatan',
      'Dana kegiatan market day',
      'Pemasukan dari kontribusi kegiatan market day dan bazar karya siswa.',
      18750000.00,
      '2025-11-02'::date,
      '2025-11-03 10:25:00+07'::timestamptz
    ),
    (
      '20000000-0000-4000-8000-000000000009'::uuid,
      'expense',
      'Operasional',
      'Tagihan listrik dan internet triwulan',
      'Pembayaran listrik, internet sekolah, dan dukungan jaringan pembelajaran digital.',
      14250000.00,
      '2025-12-11'::date,
      '2025-12-12 09:50:00+07'::timestamptz
    ),
    (
      '20000000-0000-4000-8000-000000000010'::uuid,
      'income',
      'Sponsorship',
      'Sponsorship lomba literasi',
      'Dukungan sponsor untuk hadiah, sertifikat, dan dokumentasi lomba literasi sekolah.',
      12000000.00,
      '2026-01-16'::date,
      '2026-01-17 13:10:00+07'::timestamptz
    ),
    (
      '20000000-0000-4000-8000-000000000011'::uuid,
      'expense',
      'Maintenance',
      'Maintenance sanitasi sekolah',
      'Perawatan wastafel, saluran air, dan perlengkapan kebersihan area kelas.',
      11400000.00,
      '2026-02-07'::date,
      '2026-02-08 10:55:00+07'::timestamptz
    )
)
insert into public.transactions (
  id,
  school_id,
  school_year_id,
  created_by,
  type,
  income_category_id,
  expense_category_id,
  title,
  description,
  amount,
  transaction_date,
  status,
  visibility,
  is_public,
  approved_at,
  published_at,
  created_at,
  updated_at
)
select
  data.id,
  s.id,
  y.id,
  '11111111-1111-4111-8111-111111111111'::uuid,
  data.type::public.transaction_type,
  case when data.type = 'income' then income.id else null end,
  case when data.type = 'expense' then expense.id else null end,
  data.title,
  data.description,
  data.amount,
  data.transaction_date,
  'approved',
  'public',
  true,
  data.approved_at,
  data.approved_at,
  data.approved_at - interval '2 days',
  data.approved_at
from transaction_seed data
cross join seeded_school s
cross join active_year y
left join public.income_categories income
  on income.school_id = s.id
 and income.name = data.category_name
 and data.type = 'income'
left join public.expense_categories expense
  on expense.school_id = s.id
 and expense.name = data.category_name
 and data.type = 'expense';

insert into public.transaction_evidence (
  id,
  transaction_id,
  uploaded_by,
  file_name,
  file_path,
  file_type,
  file_size,
  visibility,
  description,
  created_at
)
values
  (
    '40000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    'rekap-spp-juli-2025.pdf',
    'public/evidence/rekap-spp-juli-2025.pdf',
    'application/pdf',
    245760,
    'public',
    'Rekap agregat pembayaran SPP tanpa data pribadi siswa.',
    '2025-07-10 09:20:00+07'
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000004',
    '11111111-1111-4111-8111-111111111111',
    'bukti-renovasi-perpustakaan.pdf',
    'public/evidence/bukti-renovasi-perpustakaan.pdf',
    'application/pdf',
    389120,
    'public',
    'Ringkasan invoice dan dokumentasi renovasi ruang perpustakaan.',
    '2025-08-20 15:00:00+07'
  ),
  (
    '40000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000005',
    '11111111-1111-4111-8111-111111111111',
    'pengadaan-alat-lab-ipa.pdf',
    'public/evidence/pengadaan-alat-lab-ipa.pdf',
    'application/pdf',
    327680,
    'public',
    'Daftar item pengadaan alat praktikum IPA yang aman ditampilkan publik.',
    '2025-09-10 11:50:00+07'
  ),
  (
    '40000000-0000-4000-8000-000000000004',
    '20000000-0000-4000-8000-000000000011',
    '11111111-1111-4111-8111-111111111111',
    'maintenance-sanitasi-februari-2026.pdf',
    'public/evidence/maintenance-sanitasi-februari-2026.pdf',
    'application/pdf',
    196608,
    'public',
    'Ringkasan pekerjaan maintenance sanitasi sekolah.',
    '2026-02-08 11:10:00+07'
  );

with seeded_school as (
  select id from public.schools where slug = 'smp-nusantara-1'
),
active_year as (
  select y.id, y.name
  from public.school_years y
  join seeded_school s on s.id = y.school_id
  where y.name = '2025/2026'
  limit 1
),
report_seed(
  id,
  title,
  period,
  total_income,
  total_expense,
  file_path,
  file_type,
  published_at
) as (
  values
    (
      '30000000-0000-4000-8000-000000000001'::uuid,
      'Laporan Keuangan Publik Juli-September 2025',
      'Triwulan 1',
      272900000.00,
      84000000.00,
      'public/reports/laporan-q1-2025.pdf',
      'PDF',
      '2025-10-05 09:00:00+07'::timestamptz
    ),
    (
      '30000000-0000-4000-8000-000000000002'::uuid,
      'Laporan Keuangan Publik Oktober-Desember 2025',
      'Triwulan 2',
      18750000.00,
      23850000.00,
      'public/reports/laporan-q2-2025.pdf',
      'PDF',
      '2026-01-08 09:30:00+07'::timestamptz
    ),
    (
      '30000000-0000-4000-8000-000000000003'::uuid,
      'Ringkasan Transparansi Januari-Februari 2026',
      'Januari-Februari 2026',
      12000000.00,
      11400000.00,
      'public/reports/ringkasan-jan-feb-2026.csv',
      'CSV',
      '2026-03-03 10:15:00+07'::timestamptz
    )
)
insert into public.financial_reports (
  id,
  school_id,
  school_year_id,
  title,
  period,
  school_year,
  total_income,
  total_expense,
  file_path,
  file_type,
  status,
  published_at,
  created_at,
  updated_at
)
select
  report_row.id,
  s.id,
  y.id,
  report_row.title,
  report_row.period,
  y.name,
  report_row.total_income,
  report_row.total_expense,
  report_row.file_path,
  report_row.file_type,
  'published',
  report_row.published_at,
  report_row.published_at - interval '1 day',
  report_row.published_at
from report_seed report_row
cross join seeded_school s
cross join active_year y;

commit;
