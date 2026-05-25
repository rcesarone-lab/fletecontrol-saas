import KpiCard from "../components/dashboard/KpiCard";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import { useDashboard } from "../hooks/useDashboard";
import { formatCurrency } from "../utils/currency";

export default function Dashboard() {
  const { resumen } = useDashboard();

  const pendienteCobro = resumen.totalFacturado - resumen.ingresosNetos;

  return (
    <>
      <h1 className="page-title">Dashboard</h1>

      <p className="page-description">
        Vista ejecutiva conectada a operación, ingresos, costos, cobranza y facturación.
      </p>

      <section className="card" style={{ marginTop: 18 }}>
        <div className="section-header">
          <div>
            <h2>Resultado ejecutivo</h2>
            <p className="card-note">
              Lectura rápida del estado financiero y operativo del negocio.
            </p>
          </div>

          <span
            className={
              resumen.rentabilidadNeta >= 0
                ? "status-badge success"
                : "status-badge warning"
            }
          >
            {resumen.rentabilidadNeta >= 0
              ? "OPERACIÓN POSITIVA"
              : "REVISAR COSTOS"}
          </span>
        </div>

        <section className="grid grid-4" style={{ marginTop: 18 }}>
          <KpiCard
            label="Facturado mes"
            value={formatCurrency(resumen.facturadoMesActual)}
            note={`Mes actual: ${resumen.mesActual}`}
          />

          <KpiCard
            label="Cobrado mes"
            value={formatCurrency(resumen.cobradoMesActual)}
            note="Cobros netos del mes"
          />

          <KpiCard
            label="Gastos mes"
            value={formatCurrency(resumen.gastosMesActual)}
            note="Vehículo + ayudantes"
          />

          <KpiCard
            label="Margen mes"
            value={formatCurrency(resumen.margenMesActual)}
            note={`Variación facturación: ${resumen.variacionFacturacionMensual.toFixed(1)}%`}
          />
        </section>

        <section className="grid grid-4">
          <KpiCard
            label="Facturado"
            value={formatCurrency(resumen.totalFacturado)}
            note="Total emitido"
          />

          <KpiCard
            label="Cobrado neto"
            value={formatCurrency(resumen.ingresosNetos)}
            note="Disponible real"
          />

          <KpiCard
            label="Margen operativo"
            value={formatCurrency(resumen.rentabilidadNeta)}
            note="Neto menos costos"
          />

          <KpiCard
            label="Pendiente"
            value={formatCurrency(pendienteCobro)}
            note="Por cobrar"
          />
        </section>
      </section>

      <section className="grid grid-4" style={{ marginTop: 18 }}>
        <KpiCard
          label="Costos operativos"
          value={formatCurrency(resumen.costosOperativos)}
          note="Vehículo + ayudantes"
        />

        <KpiCard
          label="Ticket promedio"
          value={formatCurrency(resumen.ticketPromedio)}
          note="Promedio por factura/cobro"
        />

        <KpiCard
          label="Clientes activos"
          value={resumen.clientesActivos}
          note="Clientes con operación"
        />

        <KpiCard
          label="Facturas emitidas"
          value={resumen.totalFacturas}
          note="Comprobantes generados"
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
            <span>Facturados / por cobrar</span>
            <strong>{resumen.enviosPendientesDeCobro}</strong>
          </div>

          <div className="metric-row">
            <span>Cobrados</span>
            <strong>{resumen.enviosCobrados}</strong>
          </div>

          <div className="metric-row">
            <span>Cancelados</span>
            <strong>{resumen.enviosCancelados}</strong>
          </div>
        </article>

        <article className="card">
          <h2>Lectura financiera</h2>

          <div className="metric-row">
            <span>Total facturado</span>
            <strong>{formatCurrency(resumen.totalFacturado)}</strong>
          </div>

          <div className="metric-row">
            <span>Cobrado neto</span>
            <strong>{formatCurrency(resumen.ingresosNetos)}</strong>
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
            <span>Resultado operativo</span>
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

          <div className="metric-row">
            <span>Gastos vehículo</span>
            <strong>{formatCurrency(resumen.gastosVehiculoTotal)}</strong>
          </div>

          <div className="metric-row">
            <span>Pagos ayudantes</span>
            <strong>{formatCurrency(resumen.pagosAyudantesTotal)}</strong>
          </div>
        </article>

        <article className="card">
          <h2>Diagnóstico rápido</h2>

          <p className="page-description">
            Este panel resume si la operación está generando margen real, si hay
            facturación pendiente de cobro y cuánto representan los costos
            directos del vehículo y ayudantes sobre el negocio.
          </p>

          <div className="metric-row">
            <span>Estado financiero</span>
            <strong>
              {resumen.rentabilidadNeta >= 0 ? "Saludable" : "En revisión"}
            </strong>
          </div>

          <div className="metric-row">
            <span>Saldo pendiente</span>
            <strong>{formatCurrency(pendienteCobro)}</strong>
          </div>
        </article>
      </section>

      <section className="grid grid-4" style={{ marginTop: 18 }}>
        <article className="card">
          <div className="card-label">Facturas pendientes</div>

          <div className="card-value">
            {pendienteCobro > 0
              ? Math.max(
                1,
                Math.round(
                  pendienteCobro / Math.max(resumen.ticketPromedio, 1)
                )
              )
              : 0}
          </div>

          <div className="card-note">Facturación pendiente de cobranza</div>
        </article>

        <article className="card">
          <div className="card-label">Clientes incompletos</div>

          <div className="card-value">
            {Math.max(resumen.totalClientes - resumen.clientesActivos, 0)}
          </div>

          <div className="card-note">Requieren validación comercial</div>
        </article>

        <article className="card">
          <div className="card-label">Gastos operativos</div>

          <div className="card-value">
            {formatCurrency(resumen.costosOperativos)}
          </div>

          <div className="card-note">Vehículo y ayudantes acumulados</div>
        </article>

        <article className="card">
          <div className="card-label">Estado operativo</div>

          <div
            className={`status-badge ${resumen.enviosPendientes > 0 ? "warning" : "success"
              }`}
            style={{ marginTop: 12 }}
          >
            {resumen.enviosPendientes > 0
              ? "OPERACIÓN ACTIVA"
              : "SIN PENDIENTES"}
          </div>

          <div className="card-note" style={{ marginTop: 12 }}>
            Estado general de envíos
          </div>
        </article>
      </section>

      <DashboardCharts />
    </>
  );
}