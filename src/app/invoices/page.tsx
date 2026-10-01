import { byId, customers, statusLabel, trips } from "@/lib/demo-data";

export default function InvoicesPage() {
  const drafted = trips.filter((trip) => trip.invoice);
  const awaitingDraft = trips.filter((trip) => trip.status === "ops_closed" && !trip.invoice);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold">Draft invoices / الفواتير الأولية</h2>
        <p className="mt-1 text-sm text-slate-600">Haulage and detention charges rolled up per trip, pending accounting certification.</p>
      </header>

      {awaitingDraft.length > 0 && (
        <section className="rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-6 text-sm text-amber-900 shadow-sm">
          <p className="font-semibold">Awaiting draft / بانتظار المسودة</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {awaitingDraft.map((trip) => (
              <li key={trip.id}>{trip.tripNo} — {byId(customers, trip.customerId)?.name}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        {drafted.map((trip) => {
          const customer = byId(customers, trip.customerId);
          const total = trip.invoice?.lines.reduce((sum, line) => sum + line.amountSar, 0) ?? 0;
          return (
            <div key={trip.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{trip.invoice?.draftNo} — {trip.tripNo}</p>
                  <p className="text-sm text-slate-600">{customer?.name} / {customer?.arabicName}</p>
                </div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{statusLabel[trip.status]}</p>
              </div>

              <table className="mt-4 w-full text-left text-sm">
                <tbody>
                  {trip.invoice?.lines.map((line) => (
                    <tr key={line.id} className="border-t border-slate-100">
                      <td className="px-3 py-2 text-slate-700">{line.description}</td>
                      <td className="px-3 py-2 text-right font-medium text-slate-900">SAR {line.amountSar.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-900">Total</td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-900">SAR {total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <p className="mt-3 text-xs text-slate-500">
                Certified invoice ref: {trip.invoice?.certifiedInvoiceRef || "not yet certified"}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
