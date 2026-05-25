import { type FormEvent, useEffect, useState } from "react";
import type { GastoVehiculo, TipoGastoVehiculo } from "../../domain/vehiculo";

type GastoVehiculoFormProps = {
  gastoEditando?: GastoVehiculo | null;
  onSubmit: (data: {
    tipo: TipoGastoVehiculo;
    descripcion: string;
    monto: number;
    vencimiento?: string;
    fecha?: string;
  }) => void;
  onCancelEdit?: () => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

const tipos: TipoGastoVehiculo[] = [
  "COMBUSTIBLE",
  "MANTENIMIENTO",
  "SEGURO",
  "PEAJE",
  "OTRO",
];

export default function GastoVehiculoForm({
  gastoEditando,
  onSubmit,
  onCancelEdit,
  onError,
  onSuccess,
}: GastoVehiculoFormProps) {
  const [tipo, setTipo] = useState<TipoGastoVehiculo>("COMBUSTIBLE");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState(0);
  const [vencimiento, setVencimiento] = useState("");

  const estaEditando = Boolean(gastoEditando);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    if (!gastoEditando) {
      limpiarFormulario();
      return;
    }

    setTipo(gastoEditando.tipo);
    setDescripcion(gastoEditando.descripcion);
    setMonto(gastoEditando.monto);
    setVencimiento(gastoEditando.vencimiento ?? "");
  }, [gastoEditando]);

  function limpiarFormulario() {
    setTipo("COMBUSTIBLE");
    setDescripcion("");
    setMonto(0);
    setVencimiento("");
  }

  function cancelarEdicion() {
    limpiarFormulario();
    onCancelEdit?.();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!descripcion.trim()) {
      onError("Completá la descripción del gasto.");
      return;
    }

    if (monto <= 0) {
      onError("El monto debe ser mayor a cero.");
      return;
    }

    onSubmit({ tipo, descripcion, monto, vencimiento });

    onSuccess(
      estaEditando
        ? "Gasto actualizado correctamente."
        : "Gasto registrado correctamente."
    );

    if (!estaEditando) {
      limpiarFormulario();
    }
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-field full">
        <h2>{estaEditando ? "Editando gasto" : "Registrar gasto"}</h2>
      </div>

      <div className="form-field">
        <label>Tipo de gasto</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoGastoVehiculo)}
        >
          {tipos.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Descripción</label>
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ej: Carga de combustible"
        />
      </div>

      <div className="form-field">
        <label>Monto</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
        />
      </div>

      <div className="form-field">
        <label>Vencimiento opcional</label>
        <input
          type="date"
          value={vencimiento}
          onChange={(e) => setVencimiento(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Fecha operación</label>

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <button className="primary-button" type="submit">
        {estaEditando ? "Actualizar gasto" : "Registrar gasto"}
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