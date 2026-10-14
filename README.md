# OBD2 Scanner

A web app (installable as a PWA) for diagnosing and clearing your vehicle's
fault codes directly from a browser — no native app install required.
Connect an ELM327-compatible OBD2 adapter over **Bluetooth** or **USB**, and
the app automatically identifies your vehicle from its VIN, reads/clears
diagnostic trouble codes, and streams live sensor data — all in metric units,
in both **English and Arabic** (with full RTL layout).

## Features

- **Automatic vehicle detection** — no manual make/model entry. The app
  reads the VIN directly from the vehicle (Mode 09) and looks it up via
  NHTSA's free public vPIC decoder for make, model, year, trim, and engine.
- **Read & clear DTCs** — stored (Mode 03) and pending (Mode 07) diagnostic
  trouble codes, with bilingual descriptions for common codes, plus
  one-tap clearing (Mode 04) with a confirmation step.
- **Live sensor data** — RPM, speed, coolant/intake/ambient temperature,
  throttle position, engine load, intake pressure, MAF, fuel level, and
  battery voltage, polled in real time with live charts.
- **Fuel consumption** — estimated instantaneous consumption in L/100km and
  L/h, calculated from mass air flow and vehicle speed (metric, for Saudi
  Arabia / GCC use).
- **Works offline** — installable as a Progressive Web App; all state is
  stored locally in the browser (IndexedDB), no account or server required.
- **Bilingual** — full English/Arabic UI with automatic RTL layout mirroring.

## Connecting to your vehicle

1. Plug a Bluetooth or USB ELM327-compatible OBD2 adapter into your
   vehicle's OBD2 port (usually under the dashboard, near the steering
   column).
2. Turn the ignition to the "on" position (engine doesn't need to be
   running for most functions).
3. Open the app and tap **Connect via Bluetooth** or **Connect via USB**.

**Browser support:**
- Bluetooth adapters need **Web Bluetooth** — supported in Chrome/Edge on
  desktop and Android. Not supported in Safari/iOS (Apple restriction).
- USB adapters need **Web Serial** — supported in Chrome/Edge on desktop
  only.

## What this app does *not* do

This app reads and clears standard OBD2 diagnostic data — the same
capability built into every consumer scan tool. It does **not** perform
ECU/chipset reflashing or reprogramming. Reflashing a vehicle's ECU requires
manufacturer-specific, security-gated protocols (typically a J2534
pass-thru device and dealer-level access) and carries real risk of bricking
the vehicle or violating emissions compliance — it isn't something a
general-purpose web app can safely or reliably do across arbitrary makes
and models.

## Development

```sh
npm install
npm run dev      # start the dev server
npm run build    # production build (also runs the TypeScript compiler)
npm run preview  # preview the production build locally
```

### Project structure

- `src/obd/` — OBD2 protocol layer: Bluetooth/Serial transports, ELM327
  client, PID decoding, DTC parsing, VIN decode/lookup.
- `src/store/` — Zustand store for connection + vehicle state.
- `src/db/` — IndexedDB-backed scan history.
- `src/i18n/` — English/Arabic translation resources.
- `src/pages/` — Connect, Vehicle info, Fault codes, Live data screens.

## Disclaimer

This tool reads and clears diagnostic data from your vehicle's OBD2 port.
Clearing fault codes before identifying and fixing the underlying issue can
make a problem harder to diagnose later and does not fix the problem
itself. Use at your own risk.
