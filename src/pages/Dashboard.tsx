import KpiCard from "../components/dashboard/KpiCard";
import { useDashboard } from "../hooks/useDashboard";
import { formatCurrency } from "../utils/currency";

export default function Dashboard() {
  const { resumen } = useDashboard();

  return (
    <>
      <h1 className="page-title">Dashboard</h1>

      <p className="page-description">
        Vista ejecutiva conectada a ingresos, costos, ayudantes, vehículo y envíos.
      </p>

      <section className="grid grid-4">
        <KpiCard
          label="Ingresos brutos"
          value={formatCurrency(resumen.ingresosBrutos)}
          note="Total registrado"
        />

        <KpiCard
          label="Costos totales"
          value={formatCurrency(resumen.costosTotales)}
          note="Vehículo, ayudantes, comisiones y retenciones"
        />

        <KpiCard
          label="Rentabilidad neta"
          value={formatCurrency(resumen.rentabilidadNeta)}
          note="Ingresos brutos menos costos"
        />

        <KpiCard
          label="Envíos"
          value={resumen.totalEnvios}
          note="Operaciones registradas"
        />
      </section>

      <section className="grid grid-2" style={{ marginTop: 18 }}>
        <article className="card">
          <h2>Resumen financiero</h2>

          <div className="metric-row">
            <span>Ingresos netos</span>
            <strong>{formatCurrency(resumen.ingresosNetos)}</strong>
          </div>

          <div className="metric-row">
            <span>Gastos vehículo</span>
            <strong>{formatCurrency(resumen.gastosVehiculoTotal)}</strong>
          </div>

          <div className="metric-row">
            <span>Pagos ayudantes</span>
            <strong>{formatCurrency(resumen.pagosAyudantesTotal)}</strong>
          </div>

          <div className="metric-row">
            <span>Comisiones</span>
            <strong>{formatCurrency(resumen.comisiones)}</strong>
          </div>

          <div className="metric-row">
            <span>Retenciones</span>
            <strong>{formatCurrency(resumen.retenciones)}</strong>
          </div>
        </article>

        <article className="card">
          <h2>Estado operativo</h2>

          <div className="metric-row">
            <span>Pendientes</span>
            <strong>{resumen.enviosPendientes}</strong>
          </div>

          <div className="metric-row">
            <span>En tránsito</span>
            <strong>{resumen.enviosEnTransito}</strong>
          </div>

          <div className="metric-row">
            <span>Entregados</span>
            <strong>{resumen.enviosEntregados}</strong>
          </div>

          <div className="metric-row">
            <span>Clientes operativos</span>
            <strong>{resumen.totalClientesOperativos}</strong>
          </div>
        </article>
      </section>
    </>
  );
}