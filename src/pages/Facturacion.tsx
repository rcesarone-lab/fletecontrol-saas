import { useMemo, useState } from "react";
import Toast from "../components/ui/Toast";
import { useClientes } from "../hooks/useClientes";
import { useFacturacion } from "../hooks/useFacturacion";
import { useToast } from "../hooks/useToast";
import { descargarFacturaPdf } from "../services/pdf/facturaPdfService";
import { getConfiguracion } from "../services/configuracionService";
import { formatCurrency } from "../utils/currency";
import type { MetodoCobro } from "../domain/ingreso";
import { registrarCobroFactura } from "../services/facturacionService";

export default function Facturacion() {
  const { clientes } = useClientes();

  const {
    facturas,
    enviosFacturables,
    buscarEnviosFacturables,
    emitirCorte,
  } = useFacturacion();

  const { message, type, showToast, clearToast } = useToast();

  const [clienteId] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [concepto, setConcepto] = useState("");
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [facturaACobrar, setFacturaACobrar] = useState<string | null>(null);
  const [metodoCobro, setMetodoCobro] = useState<MetodoCobro>("TRANSFERENCIA");
  const [referenciaOperacion, setReferenciaOperacion] = useState("");
  const [comision, setComision] = useState(0);
  const [retencion, setRetencion] = useState(0);
  const [observacionesCobro, setObservacionesCobro] = useState("");
  const [filtroFacturaCliente, setFiltroFacturaCliente] = useState("");
  const [filtroFacturaEstado, setFiltroFacturaEstado] = useState("");
  const [filtroFacturaTexto, setFiltroFacturaTexto] = useState("");

  const configuracion = getConfiguracion();

  const totalSeleccionado = useMemo(() => {
    return enviosFacturables
      .filter((envio) => seleccionados.includes(envio.id))
      .reduce((total, envio) => total + envio.tarifaContratante, 0);
  }, [enviosFacturables, seleccionados]);
 
  const facturasFiltradas = useMemo(() => {
    const texto = filtroFacturaTexto.trim().toLowerCase();

    return facturas.filter((factura) => {
      const coincideCliente =
        !filtroFacturaCliente || factura.clienteId === filtroFacturaCliente;

      const coincideEstado =
        !filtroFacturaEstado ||
        factura.estado === filtroFacturaEstado;

      const coincideTexto =
        !texto ||
        factura.cliente.toLowerCase().includes(texto) ||
        factura.concepto.toLowerCase().includes(texto);

      return (
        coincideCliente &&
        coincideEstado &&
        coincideTexto
      );
    });
  }, [
    facturas,
    filtroFacturaCliente,
    filtroFacturaEstado,
    filtroFacturaTexto,
  ]);

  function buscar() {
    if (!clienteId) {
      showToast("Seleccioná un cliente para buscar envíos.", "error");
      return;
    }

    buscarEnviosFacturables({
      clienteId,
      desde,
      hasta,
    });

    setSeleccionados([]);
  }

  function toggleEnvio(id: string) {
    setSeleccionados((actuales) =>
      actuales.includes(id)
        ? actuales.filter((item) => item !== id)
        : [...actuales, id]
    );
  }

  function emitirFactura() {
    try {
      emitirCorte({
        clienteId,
        envioIds: seleccionados,
        periodoDesde: desde,
        periodoHasta: hasta,
        concepto,
      });

      setSeleccionados([]);
      setConcepto("");

      showToast("Factura por corte emitida correctamente.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "No se pudo emitir la factura.",
        "error"
      );
    }
  }

  function confirmarCobro() {
    if (!facturaACobrar) return;

    try {
      registrarCobroFactura({
        facturaId: facturaACobrar,
        metodoCobro,
        referenciaOperacion,
        comision,
        retencion,
        observaciones: observacionesCobro,
      });

      setFacturaACobrar(null);
      setMetodoCobro("TRANSFERENCIA");
      setReferenciaOperacion("");
      setComision(0);
      setRetencion(0);
      setObservacionesCobro("");

      showToast("Cobro registrado correctamente.", "success");

      window.location.reload();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "No se pudo registrar el cobro.",
        "error"
      );
    }
  }

  return (
    <>
      <h1 className="page-title">Facturación</h1>

      <p className="page-description">
        Emisión de facturas por corte, agrupando envíos entregados por cliente y
        período.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Facturas emitidas</div>
          <div className="card-value">{facturas.length}</div>
          <div className="card-note">Histórico de comprobantes</div>
        </article>

        <article className="card">
          <div className="card-label">Pendientes de cobro</div>
          <div className="card-value">
            {
              facturas.filter(
                (factura) => factura.estado === "PENDIENTE_COBRO"
              ).length
            }
          </div>
          <div className="card-note">Facturas aún no cobradas</div>
        </article>

        <article className="card">
          <div className="card-label">Total facturado</div>
          <div className="card-value">
            {formatCurrency(
              facturas.reduce((total, factura) => total + factura.importeTotal, 0)
            )}
          </div>
          <div className="card-note">Importe histórico</div>
        </article>

        <article className="card">
          <div className="card-label">Seleccionado</div>
          <div className="card-value">{formatCurrency(totalSeleccionado)}</div>
          <div className="card-note">Importe del corte actual</div>
        </article>
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <div className="section-header">
          <div>
            <h2>Nuevo corte de facturación</h2>
            <p className="card-note">
              Seleccioná cliente y período para buscar envíos entregados pendientes de facturar.
            </p>
          </div>
        </div>

        <div className="form-grid compact-filters">
          <div className="form-field">
            <label>Cliente</label>
            <select
              value={filtroFacturaCliente}
              onChange={(e) => setFiltroFacturaCliente(e.target.value)}
            >
              <option value="">Todos</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.razonSocial}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Fecha desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Fecha hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </div>

          <button className="secondary-button" type="button" onClick={buscar}>
            Buscar envíos facturables
          </button>

          <div className="form-field full">
            <label>Concepto de factura</label>
            <input
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Viajes realizados primera quincena de mayo"
            />
          </div>
        </div>
      </section>

      <section className="card table-card" style={{ marginTop: 18 }}>
        <div className="section-header">
          <div>
            <h2>Envíos disponibles para facturar</h2>
            <p className="card-note">
              Seleccioná los envíos que formarán parte del corte.
            </p>
          </div>

          {enviosFacturables.length > 0 && (
            <div style={{ textAlign: "right" }}>
              <div className="card-label">Seleccionados</div>
              <div className="card-value" style={{ fontSize: 20 }}>
                {seleccionados.length}
              </div>
              <div className="card-note">{formatCurrency(totalSeleccionado)}</div>
            </div>
          )}
        </div>

        {enviosFacturables.length === 0 ? (
          <div className="placeholder">
            No hay envíos entregados disponibles para el corte seleccionado.
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Fecha</th>
                    <th>Materiales</th>
                    <th>Destino</th>
                    <th>Importe</th>
                  </tr>
                </thead>

                <tbody>
                  {enviosFacturables.map((envio) => (
                    <tr key={envio.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(envio.id)}
                          onChange={() => toggleEnvio(envio.id)}
                        />
                      </td>

                      <td>{envio.fecha}</td>

                      <td>{envio.materiales}</td>

                      <td>
                        {envio.localidad}, {envio.provincia}
                      </td>

                      <td>
                        <strong>{formatCurrency(envio.tarifaContratante)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: 18,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="primary-button"
                type="button"
                onClick={emitirFactura}
                disabled={seleccionados.length === 0}
              >
                Emitir factura por corte
              </button>
            </div>
          </>
        )}
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <div className="section-header">
          <div>
            <h2>Filtros de facturas</h2>
            <p className="card-note">
              Buscá facturas emitidas por cliente, estado o concepto.
            </p>
          </div>
        </div>

        <div className="form-grid compact-filters">
          <div className="form-field">
            <label>Cliente</label>
            <input
              value={filtroFacturaCliente}
              onChange={(e) =>
                setFiltroFacturaCliente(e.target.value)
              }
              placeholder="Buscar cliente"
            />
          </div>

          <div className="form-field">
            <label>Estado</label>
            <select
              value={filtroFacturaEstado}
              onChange={(e) =>
                setFiltroFacturaEstado(e.target.value)
              }
            >
              <option value="">Todos</option>
              <option value="PENDIENTE_COBRO">
                PENDIENTE_COBRO
              </option>
              <option value="COBRADA">
                COBRADA
              </option>
            </select>
          </div>

          <div className="form-field full">
            <label>Texto libre</label>
            <input
              value={filtroFacturaTexto}
              onChange={(e) =>
                setFiltroFacturaTexto(e.target.value)
              }
              placeholder="Buscar por concepto o cliente"
            />
          </div>
        </div>
      </section>

      <section className="card table-card" style={{ marginTop: 18 }}>
        <h2>Facturas emitidas</h2>

        {facturasFiltradas.length === 0 ? (
          <div className="placeholder">Todavía no hay facturas emitidas.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Período</th>
                  <th>Servicios</th>
                  <th>Número</th>
                  <th>Importe</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {facturasFiltradas.map((factura) => (
                  <tr key={factura.id}>
                    <td>{factura.fecha}</td>
                    <td>{factura.cliente}</td>
                    <td>
                      {factura.periodoDesde || "-"} / {factura.periodoHasta || "-"}
                    </td>
                    <td>{factura.envioIds?.length ?? 0}</td>
                    <td>
                      {String(factura.puntoVenta ?? 1).padStart(4, "0")}-
                      {String(factura.numero ?? 0).padStart(8, "0")}
                    </td>
                    <td>{formatCurrency(factura.importeTotal)}</td>
                    <td>
                      <span
                        className={
                          factura.estado === "COBRADA"
                            ? "status-badge success"
                            : factura.estado === "PENDIENTE_COBRO"
                              ? "status-badge warning"
                              : "status-badge neutral"
                        }
                      >
                        {factura.estado}
                      </span>
                    </td>

                    <td>
                      <div className="action-group">
                        <button
                          className="secondary-button"
                          onClick={() =>
                            descargarFacturaPdf({
                              factura,
                              configuracion,
                            })
                          }
                        >
                          PDF
                        </button>

                        {factura.estado === "PENDIENTE_COBRO" && (
                          <button
                            className="primary-button"
                            onClick={() => setFacturaACobrar(factura.id)}
                          >
                            Cobrar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {facturaACobrar && (
        <section className="modal-overlay">
          <div className="modal-card">
            <h2>Registrar cobro</h2>

            <p className="page-description">
              Este cobro marcará la factura como COBRADA y sus envíos como COBRADO.
            </p>

            <div className="form-grid">
              <div className="form-field">
                <label>Método de cobro</label>
                <select
                  value={metodoCobro}
                  onChange={(e) => setMetodoCobro(e.target.value as MetodoCobro)}
                >
                  <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                  <option value="MERCADOPAGO">MERCADOPAGO</option>
                  <option value="EFECTIVO">EFECTIVO</option>
                  <option value="CHEQUE">CHEQUE</option>
                </select>
              </div>

              <div className="form-field">
                <label>Referencia operación</label>
                <input
                  value={referenciaOperacion}
                  onChange={(e) => setReferenciaOperacion(e.target.value)}
                  placeholder="Ej: TRX-889922 / MP-448812"
                />
              </div>

              <div className="form-field">
                <label>Comisión</label>
                <input
                  type="number"
                  value={comision}
                  onChange={(e) => setComision(Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label>Retención</label>
                <input
                  type="number"
                  value={retencion}
                  onChange={(e) => setRetencion(Number(e.target.value))}
                />
              </div>

              <div className="form-field full">
                <label>Observaciones</label>
                <textarea
                  value={observacionesCobro}
                  onChange={(e) => setObservacionesCobro(e.target.value)}
                  placeholder="Notas del cobro"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setFacturaACobrar(null)}
              >
                Cancelar
              </button>

              <button className="primary-button" onClick={confirmarCobro}>
                Confirmar cobro
              </button>
            </div>
          </div>
        </section>
      )}

      <Toast message={message} type={type} onClose={clearToast} />
    </>
  );
}