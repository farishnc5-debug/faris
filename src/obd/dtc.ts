import { parseHexBytes } from "./pids";
import type { ElmClient } from "./elmClient";

export type DtcCategory = "P" | "C" | "B" | "U";

export interface DtcCode {
  code: string; // e.g. "P0301"
  raw: string;
}

const CATEGORY_MAP: Record<number, DtcCategory> = {
  0b00: "P",
  0b01: "C",
  0b10: "B",
  0b11: "U",
};

/** Decodes two DTC bytes (per SAE J2012) into a code like "P0301". */
function decodeDtcBytes(a: number, b: number): string | null {
  if (a === 0 && b === 0) return null;
  const category = CATEGORY_MAP[(a >> 6) & 0b11];
  const digit1 = (a >> 4) & 0b11;
  const digit2 = a & 0x0f;
  const digit3 = (b >> 4) & 0x0f;
  const digit4 = b & 0x0f;
  return `${category}${digit1}${digit2.toString(16).toUpperCase()}${digit3.toString(16).toUpperCase()}${digit4
    .toString(16)
    .toUpperCase()}`;
}

function parseDtcResponse(response: string): DtcCode[] {
  const bytes = parseHexBytes(response);
  // Strip leading service-response byte (43 for mode 03, 47 for mode 07) and
  // an optional count byte that some adapters prepend.
  let start = 0;
  if (bytes[0] === 0x43 || bytes[0] === 0x47) start = 1;

  const codes: DtcCode[] = [];
  for (let i = start; i + 1 < bytes.length; i += 2) {
    const code = decodeDtcBytes(bytes[i], bytes[i + 1]);
    if (code) codes.push({ code, raw: `${bytes[i].toString(16)}${bytes[i + 1].toString(16)}` });
  }
  return codes;
}

/** Mode 03: read confirmed (stored) DTCs. */
export async function readStoredDtcs(client: ElmClient): Promise<DtcCode[]> {
  const response = await client.query("03");
  return parseDtcResponse(response);
}

/** Mode 07: read pending DTCs. */
export async function readPendingDtcs(client: ElmClient): Promise<DtcCode[]> {
  const response = await client.query("07");
  return parseDtcResponse(response);
}

/** Mode 04: clear all stored/pending DTCs and reset the MIL. */
export async function clearDtcs(client: ElmClient): Promise<void> {
  const response = await client.query("04");
  if (!/44/i.test(response) && !/OK/i.test(response)) {
    throw new Error(`Unexpected response clearing codes: ${response}`);
  }
}
