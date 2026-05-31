# School Transparency

School Transparency adalah platform transparansi keuangan sekolah berbasis web. Fokusnya adalah public financial dashboard, approval workflow, evidence upload, role-based access, dan audit trail.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- React Router DOM
- Recharts
- Supabase client, PostgreSQL schema, and RLS draft

## Demo Roles

Login page menyediakan role selector untuk portfolio demo:

- Parent
- Bendahara
- Kepala Sekolah
- System Admin

Data aplikasi memakai Supabase. Supabase client tersedia di `src/lib/supabase.ts`, schema awal ada di `supabase/schema.sql`, dan migration untuk project yang sudah punya tabel dasar tersedia di `supabase/apply-full-integration.sql`.

## Core Routes

- `/transparency`: public financial dashboard
- `/reports`: public reports
- `/parent`: parent dashboard
- `/treasurer`: transaction management and evidence workflow
- `/principal`: pending approvals and financial analytics
- `/admin`: user, category, settings, and audit log management

## Local Development

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` when connecting a real Supabase project.

## GitHub Pages Deployment

Project sudah disiapkan untuk deploy sebagai GitHub Pages project site, misalnya:

```text
https://<username>.github.io/<repository-name>/
```

Workflow deploy ada di `.github/workflows/deploy-github-pages.yml`. Saat push ke branch `main`, GitHub Actions akan:

1. Install dependencies dengan `npm ci`.
2. Build aplikasi dengan `VITE_BASE_PATH=/<repository-name>/`.
3. Membuat `dist/404.html` untuk fallback React Router.
4. Publish folder `dist` ke GitHub Pages.

Setup di GitHub:

1. Buka repository GitHub.
2. Masuk ke `Settings > Pages`.
3. Pilih `Source: GitHub Actions`.
4. Masuk ke `Settings > Secrets and variables > Actions > Variables`.
5. Tambahkan repository variables berikut:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_ANON_KEY
```

`VITE_BASE_PATH` tidak perlu dibuat di GitHub karena workflow mengisinya otomatis dari nama repository.

Supabase Auth juga perlu diarahkan ke URL GitHub Pages. Di Supabase dashboard, buka `Authentication > URL Configuration`, lalu tambahkan:

```text
Site URL: https://<username>.github.io/<repository-name>/
Redirect URLs:
https://<username>.github.io/<repository-name>/**
https://<username>.github.io/<repository-name>/reset-password
https://<username>.github.io/<repository-name>/verify-email
```

## Demo Accounts

The app data always comes from Supabase. The login page also includes demo role shortcuts for viewing role-based UI without creating a Supabase session. Write actions such as creating transactions or approving transactions require a real Supabase login.

## Portfolio Focus

This project is intentionally scoped as a transparency and accountability workflow, not a full ERP accounting system. The strongest MVP path is:

1. Auth and role routing.
2. Treasurer transaction CRUD.
3. Evidence upload.
4. Principal approval/rejection.
5. Public dashboard for approved public transactions.
6. Basic analytics and audit logs.
