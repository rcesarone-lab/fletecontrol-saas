import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { MetodoPago, PagoAyudante } from "../../domain/ayudante";
import { useConfiguracion } from "../../hooks/useConfiguracion";

type AyudanteFormProps = {
  pagoEditando?: PagoAyudante | null;

  onSubmit: (data: {
    ayudanteNombre: string;
    horasTrabajadas: number;
    valorHora: number;
    metodoPago: MetodoPago;
    comprobanteUrl?: string;
    fecha?: string;
  }) => void;

  onCancelEdit?: () => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

const metodosPago: MetodoPago[] = [
  "EFECTIVO",
  "TRANSFERENCIA",
  "BILLETERA",
  "CHEQUE",
];

export default function AyudanteForm({
  pagoEditando,
  onSubmit,
  onCancelEdit,
  onError,
  onSuccess,
}: AyudanteFormProps) {
  const { configuracion } = useConfiguracion();

  const valorHoraBase = configuracion?.ayudantes.valorHoraDefault ?? 4500;

  const [ayudanteNombre, setAyudanteNombre] = useState("");
  const [horasTrabajadas, setHorasTrabajadas] = useState(0);
  const [valorHora, setValorHora] = useState(valorHoraBase);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("EFECTIVO");
  const [comprobanteUrl, setComprobanteUrl] = useState("");

  const estaEditando = Boolean(pagoEditando);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    if (!pagoEditando) {
      limpiarFormulario();
      return;
    }

    setAyudanteNombre(pagoEditando.ayudanteNombre);
    setHorasTrabajadas(pagoEditando.horasTrabajadas);
    setValorHora(pagoEditando.valorHora);
    setMetodoPago(pagoEditando.metodoPago);
    setComprobanteUrl(pagoEditando.comprobanteUrl ?? "");
  }, [pagoEditando]);

  useEffect(() => {
    if (!estaEditando) {
      setValorHora(valorHoraBase);
    }
  }, [valorHoraBase, estaEditando]);

  const montoCalculado = useMemo(() => {
    return horasTrabajadas * valorHora;
  }, [horasTrabajadas, valorHora]);

  function limpiarFormulario() {
    setAyudanteNombre("");
    setHorasTrabajadas(0);
    setValorHora(valorHoraBase);
    setMetodoPago("EFECTIVO");
    setComprobanteUrl("");
  }

  function cancelarEdicion() {
    limpiarFormulario();
    onCancelEdit?.();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!ayudanteNombre.trim()) {
      onError("Completá el nombre del ayudante.");
      return;
    }

    if (horasTrabajadas <= 0) {
      onError("Las horas trabajadas deben ser mayores a cero.");
      return;
    }

    if (valorHora <= 0) {
      onError("El valor hora debe ser mayor a cero.");
      return;
    }

    onSubmit({
      ayudanteNombre,
      horasTrabajadas,
      valorHora,
      metodoPago,
      comprobanteUrl,
      fecha,
    });

    onSuccess(
      estaEditando
        ? "Pago de ayudante actualizado correctamente."
        : "Pago de ayudante registrado correctamente."
    );

    if (!estaEditando) {
      limpiarFormulario();
    }
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-field full">
        <h2>{estaEditando ? "Editando pago de ayudante" : "Registrar pago"}</h2>
      </div>

      <div className="form-field">
        <label>Ayudante</label>
        <input
          value={ayudanteNombre}
          onChange={(e) => setAyudanteNombre(e.target.value)}
          placeholder="Ej: Carlos Gómez"
        />
      </div>

      <div className="form-field">
        <label>Horas trabajadas</label>
        <input
          type="number"
          value={horasTrabajadas}
          onChange={(e) => setHorasTrabajadas(Number(e.target.value))}
        />
      </div>

      <div className="form-field">
        <label>Valor hora</label>
        <input
          type="number"
          value={valorHora}
          onChange={(e) => setValorHora(Number(e.target.value))}
        />
      </div>

      <div className="form-field">
        <label>Método de pago</label>
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
        >
          {metodosPago.map((metodo) => (
            <option key={metodo} value={metodo}>
              {metodo}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field full">
        <label>Comprobante / referencia</label>
        <input
          value={comprobanteUrl}
          onChange={(e) => setComprobanteUrl(e.target.value)}
          placeholder="Ej: nro transferencia o referencia"
        />
      </div>

      <article className="card">
        <div className="card-label">Monto calculado</div>
        <div className="card-value">${montoCalculado.toLocaleString("es-AR")}</div>
        <div className="card-note">Horas x valor hora</div>
      </article>

      <div className="form-field">
        <label>Fecha operación</label>

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <button className="primary-button" type="submit">
        {estaEditando ? "Actualizar pago" : "Registrar pago"}
      </button>

      {estaEditando && (
        <button
          className="secondary-button"
          type="button"
          onClick={cancelarEdicion}
        >
          Cancelar edición
        </button>
      )}
    </form>
  );
}