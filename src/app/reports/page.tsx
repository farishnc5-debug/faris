import { byId, customers, trips } from "@/lib/demo-data";

export default function ReportsPage() {
  const haulageByCustomer = customers.map((customer) => {
    const customerTrips = trips.filter((trip) => trip.customerId === customer.id);
    const revenue = customerTrips.reduce((sum, trip) => sum + (trip.status === "booking" || trip.status === "assigned" ? 0 : customer.haulageRateSar), 0);
    return { customer, tripCount: customerTrips.length, revenue };
  });

  const detentionByLocation = trips
    .flatMap((trip) => trip.detentionEvents.map((event) => ({ ...event, tripNo: trip.tripNo, customer: byId(customers, trip.customerId) })))
    .sort((a, b) => b.billableAmountSar - a.billableAmountSar);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold">Reports / التقارير</h2>
        <p className="mt-1 text-sm text-slate-600">Haulage revenue and detention billing summaries, demo data only.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Haulage revenue by customer / الإيراد حسب العميل</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Trips</th>
                <th className="px-3 py-2">Haulage rate (SAR)</th>
                <th className="px-3 py-2">Revenue (SAR)</th>
              </tr>
            </thead>
            <tbody>
              {haulageByCustomer.map(({ customer, tripCount, revenue }) => (
                <tr key={customer.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">{customer.name}</td>
                  <td className="px-3 py-2">{tripCount}</td>
                  <td className="px-3 py-2">{customer.haulageRateSar.toLocaleString()}</td>
                  <td className="px-3 py-2">{revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Detention billing / فوترة الاحتجاز</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="px-3 py-2">Trip</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Hours</th>
                <th className="px-3 py-2">Amount (SAR)</th>
              </tr>
            </thead>
            <tbody>
              {detentionByLocation.map((event) => (
                <tr key={event.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">{event.tripNo}</td>
                  <td className="px-3 py-2">{event.customer?.name}</td>
                  <td className="px-3 py-2">{event.locationLabel}</td>
                  <td className="px-3 py-2">{event.billableHours}</td>
                  <td className="px-3 py-2">{event.billableAmountSar.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
