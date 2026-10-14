import { decodeVinStructure } from "./vin";

export interface VehicleInfo {
  vin: string;
  make?: string;
  model?: string;
  modelYear?: number;
  trim?: string;
  engine?: string;
  fuelType?: string;
  bodyClass?: string;
  source: "nhtsa" | "offline";
}

/**
 * Looks up full make/model/trim details for a VIN using NHTSA's free,
 * public vPIC decoder (no API key, CORS enabled). This is what makes the
 * "no manual make/model setup" flow possible. Falls back to a rough
 * offline structural decode if the network is unavailable.
 */
export async function lookupVehicleByVin(vin: string): Promise<VehicleInfo> {
  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`NHTSA lookup failed: ${res.status}`);
    const json = await res.json();
    const row = json?.Results?.[0];
    if (!row) throw new Error("No decode result returned");

    return {
      vin,
      make: row.Make || undefined,
      model: row.Model || undefined,
      modelYear: row.ModelYear ? Number(row.ModelYear) : undefined,
      trim: row.Trim || undefined,
      engine: [row.EngineCylinders && `${row.EngineCylinders}-cyl`, row.DisplacementL && `${row.DisplacementL}L`]
        .filter(Boolean)
        .join(" "),
      fuelType: row.FuelTypePrimary || undefined,
      bodyClass: row.BodyClass || undefined,
      source: "nhtsa",
    };
  } catch {
    const structural = decodeVinStructure(vin);
    return {
      vin,
      modelYear: structural.modelYear,
      source: "offline",
    };
  }
}
