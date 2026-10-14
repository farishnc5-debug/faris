import { parseHexBytes } from "./pids";
import type { ElmClient } from "./elmClient";

/** Mode 09 PID 02: request the vehicle's VIN. */
export async function readVin(client: ElmClient): Promise<string> {
  const response = await client.query("0902");
  const bytes = parseHexBytes(response);

  // Response is a sequence of "49 02 <frame#> <chars...>" lines (multi-frame
  // ISO-TP already reassembled by the ELM327). Strip 49 02 and any
  // single-byte frame index that precedes each group of ASCII chars.
  const chars: number[] = [];
  let i = 0;
  while (i < bytes.length) {
    if (bytes[i] === 0x49 && bytes[i + 1] === 0x02) {
      i += 2;
      // Some adapters include a frame/sequence byte here; it is never a
      // printable VIN character (VINs are uppercase letters/digits).
      if (bytes[i] !== undefined && bytes[i] < 0x20) i += 1;
      continue;
    }
    chars.push(bytes[i]);
    i += 1;
  }

  const vin = chars
    .map((b) => String.fromCharCode(b))
    .join("")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase();

  if (vin.length !== 17) {
    throw new Error(`Could not read a valid 17-character VIN (got "${vin}").`);
  }
  return vin;
}

const WORLD_MANUFACTURERS: Record<string, { makeKey: string; region: string }> = {
  "1": { makeKey: "vin.region.us", region: "United States" },
  "4": { makeKey: "vin.region.us", region: "United States" },
  "5": { makeKey: "vin.region.us", region: "United States" },
  "2": { makeKey: "vin.region.ca", region: "Canada" },
  "3": { makeKey: "vin.region.mx", region: "Mexico" },
  J: { makeKey: "vin.region.jp", region: "Japan" },
  K: { makeKey: "vin.region.kr", region: "South Korea" },
  L: { makeKey: "vin.region.cn", region: "China" },
  S: { makeKey: "vin.region.uk", region: "United Kingdom" },
  W: { makeKey: "vin.region.de", region: "Germany" },
  Y: { makeKey: "vin.region.se", region: "Sweden" },
  Z: { makeKey: "vin.region.it", region: "Italy" },
  "6": { makeKey: "vin.region.au", region: "Australia" },
  R: { makeKey: "vin.region.sa", region: "Saudi Arabia / GCC" },
};

const MODEL_YEAR_CODES: Record<string, number> = (() => {
  const chars = "ABCDEFGHJKLMNPRSTVWXY123456789";
  const map: Record<string, number> = {};
  // Two 30-year cycles covering 1980-2039; the 17th WMI/VIN digit (position
  // 7) disambiguates which cycle, which we don't attempt here, so we report
  // the most recent plausible year.
  let year = 2010;
  for (const ch of chars) {
    map[ch] = year;
    year += 1;
  }
  return map;
})();

export interface DecodedVin {
  vin: string;
  wmi: string;
  region?: string;
  modelYear?: number;
  serial: string;
}

/** Best-effort structural decode of a VIN without needing a network lookup. */
export function decodeVinStructure(vin: string): DecodedVin {
  const wmi = vin.slice(0, 3);
  const regionInfo = WORLD_MANUFACTURERS[vin[0]];
  const yearChar = vin[9];
  return {
    vin,
    wmi,
    region: regionInfo?.region,
    modelYear: MODEL_YEAR_CODES[yearChar],
    serial: vin.slice(11),
  };
}
