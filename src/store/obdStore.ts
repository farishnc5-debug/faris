import { create } from "zustand";
import { ElmClient } from "../obd/elmClient";
import { BluetoothObdTransport } from "../obd/bluetoothTransport";
import { SerialObdTransport } from "../obd/serialTransport";
import { readVin } from "../obd/vin";
import { lookupVehicleByVin, type VehicleInfo } from "../obd/vinLookup";

export type ConnectionStatus = "disconnected" | "connecting" | "reading-vin" | "connected" | "error";

interface ObdState {
  status: ConnectionStatus;
  errorMessage: string | null;
  client: ElmClient | null;
  vehicle: VehicleInfo | null;
  connectBluetooth: () => Promise<void>;
  connectSerial: () => Promise<void>;
  disconnect: () => Promise<void>;
}

async function finishConnecting(client: ElmClient, set: (partial: Partial<ObdState>) => void) {
  set({ client, status: "connected" });
  set({ status: "reading-vin" });
  try {
    const vin = await readVin(client);
    const vehicle = await lookupVehicleByVin(vin);
    set({ vehicle, status: "connected" });
  } catch (err) {
    // VIN read can fail on some vehicles/adapters; the rest of the app
    // (DTCs, live data) still works without it.
    set({ vehicle: null, status: "connected" });
    console.warn("VIN read failed:", err);
  }
}

export const useObdStore = create<ObdState>((set, get) => ({
  status: "disconnected",
  errorMessage: null,
  client: null,
  vehicle: null,

  connectBluetooth: async () => {
    set({ status: "connecting", errorMessage: null });
    try {
      const transport = new BluetoothObdTransport();
      const client = new ElmClient(transport);
      await client.connect();
      await finishConnecting(client, set);
    } catch (err) {
      set({ status: "error", errorMessage: err instanceof Error ? err.message : String(err) });
    }
  },

  connectSerial: async () => {
    set({ status: "connecting", errorMessage: null });
    try {
      const transport = new SerialObdTransport();
      const client = new ElmClient(transport);
      await client.connect();
      await finishConnecting(client, set);
    } catch (err) {
      set({ status: "error", errorMessage: err instanceof Error ? err.message : String(err) });
    }
  },

  disconnect: async () => {
    const { client } = get();
    await client?.disconnect();
    set({ status: "disconnected", client: null, vehicle: null, errorMessage: null });
  },
}));
