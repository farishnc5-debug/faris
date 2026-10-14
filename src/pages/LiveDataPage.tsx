import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useObdStore } from "../store/obdStore";
import { decodePid, estimateFuelConsumptionLper100km, estimateInstantFuelLperHour } from "../obd/pids";

const POLLED_PIDS = ["0C", "0D", "05", "0F", "11", "04", "0B", "10", "2F", "42", "46"];
const HISTORY_LENGTH = 60;

interface Reading {
  value: number;
  unit: string;
}

export default function LiveDataPage() {
  const { t } = useTranslation();
  const { status, client } = useObdStore();
  const connected = status === "connected" || status === "reading-vin";

  const [running, setRunning] = useState(false);
  const [readings, setReadings] = useState<Record<string, Reading>>({});
  const [speedHistory, setSpeedHistory] = useState<{ t: number; v: number }[]>([]);
  const [rpmHistory, setRpmHistory] = useState<{ t: number; v: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const tickRef = useRef(0);
  const stopRef = useRef(false);

  useEffect(() => {
    if (!running || !client) return;
    stopRef.current = false;

    async function pollLoop() {
      while (!stopRef.current) {
        for (const pid of POLLED_PIDS) {
          if (stopRef.current) break;
          try {
            const response = await client!.query("01" + pid, 2000);
            const decoded = decodePid(pid, response);
            if (decoded) {
              setReadings((prev) => ({ ...prev, [pid]: { value: decoded.value, unit: decoded.unit } }));
              if (pid === "0D") {
                tickRef.current += 1;
                setSpeedHistory((prev) => [...prev.slice(-HISTORY_LENGTH + 1), { t: tickRef.current, v: decoded.value }]);
              }
              if (pid === "0C") {
                setRpmHistory((prev) => [...prev.slice(-HISTORY_LENGTH + 1), { t: tickRef.current, v: decoded.value }]);
              }
            }
          } catch {
            // Not every PID is supported by every vehicle; skip silently.
          }
        }
      }
    }

    pollLoop();
    return () => {
      stopRef.current = true;
    };
  }, [running, client]);

  function toggle() {
    if (running) {
      stopRef.current = true;
      setRunning(false);
    } else {
      setError(null);
      setRunning(true);
    }
  }

  if (!connected) {
    return (
      <div className="card">
        <p>{t("vehicle.notConnected")}</p>
      </div>
    );
  }

  const maf = readings["10"]?.value;
  const speed = readings["0D"]?.value;
  const fuelLper100km = maf !== undefined && speed !== undefined ? estimateFuelConsumptionLper100km(maf, speed) : null;
  const fuelLperHour = maf !== undefined ? estimateInstantFuelLperHour(maf) : null;

  const tiles: { key: string; reading?: Reading }[] = [
    { key: "rpm", reading: readings["0C"] },
    { key: "speed", reading: readings["0D"] },
    { key: "coolantTemp", reading: readings["05"] },
    { key: "intakeTemp", reading: readings["0F"] },
    { key: "throttle", reading: readings["11"] },
    { key: "engineLoad", reading: readings["04"] },
    { key: "intakePressure", reading: readings["0B"] },
    { key: "maf", reading: readings["10"] },
    { key: "fuelLevel", reading: readings["2F"] },
    { key: "batteryVoltage", reading: readings["42"] },
    { key: "ambientTemp", reading: readings["46"] },
  ];

  return (
    <div>
      <div className="card">
        <h2>{t("liveData.heading")}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <button className={`btn ${running ? "btn-danger" : "btn-primary"}`} onClick={toggle}>
          {running ? t("liveData.stop") : t("liveData.start")}
        </button>
      </div>

      {running && (
        <>
          <div className="card">
            <h2>{t("liveData.fuelConsumption")}</h2>
            <div className="data-grid">
              <div className="data-tile">
                <div className="label">{t("liveData.fuelConsumptionUnit")}</div>
                <div className="value">
                  {fuelLper100km !== null && isFinite(fuelLper100km) ? fuelLper100km.toFixed(1) : "—"}
                </div>
              </div>
              <div className="data-tile">
                <div className="label">{t("liveData.fuelRateUnit")}</div>
                <div className="value">{fuelLperHour !== null ? fuelLperHour.toFixed(2) : "—"}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>{t("liveData.speed")} / {t("liveData.rpm")}</h2>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={speedHistory.map((s, i) => ({ t: s.t, speed: s.v, rpm: rpmHistory[i]?.v }))}>
                <XAxis dataKey="t" hide />
                <YAxis yAxisId="left" width={30} />
                <YAxis yAxisId="right" orientation="right" width={30} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#35c2a0" dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="rpm" stroke="#e5a93a" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="data-grid">
              {tiles.map(({ key, reading }) => (
                <div className="data-tile" key={key}>
                  <div className="label">{t(`liveData.${key}`)}</div>
                  <div className="value">
                    {reading ? reading.value.toFixed(reading.unit === "rpm" ? 0 : 1) : "—"}
                    {reading && <span className="unit">{reading.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
