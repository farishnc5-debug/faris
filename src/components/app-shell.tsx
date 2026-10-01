import Link from "next/link";
import { ReactNode } from "react";

const nav = [
  { href: "/", label: "Dashboard", ar: "لوحة التحكم" },
  { href: "/trips", label: "Trips", ar: "الرحلات" },
  { href: "/gps", label: "GPS board", ar: "لوحة التتبع" },
  { href: "/invoices", label: "Draft invoices", ar: "الفواتير الأولية" },
  { href: "/reports", label: "Reports", ar: "التقارير" },
  { href: "/admin", label: "Admin", ar: "الإدارة" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-6">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">Easy Logic TMS</p>
            <h1 className="mt-3 text-2xl font-bold">Al-Rawasi Logistics</h1>
            <p className="mt-2 text-sm text-slate-600">Bilingual MVP for trip lifecycle, detention, GPS, and draft invoicing.</p>
          </div>

          <div className="mt-6 rounded-2xl bg-sky-50 p-4 text-sm text-sky-900">
            <p className="font-semibold">Roles / الأدوار</p>
            <p className="mt-1 text-sky-800">CS, DS, ACC, DRIVER, ADMIN with explicit location-data restrictions.</p>
          </div>

          <nav className="mt-6 space-y-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                <span className="block">{item.label}</span>
                <span className="block text-xs text-slate-500">{item.ar}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Launch blockers</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Rotate GPS vendor credential</li>
              <li>Verify TRACKING MAPS 3.24 backend assumptions</li>
              <li>Test staging migration checklist</li>
            </ul>
          </div>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
