# RLS Strategy

School Transparency separates public transparency from internal finance operations.

## Public Read Model

Anonymous users can read:

- Active school profile.
- Transactions where `status = approved`, `is_public = true`, and `visibility = public`.
- Evidence where `visibility = public` and the linked transaction is approved/public.

Anonymous users cannot write any table.

## Role Scope

- Parent: reads published data, owns profile and notification preferences.
- Treasurer: creates transactions, uploads evidence, edits draft/rejected, submits pending approval.
- Principal: reviews pending transactions in the same school and writes approval decisions.
- Admin: manages school-scoped users, categories, settings, and reads audit logs.

## Sensitive Data Rules

- Evidence defaults to `internal`.
- Approved transactions should not be edited directly. Use correction transactions for financial corrections.
- Audit logs have no UI delete flow.
- Service role keys must never be exposed in the React client.

## Storage Buckets

- `transaction-evidence`: private by default; public read only through policies for public evidence.
- `reports`: published PDF/CSV reports.
- `school-assets`: logo and public school profile assets.

Suggested path pattern:

```text
transaction-evidence/{school_id}/{transaction_id}/{timestamp}-{safe_filename}
reports/{school_id}/{school_year}/monthly-report-2026-01.pdf
school-assets/{school_id}/logo.png
```
