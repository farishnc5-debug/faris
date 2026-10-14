import { BaseElmTransport, ObdError } from "./transport";

// Known BLE UART-style service/characteristic UUIDs used by common ELM327
// clone adapters (Vgate, Vlinker, generic "OBD BLE" dongles, Nordic UART
// based boards). We don't know in advance which one a given dongle uses, so
// we ask the browser for any of these services and then probe the device's
// GATT services for a notify+write characteristic pair.
const CANDIDATE_SERVICES = [
  "0000fff0-0000-1000-8000-00805f9b34fb", // generic OBD BLE
  "0000ffe0-0000-1000-8000-00805f9b34fb", // HM-10 style UART
  "6e400001-b5a3-f393-e0a9-e50e24dcca9e", // Nordic UART Service
  "e7810a71-73ae-499d-8c15-faa9aef0c3f2", // Vlinker / iCar Pro
];

export class BluetoothObdTransport extends BaseElmTransport {
  readonly kind = "bluetooth" as const;
  private device: BluetoothDevice | null = null;
  private writeChar: BluetoothRemoteGATTCharacteristic | null = null;
  private notifyChar: BluetoothRemoteGATTCharacteristic | null = null;

  get label(): string {
    return this.device?.name ?? "Bluetooth OBD2 adapter";
  }

  async connect(): Promise<void> {
    if (!navigator.bluetooth) {
      throw new ObdError("Web Bluetooth is not available in this browser.");
    }

    this.device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: CANDIDATE_SERVICES,
    });

    this.device.addEventListener("gattserverdisconnected", () => {
      this.setConnected(false);
    });

    const server = await this.device.gatt?.connect();
    if (!server) throw new ObdError("Could not open a GATT connection to the adapter.");

    let found = false;
    for (const serviceUuid of CANDIDATE_SERVICES) {
      try {
        const service = await server.getPrimaryService(serviceUuid);
        const characteristics = await service.getCharacteristics();
        const writable = characteristics.find((c) => c.properties.write || c.properties.writeWithoutResponse);
        const notifiable = characteristics.find((c) => c.properties.notify);
        if (writable && notifiable) {
          this.writeChar = writable;
          this.notifyChar = notifiable;
          await notifiable.startNotifications();
          notifiable.addEventListener("characteristicvaluechanged", (ev) => {
            const target = ev.target as BluetoothRemoteGATTCharacteristic;
            const value = target.value;
            if (!value) return;
            this.onData(new TextDecoder().decode(value));
          });
          found = true;
          break;
        }
      } catch {
        // This service isn't present on this device; try the next candidate.
      }
    }

    if (!found) {
      throw new ObdError(
        "Could not find a compatible OBD2 service on this Bluetooth device. Some adapters only support classic Bluetooth SPP, which browsers cannot use directly — try a BLE-capable adapter or a USB adapter instead."
      );
    }

    this.setConnected(true);
  }

  async disconnect(): Promise<void> {
    try {
      await this.notifyChar?.stopNotifications();
    } catch {
      /* ignore */
    }
    this.device?.gatt?.disconnect();
    this.setConnected(false);
  }

  protected async writeRaw(data: string): Promise<void> {
    if (!this.writeChar) throw new ObdError("Not connected");
    const bytes = new TextEncoder().encode(data);
    if (this.writeChar.properties.writeWithoutResponse) {
      await this.writeChar.writeValueWithoutResponse(bytes);
    } else {
      await this.writeChar.writeValueWithResponse(bytes);
    }
  }
}
