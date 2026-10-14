import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useObdStore } from "../store/obdStore";

export default function ConnectPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { status, errorMessage, vehicle, connectBluetooth, connectSerial, disconnect } = useObdStore();

  const bluetoothSupported = typeof navigator !== "undefined" && "bluetooth" in navigator;
  const serialSupported = typeof navigator !== "undefined" && "serial" in navigator;
  const busy = status === "connecting" || status === "reading-vin";

  useEffect(() => {
    if (status === "connected" && vehicle) {
      navigate("/vehicle");
    }
  }, [status, vehicle, navigate]);

  return (
    <div>
      <div className="card">
        <h2>{t("connect.heading")}</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14 }}>{t("connect.description")}</p>

        {status === "error" && errorMessage && (
          <div className="alert alert-error">{t("connect.error", { message: errorMessage })}</div>
        )}

        {status === "connected" && (
          <div className="alert alert-info">{t("connect.connected", { label: useObdStore.getState().client?.label ?? "" })}</div>
        )}

        {status === "reading-vin" && <div className="alert alert-info">{t("connect.readingVehicle")}</div>}

        {status !== "connected" && status !== "reading-vin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            <button className="btn btn-primary" disabled={!bluetoothSupported || busy} onClick={connectBluetooth}>
              {busy ? t("connect.connecting") : t("connect.bluetooth")}
            </button>
            {!bluetoothSupported && <small style={{ color: "var(--text-dim)" }}>{t("connect.notSupportedBluetooth")}</small>}

            <button className="btn" disabled={!serialSupported || busy} onClick={connectSerial}>
              {busy ? t("connect.connecting") : t("connect.usb")}
            </button>
            {!serialSupported && <small style={{ color: "var(--text-dim)" }}>{t("connect.notSupportedSerial")}</small>}
          </div>
        )}

        {status === "connected" && (
          <button className="btn" style={{ marginTop: 12 }} onClick={disconnect}>
            {t("connect.disconnect")}
          </button>
        )}
      </div>
    </div>
  );
}
