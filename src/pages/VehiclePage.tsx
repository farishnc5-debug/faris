import { useTranslation } from "react-i18next";
import { useObdStore } from "../store/obdStore";

function Row({ label, value }: { label: string; value: string | number | undefined }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ color: "var(--text-dim)" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value ?? t("vehicle.unknown")}</span>
    </div>
  );
}

export default function VehiclePage() {
  const { t } = useTranslation();
  const { status, vehicle } = useObdStore();

  if (status !== "connected" && status !== "reading-vin") {
    return (
      <div className="card">
        <p>{t("vehicle.notConnected")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>{t("vehicle.heading")}</h2>
        {vehicle?.source === "offline" && <div className="alert alert-warning">{t("vehicle.offlineNotice")}</div>}
        {!vehicle && status === "reading-vin" && <p>{t("connect.readingVehicle")}</p>}
        {vehicle && (
          <div>
            <Row label={t("vehicle.vin")} value={vehicle.vin} />
            <Row label={t("vehicle.make")} value={vehicle.make} />
            <Row label={t("vehicle.model")} value={vehicle.model} />
            <Row label={t("vehicle.year")} value={vehicle.modelYear} />
            <Row label={t("vehicle.trim")} value={vehicle.trim} />
            <Row label={t("vehicle.engine")} value={vehicle.engine} />
            <Row label={t("vehicle.fuelType")} value={vehicle.fuelType} />
            <Row label={t("vehicle.bodyClass")} value={vehicle.bodyClass} />
          </div>
        )}
      </div>
    </div>
  );
}
