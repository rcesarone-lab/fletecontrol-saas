import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { Ingreso, MetodoCobro } from "../../domain/ingreso";
import { formatCurrency } from "../../utils/currency";

type IngresoEditFormProps = {
  ingresoEditando: Ingreso | null;
  onSubmit: (data: {
    id: string;
    metodoCobro: MetodoCobro;
    referenciaOperacion?: string;
    comision: number;
    retencion: number;
    observaciones?: string;
  }) => void;
  onCancel: () => void;
};

const metodosCobro: MetodoCobro[] = [
  "EFECTIVO",
  "TRANSFERENCIA",
  "MERCADOPAGO",
  "CHEQUE",
];

export default function IngresoEditForm({
  ingresoEditando,
  onSubmit,
  onCancel,
}: IngresoEditFormProps) {
  const [metodoCobro, setMetodoCobro] = useState<MetodoCobro>("TRANSFERENCIA");
  const [referenciaOperacion, setReferenciaOperacion] = useState("");
  const [comision, setComision] = useState(0);
  const [retencion, setRetencion] = useState(0);
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (!ingresoEditando) return;

    setMetodoCobro(ingresoEditando.metodoCobro);
    setReferenciaOperacion(ingresoEditando.referenciaOperacion ?? "");
    setComision(ingresoEditando.comision);
    setRetencion(ingresoEditando.retencion);
    setObservaciones(ingresoEditando.observaciones ?? "");
  }, [ingresoEditando]);

  const netoCalculado = useMemo(() => {
    if (!ingresoEditando) return 0;

    return ingresoEditando.monto - comision - retencion;
  }, [ingresoEditando, comision, retencion]);

  if (!ingresoEditando) return null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!ingresoEditando) return;
    
    if (netoCalculado < 0) {
      return;
    }

    onSubmit({
      id: ingresoEditando.id,
      metodoCobro,
      referenciaOperacion,
      comision,
      retencion,
      observaciones,
    });
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-field full">
        <h2>Editando cobro</h2>
        <p className="card-note">
          Solo se pueden modificar datos administrativos del cobro. No se cambia
          la factura, cliente, monto bruto ni fecha.
        </p>
      </div>

      <div className="form-field">
        <label>Cliente</label>
        <input value={ingresoEditando.cliente} disabled />
      </div>

      <div className="form-field">
        <label>Concepto</label>
        <input value={ingresoEditando.concepto} disabled />
      </div>

      <div className="form-field">
        <label>Monto bruto</label>
        <input value={formatCurrency(ingresoEditando.monto)} disabled />
      </div>

      <div className="form-field">
        <label>Método de cobro</label>
        <select
          value={metodoCobro}
          onChange={(e) => setMetodoCobro(e.target.value as MetodoCobro)}
        >
          {metodosCobro.map((metodo) => (
            <option key={metodo} value={metodo}>
              {metodo}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Referencia operación</label>
        <input
          value={referenciaOperacion}
          onChange={(e) => setReferenciaOperacion(e.target.value)}
          placeholder="TRX / MercadoPago / cheque"
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

      <article className="card">
        <div className="card-label">Neto recalculado</div>
        <div className="card-value">{formatCurrency(netoCalculado)}</div>
        <div className="card-note">Monto bruto - comisión - retención</div>
      </article>

      <div className="form-field full">
        <label>Observaciones</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Notas administrativas del cobro"
        />
      </div>

      <button className="secondary-button" type="button" onClick={onCancel}>
        Cancelar edición
      </button>

      <button className="primary-button" type="submit" disabled={netoCalculado < 0}>
        Actualizar cobro
      </button>
    </form>
  );
}