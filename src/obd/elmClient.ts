import type { ObdTransport } from "./transport";
import { ObdError } from "./transport";

/** High level ELM327 client: handles AT initialization and raw OBD queries. */
export class ElmClient {
  private transport: ObdTransport;

  constructor(transport: ObdTransport) {
    this.transport = transport;
  }

  get label() {
    return this.transport.label;
  }

  get kind() {
    return this.transport.kind;
  }

  isConnected() {
    return this.transport.isConnected();
  }

  async connect() {
    await this.transport.connect();
    await this.initialize();
  }

  async disconnect() {
    await this.transport.disconnect();
  }

  private async at(command: string): Promise<string> {
    return this.transport.sendCommand(command, 3000);
  }

  private async initialize() {
    // Reset, then configure for clean machine-readable responses.
    await this.at("ATZ").catch(() => "");
    await this.at("ATE0"); // echo off
    await this.at("ATL0"); // linefeeds off
    await this.at("ATS0"); // spaces off
    await this.at("ATH0"); // headers off
    await this.at("ATSP0"); // auto-detect protocol
  }

  /** Send a raw OBD-II request, e.g. "0100", "03", "0902". */
  async query(pidHex: string, timeoutMs = 4000): Promise<string> {
    const response = await this.transport.sendCommand(pidHex, timeoutMs);
    if (/NO DATA/i.test(response)) throw new ObdError("NO DATA");
    if (/UNABLE TO CONNECT/i.test(response)) {
      throw new ObdError("Unable to connect to the vehicle's ECU. Check the connection and that the ignition is on.");
    }
    if (/ERROR/i.test(response)) throw new ObdError(`Adapter error: ${response}`);
    return response;
  }
}
