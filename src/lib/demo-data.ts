import { Customer, Driver, GpsRecord, Role, Route, Trip, TripStatus, Truck } from "@/lib/types";

export const roles: Role[] = ["CS", "DS", "ACC", "DRIVER", "ADMIN"];

export const customers: Customer[] = [
  { id: "c1", name: "Red Sea Retail", arabicName: "تجزئة البحر الأحمر", freeDays: 2, haulageRateSar: 2200 },
  { id: "c2", name: "Gulf Industrial", arabicName: "الخليج الصناعية", freeDays: 1, haulageRateSar: 2450 },
  { id: "c3", name: "Najd Foods", arabicName: "أغذية نجد", freeDays: 3, haulageRateSar: 2100 },
];

export const routes: Route[] = [
  { id: "r1", name: "Jeddah → Riyadh", arabicName: "جدة ← الرياض", origin: "Jeddah", destination: "Riyadh" },
  { id: "r2", name: "Riyadh → Jeddah", arabicName: "الرياض ← جدة", origin: "Riyadh", destination: "Jeddah" },
];

export const trucks: Truck[] = [
  { id: "t1", plateNo: "JDH-3011", gpsDeviceId: "TM-3011", active: true },
  { id: "t2", plateNo: "JDH-3012", gpsDeviceId: "TM-3012", active: true },
  { id: "t3", plateNo: "JDH-3013", gpsDeviceId: "TM-3013", active: true },
  { id: "t4", plateNo: "JDH-3014", gpsDeviceId: "TM-3014", active: false },
];

export const drivers: Driver[] = [
  { id: "d1", name: "Sajid Rahman", phone: "+966500001001" },
  { id: "d2", name: "Ahmed Nasser", phone: "+966500001002" },
  { id: "d3", name: "Bilal Karim", phone: "+966500001003" },
];

export const trips: Trip[] = [
  {
    id: "trip-1",
    tripNo: "ELT-2026-001",
    status: "assigned",
    customerId: "c1",
    routeId: "r1",
    truckId: "t1",
    driverId: "d1",
    requestedDate: "2026-07-12",
    consignee: "Riyadh DC 4",
    containerNumbers: ["MSCU6639871"],
    waybillRef: "BAYAN-118220",
    statusHistory: [
      { status: "booking", at: "2026-07-12T07:40:00+03:00", by: "CS" },
      { status: "assigned", at: "2026-07-12T08:10:00+03:00", by: "DS" },
    ],
    documents: [
      { id: "doc-1", type: "EIR", lifecycleEvent: "pickup", uploadedBy: "DRIVER", uploadedAt: "2026-07-12T08:20:00+03:00", fileName: "eir-trip-1.jpg" },
    ],
    detentionEvents: [],
  },
  {
    id: "trip-2",
    tripNo: "ELT-2026-002",
    status: "delivered",
    customerId: "c2",
    routeId: "r1",
    truckId: "t2",
    driverId: "d2",
    requestedDate: "2026-07-11",
    consignee: "Sulay DC 2",
    containerNumbers: ["OOLU7215245"],
    waybillRef: "NAQL-220933",
    statusHistory: [
      { status: "booking", at: "2026-07-11T06:30:00+03:00", by: "CS" },
      { status: "assigned", at: "2026-07-11T07:10:00+03:00", by: "DS" },
      { status: "in_transit", at: "2026-07-11T11:25:00+03:00", by: "DS" },
      { status: "delivered", at: "2026-07-12T02:10:00+03:00", by: "DRIVER" },
    ],
    documents: [
      { id: "doc-2", type: "EIR", lifecycleEvent: "pickup", uploadedBy: "DRIVER", uploadedAt: "2026-07-11T07:20:00+03:00", fileName: "eir-trip-2.jpg" },
      { id: "doc-3", type: "POD", lifecycleEvent: "delivery", uploadedBy: "DRIVER", uploadedAt: "2026-07-12T02:12:00+03:00", fileName: "pod-trip-2.jpg" },
    ],
    detentionEvents: [
      { id: "det-1", locationType: "customer_site", locationLabel: "Sulay warehouse", startAt: "2026-07-11T20:00:00+03:00", endAt: "2026-07-11T23:30:00+03:00", billableHours: 2.5, billableAmountSar: 625 },
    ],
  },
  {
    id: "trip-3",
    tripNo: "ELT-2026-003",
    status: "ops_closed",
    customerId: "c3",
    routeId: "r2",
    truckId: "t3",
    driverId: "d3",
    requestedDate: "2026-07-09",
    consignee: "Jeddah cold store",
    containerNumbers: ["TEMU8344413", "MSKU7727616"],
    waybillRef: "BAYAN-118111",
    statusHistory: [
      { status: "booking", at: "2026-07-09T08:00:00+03:00", by: "CS" },
      { status: "assigned", at: "2026-07-09T08:50:00+03:00", by: "DS" },
      { status: "in_transit", at: "2026-07-09T14:20:00+03:00", by: "DS" },
      { status: "delivered", at: "2026-07-10T03:05:00+03:00", by: "DRIVER" },
      { status: "ops_closed", at: "2026-07-10T13:30:00+03:00", by: "ACC" },
    ],
    documents: [
      { id: "doc-4", type: "EIR", lifecycleEvent: "pickup", uploadedBy: "DRIVER", uploadedAt: "2026-07-09T09:00:00+03:00", fileName: "eir-trip-3.pdf" },
      { id: "doc-5", type: "POD", lifecycleEvent: "delivery", uploadedBy: "DRIVER", uploadedAt: "2026-07-10T03:10:00+03:00", fileName: "pod-trip-3.jpg" },
      { id: "doc-6", type: "WAYBILL", lifecycleEvent: "dispatch", uploadedBy: "DS", uploadedAt: "2026-07-09T08:55:00+03:00", fileName: "naql-trip-3.pdf" },
    ],
    detentionEvents: [
      { id: "det-2", locationType: "port", locationLabel: "Jeddah Islamic Port", startAt: "2026-07-09T10:30:00+03:00", endAt: "2026-07-09T13:00:00+03:00", billableHours: 1.5, billableAmountSar: 375 },
    ],
    invoice: {
      id: "inv-3",
      draftNo: "DRAFT-2026-003",
      certifiedInvoiceRef: "",
      lines: [
        { id: "line-1", description: "Haulage charge", amountSar: 2100 },
        { id: "line-2", description: "Detention - Jeddah Islamic Port", amountSar: 375 },
      ],
    },
  },
];

