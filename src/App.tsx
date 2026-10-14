import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ConnectPage from "./pages/ConnectPage";
import VehiclePage from "./pages/VehiclePage";
import DtcPage from "./pages/DtcPage";
import LiveDataPage from "./pages/LiveDataPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ConnectPage />} />
          <Route path="/vehicle" element={<VehiclePage />} />
          <Route path="/dtc" element={<DtcPage />} />
          <Route path="/live" element={<LiveDataPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
