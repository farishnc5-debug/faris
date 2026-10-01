import { byId, gpsRecords, trucks } from "@/lib/demo-data";

export default function GpsBoardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold">GPS board / لوحة التتبع</h2>
        <p className="mt-1 text-sm text-slate-600">Last known position and speed per truck. Visibility is role-restricted.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="px-3 py-2">Plate</th>
                <th className="px-3 py-2">Device</th>
                <th className="px-3 py-2">Position</th>
                <th className="px-3 py-2">Speed (kph)</th>
                <th className="px-3 py-2">Active trip</th>
                <th className="px-3 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {gpsRecords.map((record) => {
                const truck = byId(trucks, record.truckId);
                return (
                  <tr key={record.truckId} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-900">{truck?.plateNo}</td>
                    <td className="px-3 py-2">{truck?.gpsDeviceId}</td>
                    <td className="px-3 py-2">{record.lastKnownPosition}</td>
                    <td className="px-3 py-2">{record.speedKph}</td>
                    <td className="px-3 py-2">{record.tripNo ?? "—"}</td>
                    <td className="px-3 py-2 text-slate-500">{new Date(record.updatedAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