export const gpsRecords: GpsRecord[] = [
  { truckId: "t1", lastKnownPosition: "Jeddah Port Gate 4", speedKph: 0, updatedAt: "2026-07-12T08:22:00+03:00", tripNo: "ELT-2026-001" },
  { truckId: "t2", lastKnownPosition: "Riyadh Eastern Ring", speedKph: 68, updatedAt: "2026-07-12T07:58:00+03:00", tripNo: "ELT-2026-002" },
  { truckId: "t3", lastKnownPosition: "Jeddah Logistics Park", speedKph: 12, updatedAt: "2026-07-12T07:45:00+03:00", tripNo: undefined },
  { truckId: "t4", lastKnownPosition: "Workshop", speedKph: 0, updatedAt: "2026-07-12T06:40:00+03:00", tripNo: undefined },
];

export const statusOrder: TripStatus[] = ["booking", "assigned", "in_transit", "delivered", "ops_closed", "paid_closed"];

export const statusLabel: Record<TripStatus, string> = {
  booking: "Booking / حجز",
  assigned: "Assigned / تم التعيين",
  in_transit: "In transit / أثناء النقل",
  delivered: "Delivered / تم التسليم",
  ops_closed: "Ops closed / إغلاق تشغيلي",
  paid_closed: "Paid closed / إغلاق مالي",
};

export function byId<T extends { id: string }>(items: T[], id?: string) {
  return items.find((item) => item.id === id);
}

export function getTripMetrics() {
  const byStatus = statusOrder.map((status) => ({
    status,
    count: trips.filter((trip) => trip.status === status).length,
  }));
  const billableDetention = trips.flatMap((trip) => trip.detentionEvents).reduce((sum, item) => sum + item.billableAmountSar, 0);
  const opsClosedPendingPayment = trips.filter((trip) => trip.status === "ops_closed").length;
  return {
    tripsToday: trips.filter((trip) => trip.requestedDate === "2026-07-12").length,
    byStatus,
    billableDetention,
    opsClosedPendingPayment,
    fleetUtilization: Math.round((trips.filter((trip) => trip.truckId).length / trucks.filter((truck) => truck.active).length) * 100),
  };
}
