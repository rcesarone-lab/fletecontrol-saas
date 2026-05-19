import { getEnvios } from "../services/enviosService";
import { getResumenFinanciero } from "../services/reportesService";
import { formatCurrency } from "../utils/currency";

export default function Reportes() {
  const resumen = getResumenFinanciero();
  const envios = getEnvios();

  const rentabilidadEnvios = envios.map((envio) => ({
    id: envio.id,
    empresa: envio.empresaCliente,
    destino: `${envio.localidad}, ${envio.provincia}`,
    tarifaContratante: envio.tarifaContratante,
    tarifaGremial: envio.tarifaGremial,
    costoEstimado: envio.costoEstimado,
    diferenciaGremio: envio.tarifaContratante - envio.tarifaGremial,
    rentabilidad: envio.tarifaContratante - envio.costoEstimado,
  }));

  return (
    <>
      <h1 className="page-title">Reportes</h1>

      <p className="page-description">
        Análisis financiero y operativo del negocio de transporte.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Ingresos brutos</div>
          <div className="card-value">{formatCurrency(resumen.ingresosBrutos)}</div>
          <div className="card-note">Total registrado</div>
        </article>

        <article className="card">
          <div className="card-label">Costos totales</div>
          <div className="card-value">{formatCurrency(resumen.costosTotales)}</div>
          <div className="card-note">Costo operativo total</div>
        </article>

        <article className="card">
          <div className="card-label">Rentabilidad neta</div>
          <div className="card-value">{formatCurrency(resumen.rentabilidadNeta)}</div>
          <div className="card-note">Resultado financiero</div>
        </article>

        <article className="card">
          <div className="card-label">Envíos registrados</div>
          <div className="card-value">{resumen.totalEnvios}</div>
          <div className="card-note">Base operativa</div>
        </article>
      </section>

      <section className="card table-card" style={{ marginTop: 18 }}>
        <h2>Rentabilidad por envío</h2>

        {rentabilidadEnvios.length === 0 ? (
          <div className="placeholder">
            Todavía no hay envíos para analizar.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Destino</th>
                  <th>Tarifa contratante</th>
                  <th>Tarifa gremial</th>
                  <th>Diferencia gremio</th>
                  <th>Costo estimado</th>
                  <th>Rentabilidad</th>
                </tr>
              </thead>

              <tbody>
                {rentabilidadEnvios.map((item) => (
                  <tr key={item.id}>
                    <td>{item.empresa}</td>
                    <td>{item.destino}</td>
                    <td>{formatCurrency(item.tarifaContratante)}</td>
                    <td>{formatCurrency(item.tarifaGremial)}</td>
                    <td>{formatCurrency(item.diferenciaGremio)}</td>
                    <td>{formatCurrency(item.costoEstimado)}</td>
                    <td>{formatCurrency(item.rentabilidad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid grid-2" style={{ marginTop: 18 }}>
        <article className="card">
          <h2>Costos operativos</h2>

          <div className="metric-row">
            <span>Vehículo</span>
            <strong>{formatCurrency(resumen.gastosVehiculoTotal)}</strong>
          </div>

          <div className="metric-row">
            <span>Ayudantes</span>
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
          <h2>Lectura ejecutiva</h2>

          <p className="page-description">
            Este reporte cruza ingresos, gastos operativos, pagos a ayudantes,
            comisiones y retenciones. La rentabilidad neta permite saber si la
            operación está dejando margen real o solo movimiento de caja.
          </p>
        </article>
      </section>
    </>
  );
}