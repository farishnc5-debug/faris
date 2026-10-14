import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useObdStore } from "../store/obdStore";

function LanguageSwitch() {
  const { i18n } = useTranslation();
  return (
    <div className="lang-switch">
      <button className={i18n.language === "en" ? "active" : ""} onClick={() => i18n.changeLanguage("en")}>
        EN
      </button>
      <button className={i18n.language === "ar" ? "active" : ""} onClick={() => i18n.changeLanguage("ar")}>
        AR
      </button>
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  disconnected: "nav.connect",
  connecting: "connect.connecting",
  "reading-vin": "connect.readingVehicle",
  connected: "connect.connected",
  error: "connect.error",
};

function StatusPill() {
  const { t } = useTranslation();
  const status = useObdStore((s) => s.status);
  const isConnected = status === "connected" || status === "reading-vin";
  const key = STATUS_LABEL[status] ?? status;
  const label = key === "connect.connected" ? t(key, { label: "" }) : t(key);
  return (
    <span className={`status-pill ${isConnected ? "connected" : ""}`}>
      <span className="status-dot" />
      {label}
    </span>
  );
}

export default function Layout() {
  const { t } = useTranslation();
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>{t("app.title")}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StatusPill />
          <LanguageSwitch />
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="app-nav">
        <div className="app-nav-inner">
          <NavLink to="/" className={({ isActive }) => `app-nav-item ${isActive ? "active" : ""}`}>
            {t("nav.connect")}
          </NavLink>
          <NavLink to="/vehicle" className={({ isActive }) => `app-nav-item ${isActive ? "active" : ""}`}>
            {t("nav.dashboard")}
          </NavLink>
          <NavLink to="/dtc" className={({ isActive }) => `app-nav-item ${isActive ? "active" : ""}`}>
            {t("nav.dtc")}
          </NavLink>
          <NavLink to="/live" className={({ isActive }) => `app-nav-item ${isActive ? "active" : ""}`}>
            {t("nav.liveData")}
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
