import { FormEvent, useState } from "react";
import type { TipoGastoVehiculo } from "../../domain/vehiculo";

type GastoVehiculoFormProps = {
  onSubmit: (data: {
    tipo: TipoGastoVehiculo;
    descripcion: string;
    monto: number;
    vencimiento?: string;
  }) => void;
};

const tipos: TipoGastoVehiculo[] = [
  "COMBUSTIBLE",
  "MANTENIMIENTO",
  "SEGURO",
  "PEAJE",
  "OTRO",
];

export default function GastoVehiculoForm({
  onSubmit,
}: GastoVehiculoFormProps) {
  const [tipo, setTipo] = useState<TipoGastoVehiculo>("COMBUSTIBLE");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState(0);
  const [vencimiento, setVencimiento] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!descripcion.trim() || monto <= 0) {
      alert("Completá descripción y monto válido.");
      return;
    }

    onSubmit({
      tipo,
      descripcion,
      monto,
      vencimiento,
    });

    setTipo("COMBUSTIBLE");
    setDescripcion("");
    setMonto(0);
    setVencimiento("");
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
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
          placeholder="Ej: 45000"
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

      <button className="primary-button" type="submit">
        Registrar gasto
      </button>
    </form>
  );
}