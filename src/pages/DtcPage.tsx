import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useObdStore } from "../store/obdStore";
import { readStoredDtcs, readPendingDtcs, clearDtcs, type DtcCode } from "../obd/dtc";
import { describeDtc } from "../obd/dtcDescriptions";
import { saveScanRecord } from "../db/scanHistory";

function DtcList({ codes, locale, emptyKey }: { codes: DtcCode[]; locale: "en" | "ar"; emptyKey: string }) {
  const { t } = useTranslation();
  if (codes.length === 0) {
    return <p style={{ color: "var(--text-dim)", fontSize: 14 }}>{t(emptyKey)}</p>;
  }
  return (
    <div>
      {codes.map((c) => (
        <div className="dtc-row" key={c.code}>
          <span className="dtc-code">{c.code}</span>
          <span className="dtc-desc">{describeDtc(c.code, locale)}</span>
        </div>
      ))}
    </div>
  );
}

export default function DtcPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("ar") ? "ar" : "en";
  const { status, client, vehicle } = useObdStore();
  const connected = status === "connected" || status === "reading-vin";

  const [scanning, setScanning] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stored, setStored] = useState<DtcCode[] | null>(null);
  const [pending, setPending] = useState<DtcCode[] | null>(null);
  const [cleared, setCleared] = useState(false);

  async function scan() {
    if (!client) return;
    setScanning(true);
    setError(null);
    setCleared(false);
    try {
      const [storedCodes, pendingCodes] = await Promise.all([readStoredDtcs(client), readPendingDtcs(client)]);
      setStored(storedCodes);
      setPending(pendingCodes);
      await saveScanRecord({
        timestamp: Date.now(),
        vin: vehicle?.vin,
        storedCodes,
        pendingCodes,
        cleared: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setScanning(false);
    }
  }

  async function doClear() {
    if (!client) return;
    setConfirmOpen(false);
    setClearing(true);
    setError(null);
    try {
      await clearDtcs(client);
      setStored([]);
      setPending([]);
      setCleared(true);
      await saveScanRecord({
        timestamp: Date.now(),
        vin: vehicle?.vin,
        storedCodes: [],
        pendingCodes: [],
        cleared: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setClearing(false);
    }
  }

  if (!connected) {
    return (
      <div className="card">
        <p>{t("vehicle.notConnected")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>{t("dtc.heading")}</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {cleared && <div className="alert alert-info">{t("dtc.clearSuccess")}</div>}

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button className="btn btn-primary" onClick={scan} disabled={scanning}>
            {scanning ? t("dtc.scanning") : t("dtc.scan")}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setConfirmOpen(true)}
            disabled={clearing || stored === null}
          >
            {clearing ? t("dtc.clearing") : t("dtc.clear")}
          </button>
        </div>

        {stored !== null && (
          <>
            <h3 style={{ fontSize: 14, color: "var(--text-dim)" }}>{t("dtc.stored")}</h3>
            <DtcList codes={stored} locale={locale} emptyKey="dtc.noCodesStored" />
            <h3 style={{ fontSize: 14, color: "var(--text-dim)", marginTop: 16 }}>{t("dtc.pending")}</h3>
            <DtcList codes={pending ?? []} locale={locale} emptyKey="dtc.noCodesPending" />
          </>
        )}
      </div>

      {confirmOpen && (
        <div className="modal-backdrop" onClick={() => setConfirmOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t("dtc.clearConfirmTitle")}</h2>
            <p style={{ color: "var(--text-dim)", fontSize: 14 }}>{t("dtc.clearConfirmBody")}</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setConfirmOpen(false)}>
                {t("dtc.clearConfirmCancel")}
              </button>
              <button className="btn btn-danger" onClick={doClear}>
                {t("dtc.clearConfirmAction")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
