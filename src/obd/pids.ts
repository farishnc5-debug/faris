// Standard SAE J1979 Mode 01 PID decoders. All outputs are metric.

export interface LiveReading {
  pid: string;
  nameKey: string; // i18n key
  value: number;
  unit: string;
}

/** Parses a multi-line hex response like "41 0C 1A F8" into a flat byte array. */
export function parseHexBytes(response: string): number[] {
  const hex = response
    .split("\n")
    .map((line) => line.replace(/^[0-9A-Fa-f]+:/, "").trim()) // strip CAN line-number prefixes
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter((tok) => /^[0-9A-Fa-f]{2}$/.test(tok));
  return hex.map((h) => parseInt(h, 16));
}

/** Strips the "41 XX" service+pid echo from a Mode01 response, returning data bytes. */
function dataBytes(response: string, pid: string): number[] {
  const bytes = parseHexBytes(response);
  const pidByte = parseInt(pid, 16);
  const idx = bytes.findIndex((b, i) => b === 0x41 && bytes[i + 1] === pidByte);
  if (idx === -1) return bytes;
  return bytes.slice(idx + 2);
}

export interface PidDefinition {
  pid: string; // e.g. "0C"
  nameKey: string;
  unit: string;
  minBytes: number;
  decode: (data: number[]) => number;
}

export const PIDS: Record<string, PidDefinition> = {
  // Engine RPM
  "0C": {
    pid: "0C",
    nameKey: "liveData.rpm",
    unit: "rpm",
    minBytes: 2,
    decode: ([a, b]) => (a * 256 + b) / 4,
  },
  // Vehicle speed, already km/h per spec
  "0D": {
    pid: "0D",
    nameKey: "liveData.speed",
    unit: "km/h",
    minBytes: 1,
    decode: ([a]) => a,
  },
  // Coolant temperature, degC
  "05": {
    pid: "05",
    nameKey: "liveData.coolantTemp",
    unit: "°C",
    minBytes: 1,
    decode: ([a]) => a - 40,
  },
  // Intake air temperature, degC
  "0F": {
    pid: "0F",
    nameKey: "liveData.intakeTemp",
    unit: "°C",
    minBytes: 1,
    decode: ([a]) => a - 40,
  },
  // Throttle position, %
  "11": {
    pid: "11",
    nameKey: "liveData.throttle",
    unit: "%",
    minBytes: 1,
    decode: ([a]) => (a * 100) / 255,
  },
  // Engine load, %
  "04": {
    pid: "04",
    nameKey: "liveData.engineLoad",
    unit: "%",
    minBytes: 1,
    decode: ([a]) => (a * 100) / 255,
  },
  // Intake manifold pressure, kPa
  "0B": {
    pid: "0B",
    nameKey: "liveData.intakePressure",
    unit: "kPa",
    minBytes: 1,
    decode: ([a]) => a,
  },
  // MAF air flow rate, grams/sec
  "10": {
    pid: "10",
    nameKey: "liveData.maf",
    unit: "g/s",
    minBytes: 2,
    decode: ([a, b]) => (a * 256 + b) / 100,
  },
  // Fuel level, %
  "2F": {
    pid: "2F",
    nameKey: "liveData.fuelLevel",
    unit: "%",
    minBytes: 1,
    decode: ([a]) => (a * 100) / 255,
  },
  // Control module voltage
  "42": {
    pid: "42",
    nameKey: "liveData.batteryVoltage",
    unit: "V",
    minBytes: 2,
    decode: ([a, b]) => (a * 256 + b) / 1000,
  },
  // Ambient air temperature
  "46": {
    pid: "46",
    nameKey: "liveData.ambientTemp",
    unit: "°C",
    minBytes: 1,
    decode: ([a]) => a - 40,
  },
};

export function decodePid(pid: string, response: string): LiveReading | null {
  const def = PIDS[pid.toUpperCase()];
  if (!def) return null;
  const data = dataBytes(response, pid);
  if (data.length < def.minBytes) return null;
  return {
    pid: def.pid,
    nameKey: def.nameKey,
    unit: def.unit,
    value: def.decode(data),
  };
}

/**
 * Estimates instantaneous fuel consumption in L/100km from MAF (g/s) and
 * vehicle speed (km/h), assuming gasoline (stoichiometric AFR ~14.7:1,
 * density ~0.745 kg/L). This is the same approach used by most consumer
 * OBD2 scan tools and is an approximation, not a certified measurement.
 */
export function estimateFuelConsumptionLper100km(mafGramsPerSec: number, speedKmh: number): number | null {
  if (speedKmh <= 0) return null;
  const AFR = 14.7;
  const FUEL_DENSITY_G_PER_L = 745; // gasoline, approx
  const fuelGramsPerSec = mafGramsPerSec / AFR;
  const fuelLitersPerHour = (fuelGramsPerSec / FUEL_DENSITY_G_PER_L) * 3600;
  const litersPer100km = (fuelLitersPerHour / speedKmh) * 100;
  return litersPer100km;
}

export function estimateInstantFuelLperHour(mafGramsPerSec: number): number {
  const AFR = 14.7;
  const FUEL_DENSITY_G_PER_L = 745;
  const fuelGramsPerSec = mafGramsPerSec / AFR;
  return (fuelGramsPerSec / FUEL_DENSITY_G_PER_L) * 3600;
}
