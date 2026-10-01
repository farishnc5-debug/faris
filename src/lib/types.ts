export type Role = "CS" | "DS" | "ACC" | "DRIVER" | "ADMIN";

export type TripStatus = "booking" | "assigned" | "in_transit" | "delivered" | "ops_closed" | "paid_closed";

export interface Customer {
  id: string;
  name: string;
  arabicName: string;
  freeDays: number;
  haulageRateSar: number;
}

export interface Route {
  id: string;
  name: string;
  arabicName: string;
  origin: string;
  destination: string;
}

export interface Truck {
  id: string;
  plateNo: string;
  gpsDeviceId: string;
  active: boolean;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
}

export interface StatusHistoryEntry {
  status: TripStatus;
  at: string;
  by: Role;
}

export type DocumentType = "EIR" | "POD" | "WAYBILL";

export interface TripDocument {
  id: string;
  type: DocumentType;
  lifecycleEvent: string;
  uploadedBy: Role;
  uploadedAt: string;
  fileName: string;
}

export type DetentionLocationType = "customer_site" | "port";

export interface DetentionEvent {
  id: string;
  locationType: DetentionLocationType;
  locationLabel: string;
  startAt: string;
  endAt: string;
  billableHours: number;
  billableAmountSar: number;
}

export interface InvoiceLine {
  id: string;
  description: string;
  amountSar: number;
}

export interface Invoice {
  id: string;
  draftNo: string;
  certifiedInvoiceRef: string;
  lines: InvoiceLine[];
}

export interface Trip {
  id: string;
  tripNo: string;
  status: TripStatus;
  customerId: string;
  routeId: string;
  truckId: string;
  driverId: string;
  requestedDate: string;
  consignee: string;
  containerNumbers: string[];
  waybillRef: string;
  statusHistory: StatusHistoryEntry[];
  documents: TripDocument[];
  detentionEvents: DetentionEvent[];
  invoice?: Invoice;
}

export interface GpsRecord {
  truckId: string;
  lastKnownPosition: string;
  speedKph: number;
  updatedAt: string;
  tripNo?: string;
}
