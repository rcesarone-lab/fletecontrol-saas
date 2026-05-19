import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-title">FleteControl-SaaS</div>
        <div className="brand-subtitle">Gestión de fletes y encomiendas</div>
      </div>

      <nav className="nav">
        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>

        <NavLink to="/envios" className="nav-link">
          Envíos
        </NavLink>

        <NavLink to="/clientes" className="nav-link">
          Clientes
        </NavLink>

        <NavLink to="/vehiculo" className="nav-link">
          Vehículo
        </NavLink>

        <NavLink to="/ayudantes" className="nav-link">
          Ayudantes
        </NavLink>

        <NavLink to="/configuracion" className="nav-link">
          Configuración
        </NavLink>
      </nav>

      <div className="signature">
        <div className="signature-name">CRamirez</div>
        <div className="signature-role">Consultor de Sistemas</div>
      </div>
    </aside>
  );
}