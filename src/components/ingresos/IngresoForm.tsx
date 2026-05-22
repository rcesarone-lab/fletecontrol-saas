import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { Cliente } from "../../domain/cliente";
import type { Envio } from "../../domain/envio";
import type { EstadoCobro, MetodoCobro } from "../../domain/ingreso";

type IngresoFormProps = {
  clientes: Cliente[];

  envios: Envio[];

  onSubmit: (data: {
    clienteId?: string;
    envioId?: string;
    cliente: string;
    clienteCuit?: string;
    clienteDireccion?: string;
    concepto: string;
    monto: number;
    metodoCobro: MetodoCobro;
    comision: number;
    retencion: number;
    estado: EstadoCobro;
    facturaEmitida: boolean;
  }) => void;

  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

const metodos: MetodoCobro[] = [
  "EFECTIVO",
  "TRANSFERENCIA",
  "MERCADOPAGO",
  "CHEQUE",
];

const estados: EstadoCobro[] = ["PENDIENTE", "COBRADO"];

export default function IngresoForm({
  clientes,
  envios,
  onSubmit,
  onError,
  onSuccess,
}: IngresoFormProps) {
  const [clienteId, setClienteId] = useState("");
  const [envioId, setEnvioId] = useState("");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState(0);
  const [metodoCobro, setMetodoCobro] =
    useState<MetodoCobro>("TRANSFERENCIA");
  const [comision, setComision] = useState(0);
  const [retencion, setRetencion] = useState(0);
  const [estado, setEstado] = useState<EstadoCobro>("COBRADO");
  const [facturaEmitida, setFacturaEmitida] = useState(true);

  const clienteSeleccionado = clientes.find(
    (cliente) => cliente.id === clienteId
  );

  const enviosCliente = envios.filter(
    (envio) =>
      envio.clienteId === clienteId &&
      envio.estado === "ENTREGADO"
  );

  const envioSeleccionado = envios.find(
    (envio) => envio.id === envioId
  );

  const montoNeto = useMemo(() => {
    return monto - comision - retencion;
  }, [monto, comision, retencion]);

  useEffect(() => {
    if (!envioSeleccionado) return;

    setMonto(envioSeleccionado.tarifaContratante);

    setConcepto(
      `Servicio de transporte - ${envioSeleccionado.materiales}`
    );
  }, [envioSeleccionado]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!clienteSeleccionado) {
      onError("Seleccioná un cliente registrado.");
      return;
    }

    if (!concepto.trim()) {
      onError("Completá el concepto.");
      return;
    }

    if (monto <= 0) {
      onError("El monto debe ser mayor a cero.");
      return;
    }

    if (comision < 0 || retencion < 0) {
      onError("Comisión y retención no pueden ser negativas.");
      return;
    }

    onSubmit({
      clienteId: clienteSeleccionado.id,
      envioId,
      cliente: clienteSeleccionado.razonSocial,
      clienteCuit: clienteSeleccionado.cuit,
      clienteDireccion: clienteSeleccionado.direccion,
      concepto,
      monto,
      metodoCobro,
      comision,
      retencion,
      estado,
      facturaEmitida,
    });

    onSuccess("Ingreso registrado correctamente.");

    setClienteId("");
    setEnvioId("");
    setConcepto("");
    setMonto(0);
    setMetodoCobro("TRANSFERENCIA");
    setComision(0);
    setRetencion(0);
    setEstado("COBRADO");
    setFacturaEmitida(true);
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Cliente registrado</label>

        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Seleccionar cliente</option>

          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.razonSocial}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Envío asociado</label>

        <select
          value={envioId}
          onChange={(e) => setEnvioId(e.target.value)}
        >
          <option value="">
            Seleccionar envío
          </option>

          {enviosCliente.map((envio) => (
            <option
              key={envio.id}
              value={envio.id}
            >
              {envio.materiales} · {envio.localidad} · $
              {envio.tarifaContratante.toLocaleString("es-AR")}
            </option>
          ))}
        </select>
      </div>

      {clienteSeleccionado && (
        <article className="card">
          <div className="card-label">Datos fiscales del cliente</div>
          <div className="card-note">
            CUIT: {clienteSeleccionado.cuit || "Pendiente"} · Dirección:{" "}
            {clienteSeleccionado.direccion || "Pendiente"}
          </div>
        </article>
      )}

      <div className="form-field">
        <label>Concepto</label>

        <input
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          placeholder="Ej: Servicio de transporte"
        />
      </div>

      <div className="form-field">
        <label>Monto bruto</label>

        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
        />
      </div>

      <div className="form-field">
        <label>Método de cobro</label>

        <select
          value={metodoCobro}
          onChange={(e) => setMetodoCobro(e.target.value as MetodoCobro)}
        >
          {metodos.map((metodo) => (
            <option key={metodo} value={metodo}>
              {metodo}
            </option>
          ))}
        </select>
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

      <div className="form-field">
        <label>Estado</label>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoCobro)}
        >
          {estados.map((estadoItem) => (
            <option key={estadoItem} value={estadoItem}>
              {estadoItem}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Emitir factura simulada</label>

        <select
          value={String(facturaEmitida)}
          onChange={(e) => setFacturaEmitida(e.target.value === "true")}
        >
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      <article className="card">
        <div className="card-label">Monto neto</div>

        <div className="card-value">
          ${montoNeto.toLocaleString("es-AR")}
        </div>

        <div className="card-note">Bruto menos comisiones y retenciones</div>
      </article>

      <button className="primary-button" type="submit">
        Registrar ingreso
      </button>
    </form>
  );
}