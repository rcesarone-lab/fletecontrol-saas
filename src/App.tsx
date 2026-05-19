import { Navigate, Route, Routes } from "react-router-dom";

import PageLayout from "./components/layout/PageLayout";

import Dashboard from "./pages/Dashboard";
import Envios from "./pages/Envios";
import Clientes from "./pages/Clientes";
import Vehiculo from "./pages/Vehiculo";
import Ayudantes from "./pages/Ayudantes";
import IngresosFacturacion from "./pages/IngresosFacturacion";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

export default function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/envios" element={<Envios />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/vehiculo" element={<Vehiculo />} />
        <Route path="/ayudantes" element={<Ayudantes />} />
        <Route path="/ingresos" element={<IngresosFacturacion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
    </PageLayout>
  );
}