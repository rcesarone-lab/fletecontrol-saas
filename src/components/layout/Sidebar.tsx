import { NavLink } from "react-router-dom";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "visible" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-title">FleteControl-SaaS</div>
          <div className="brand-subtitle">Gestión de fletes y encomiendas</div>
        </div>

        <nav className="nav">
          <NavLink to="/dashboard" className="nav-link" onClick={onClose}>
            Dashboard
          </NavLink>

          <NavLink to="/clientes" className="nav-link" onClick={onClose}>
            Clientes
          </NavLink>

          <NavLink to="/envios" className="nav-link" onClick={onClose}>
            Envíos
          </NavLink>

          <NavLink to="/facturacion" className="nav-link" onClick={onClose}>
            Facturación
          </NavLink>

          <NavLink to="/ingresos" className="nav-link" onClick={onClose}>
            Cobros
          </NavLink>

          <NavLink to="/vehiculo" className="nav-link" onClick={onClose}>
            Vehículo
          </NavLink>

          <NavLink to="/ayudantes" className="nav-link" onClick={onClose}>
            Ayudantes
          </NavLink>
          {/*
          <NavLink to="/facturas" className="nav-link" onClick={onClose}>
            Facturas
          </NavLink>
          */}
          <NavLink to="/reportes" className="nav-link" onClick={onClose}>
            Reportes
          </NavLink>

          <NavLink to="/configuracion" className="nav-link" onClick={onClose}>
            Configuración
          </NavLink>
        </nav>

        <div className="signature">
          <div className="signature-name">CRamirez</div>
          <div className="signature-role">Consultor de Sistemas</div>
        </div>
      </aside>
    </>
  );
}