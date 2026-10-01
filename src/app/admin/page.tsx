import { drivers, roles, trucks } from "@/lib/demo-data";

const roleDescriptions: Record<string, { label: string; ar: string; locationAccess: string }> = {
  CS: { label: "Customer Service", ar: "خدمة العملاء", locationAccess: "No GPS access" },
  DS: { label: "Dispatch", ar: "التوزيع", locationAccess: "Full GPS access" },
  ACC: { label: "Accounting", ar: "الحسابات", locationAccess: "No GPS access" },
  DRIVER: { label: "Driver", ar: "السائق", locationAccess: "Own truck only" },
  ADMIN: { label: "Admin", ar: "الإدارة", locationAccess: "Full GPS access" },
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold">Admin / الإدارة</h2>
        <p className="mt-1 text-sm text-slate-600">Roles, fleet, and driver roster for this MVP.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Roles & location-data access / الأدوار وصلاحيات الموقع</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Arabic</th>
                <th className="px-3 py-2">GPS / location access</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">{roleDescriptions[role].label} ({role})</td>
                  <td className="px-3 py-2">{roleDescriptions[role].ar}</td>
                  <td className="px-3 py-2">{roleDescriptions[role].locationAccess}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Fleet / الأسطول</h3>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="px-3 py-2">Plate</th>
                <th className="px-3 py-2">GPS device</th>
                <th className="px-3 py-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map((truck) => (
                <tr key={truck.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">{truck.plateNo}</td>
                  <td className="px-3 py-2">{truck.gpsDeviceId}</td>
                  <td className="px-3 py-2">{truck.active ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Drivers / السائقون</h3>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Phone</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">{driver.name}</td>
                  <td className="px-3 py-2">{driver.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
