import { byId, customers, getTripMetrics, statusLabel, trips } from "@/lib/demo-data";

export default function DashboardPage() {
  const metrics = getTripMetrics();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold">Dashboard / لوحة التحكم</h2>
        <p className="mt-1 text-sm text-slate-600">Snapshot of today&apos;s trip lifecycle, detention, and billing posture.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Trips today" ar="رحلات اليوم" value={metrics.tripsToday} />
        <StatCard label="Billable detention (SAR)" ar="احتجاز قابل للفوترة" value={metrics.billableDetention.toLocaleString()} />
        <StatCard label="Ops closed, pending payment" ar="إغلاق تشغيلي بانتظار الدفع" value={metrics.opsClosedPendingPayment} />
        <StatCard label="Fleet utilization" ar="استخدام الأسطول" value={`${metrics.fleetUtilization}%`} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Trips by status / الرحلات حسب الحالة</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.byStatus.map((entry) => (
            <div key={entry.status} className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{entry.count}</p>
              <p className="mt-1 text-xs text-slate-600">{statusLabel[entry.status]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Recent trips / آخر الرحلات</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="px-3 py-2">Trip</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Consignee</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">{trip.tripNo}</td>
                  <td className="px-3 py-2">{byId(customers, trip.customerId)?.name}</td>
                  <td className="px-3 py-2">{statusLabel[trip.status]}</td>
                  <td className="px-3 py-2">{trip.consignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, ar, value }: { label: string; ar: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
      <p className="text-xs text-slate-500">{ar}</p>
    </div>
  );
}
