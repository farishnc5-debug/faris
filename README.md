# Al-Rawasi Logistics — Easy Logic TMS

Bilingual (EN/AR) MVP for trip lifecycle, detention tracking, GPS visibility, and draft invoicing. Built with Next.js (App Router) and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/app` — routes: dashboard (`/`), `/trips`, `/gps`, `/invoices`, `/reports`, `/admin`.
- `src/components/app-shell.tsx` — shared sidebar/nav shell.
- `src/lib/types.ts` — domain types (trips, customers, trucks, drivers, detention, invoices).
- `src/lib/demo-data.ts` — in-memory demo data and derived metrics used by every page.

Roles (`CS`, `DS`, `ACC`, `DRIVER`, `ADMIN`) carry explicit GPS/location-data access restrictions — see `/admin`.

## Known launch blockers

- Rotate GPS vendor credential.
- Verify TRACKING MAPS 3.24 backend assumptions.
- Test staging migration checklist.
