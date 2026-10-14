import { openDB, type IDBPDatabase } from "idb";
import type { DtcCode } from "../obd/dtc";

export interface ScanRecord {
  id?: number;
  timestamp: number;
  vin?: string;
  storedCodes: DtcCode[];
  pendingCodes: DtcCode[];
  cleared: boolean;
}

const DB_NAME = "obd-scanner";
const STORE_NAME = "scans";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        store.createIndex("timestamp", "timestamp");
      },
    });
  }
  return dbPromise;
}

export async function saveScanRecord(record: Omit<ScanRecord, "id">): Promise<void> {
  const db = await getDb();
  await db.add(STORE_NAME, record);
}

export async function getScanHistory(limit = 20): Promise<ScanRecord[]> {
  const db = await getDb();
  const all = await db.getAllFromIndex(STORE_NAME, "timestamp");
  return all.reverse().slice(0, limit);
}
