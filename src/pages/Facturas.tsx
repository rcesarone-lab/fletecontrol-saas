import { descargarFacturaPdf } from "../services/pdf/facturaPdfService";
import { getFacturas } from "../services/facturacionService";
import { getConfiguracion } from "../services/configuracionService";
import { formatCurrency } from "../utils/currency";

export default function Facturas() {
  const facturas = getFacturas();
  const configuracion = getConfiguracion();

  return (
    <>
      <h1 className="page-title">Facturas</h1>

      <p className="page-description">
        Historial de facturas simuladas emitidas desde el módulo de ingresos.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Total facturas</div>
          <div className="card-value">{facturas.length}</div>
          <div className="card-note">Comprobantes generados</div>
        </article>

        <article className="card">
          <div className="card-label">Importe facturado</div>
          <div className="card-value">
            {formatCurrency(
              facturas.reduce((total, factura) => total + factura.importeTotal, 0)
            )}
          </div>
          <div className="card-note">Total histórico</div>
        </article>

        <article className="card">
          <div className="card-label">Origen</div>
          <div className="card-value">SIM</div>
          <div className="card-note">Facturación simulada MVP</div>
        </article>

        <article className="card">
          <div className="card-label">Tipo</div>
          <div className="card-value">C</div>
          <div className="card-note">Factura monotributo</div>
        </article>
      </section>

      <section className="card table-card" style={{ marginTop: 18 }}>
        <h2>Facturas emitidas</h2>

        {facturas.length === 0 ? (
          <div className="placeholder">
            Todavía no hay facturas emitidas. Registrá un ingreso con factura simulada.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Punto venta</th>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Importe</th>
                  <th>Estado</th>
                  <th>Origen</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id}>
                    <td>{factura.fecha}</td>
                    <td>{factura.tipo}</td>
                    <td>{factura.puntoVenta ?? "-"}</td>
                    <td>{String(factura.numero ?? 0).padStart(8, "0")}</td>
                    <td>{factura.cliente}</td>
                    <td>{formatCurrency(factura.importeTotal)}</td>
                    <td>{factura.estado}</td>
                    <td>{factura.origen}</td>
                    <td>
                      <button
                        className="primary-button"
                        onClick={() =>
                          descargarFacturaPdf({
                            factura,
                            configuracion,
                          })
                        }
                      >
                        Descargar PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}