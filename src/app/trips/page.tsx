import { byId, customers, drivers, routes, statusLabel, trips, trucks } from "@/lib/demo-data";

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold">Trips / الرحلات</h2>
        <p className="mt-1 text-sm text-slate-600">Full trip lifecycle: booking through ops and payment closure.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="px-3 py-2">Trip No</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Route</th>
                <th className="px-3 py-2">Truck</th>
                <th className="px-3 py-2">Driver</th>
                <th className="px-3 py-2">Consignee</th>
                <th className="px-3 py-2">Containers</th>
                <th className="px-3 py-2">Waybill</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">{trip.tripNo}</td>
                  <td className="px-3 py-2">{statusLabel[trip.status]}</td>
                  <td className="px-3 py-2">{byId(customers, trip.customerId)?.name}</td>
                  <td className="px-3 py-2">{byId(routes, trip.routeId)?.name}</td>
                  <td className="px-3 py-2">{byId(trucks, trip.truckId)?.plateNo}</td>
                  <td className="px-3 py-2">{byId(drivers, trip.driverId)?.name}</td>
                  <td className="px-3 py-2">{trip.consignee}</td>
                  <td className="px-3 py-2">{trip.containerNumbers.join(", ")}</td>
                  <td className="px-3 py-2">{trip.waybillRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
