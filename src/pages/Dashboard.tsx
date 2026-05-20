import KpiCard from "../components/dashboard/KpiCard";
import { useDashboard } from "../hooks/useDashboard";
import { formatCurrency } from "../utils/currency";
import DashboardCharts from "../components/dashboard/DashboardCharts";

export default function Dashboard() {
  const { resumen } = useDashboard();

  return (
    <>
      <h1 className="page-title">Dashboard</h1>

      <p className="page-description">
        Vista ejecutiva conectada a operación, ingresos, costos, cobranza y facturación.
      </p>

      <section className="grid grid-4">
        <KpiCard
          label="Ingresos brutos"
          value={formatCurrency(resumen.ingresosBrutos)}
          note="Total registrado"
        />

        <KpiCard
          label="Ingresos netos"
          value={formatCurrency(resumen.ingresosNetos)}
          note="Después de comisiones y retenciones"
        />

        <KpiCard
          label="Margen operativo"
          value={formatCurrency(resumen.margenOperativo)}
          note="Ingresos netos menos vehículo y ayudantes"
        />

        <KpiCard
          label="Pendientes de cobro"
          value={resumen.enviosPendientesDeCobro}
          note="Entregados sin ingreso asociado"
        />
      </section>

      <section className="grid grid-4" style={{ marginTop: 18 }}>
        <KpiCard
          label="Costos operativos"
          value={formatCurrency(resumen.costosOperativos)}
          note="Vehículo + ayudantes"
        />

        <KpiCard
          label="Gastos vehículo"
          value={formatCurrency(resumen.gastosVehiculoTotal)}
          note="Combustible, mantenimiento, seguro y peajes"
        />

        <KpiCard
          label="Pagos ayudantes"
          value={formatCurrency(resumen.pagosAyudantesTotal)}
          note="Horas y liquidaciones"
        />

        <KpiCard
          label="Ticket promedio"
          value={formatCurrency(resumen.ticketPromedio)}
          note="Promedio por ingreso registrado"
        />
      </section>

      <section className="grid grid-2" style={{ marginTop: 18 }}>
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
            <span>Cobrados</span>
            <strong>{resumen.enviosCobrados}</strong>
          </div>

          <div className="metric-row">
            <span>Cancelados</span>
            <strong>{resumen.enviosCancelados}</strong>
          </div>

          <div className="metric-row">
            <span>Pendientes de cobro</span>
            <strong>{resumen.enviosPendientesDeCobro}</strong>
          </div>
        </article>

        <article className="card">
          <h2>Lectura financiera</h2>

          <div className="metric-row">
            <span>Facturas emitidas</span>
            <strong>{resumen.totalFacturas}</strong>
          </div>

          <div className="metric-row">
            <span>Total facturado</span>
            <strong>{formatCurrency(resumen.totalFacturado)}</strong>
          </div>

          <div className="metric-row">
            <span>Comisiones</span>
            <strong>{formatCurrency(resumen.comisiones)}</strong>
          </div>

          <div className="metric-row">
            <span>Retenciones</span>
            <strong>{formatCurrency(resumen.retenciones)}</strong>
          </div>

          <div className="metric-row">
            <span>Rentabilidad neta</span>
            <strong>{formatCurrency(resumen.rentabilidadNeta)}</strong>
          </div>
        </article>
      </section>

      <section className="grid grid-2" style={{ marginTop: 18 }}>
        <article className="card">
          <h2>Resumen comercial</h2>

          <div className="metric-row">
            <span>Clientes registrados</span>
            <strong>{resumen.totalClientes}</strong>
          </div>

          <div className="metric-row">
            <span>Clientes activos</span>
            <strong>{resumen.clientesActivos}</strong>
          </div>

          <div className="metric-row">
            <span>Total envíos</span>
            <strong>{resumen.totalEnvios}</strong>
          </div>
        </article>

        <article className="card">
          <h2>Diagnóstico rápido</h2>

          <p className="page-description">
            Este panel resume si la operación está generando margen real, si hay
            envíos entregados sin cobrar y cuánto representan los costos directos
            del vehículo y ayudantes sobre la facturación.
          </p>
        </article>
      </section>

      <DashboardCharts />

    </>
  );
}