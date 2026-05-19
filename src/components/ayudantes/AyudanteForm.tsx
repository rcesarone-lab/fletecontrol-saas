import { type FormEvent, useMemo, useState } from "react";
import type { MetodoPago } from "../../domain/ayudante";

type AyudanteFormProps = {
  onSubmit: (data: {
    ayudanteNombre: string;
    horasTrabajadas: number;
    valorHora: number;
    metodoPago: MetodoPago;
    comprobanteUrl?: string;
  }) => void;
};

const metodosPago: MetodoPago[] = [
  "EFECTIVO",
  "TRANSFERENCIA",
  "BILLETERA",
  "CHEQUE",
];

export default function AyudanteForm({ onSubmit }: AyudanteFormProps) {
  const [ayudanteNombre, setAyudanteNombre] = useState("");
  const [horasTrabajadas, setHorasTrabajadas] = useState(0);
  const [valorHora, setValorHora] = useState(4500);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("EFECTIVO");
  const [comprobanteUrl, setComprobanteUrl] = useState("");

  const montoCalculado = useMemo(() => {
    return horasTrabajadas * valorHora;
  }, [horasTrabajadas, valorHora]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!ayudanteNombre.trim() || horasTrabajadas <= 0 || valorHora <= 0) {
      alert("Completá nombre, horas y valor hora válido.");
      return;
    }

    onSubmit({
      ayudanteNombre,
      horasTrabajadas,
      valorHora,
      metodoPago,
      comprobanteUrl,
    });

    setAyudanteNombre("");
    setHorasTrabajadas(0);
    setValorHora(4500);
    setMetodoPago("EFECTIVO");
    setComprobanteUrl("");
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
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
          placeholder="Ej: 6"
        />
      </div>

      <div className="form-field">
        <label>Valor hora</label>
        <input
          type="number"
          value={valorHora}
          onChange={(e) => setValorHora(Number(e.target.value))}
          placeholder="Ej: 4500"
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
          placeholder="Ej: link, nro. de transferencia o referencia interna"
        />
      </div>

      <article className="card">
        <div className="card-label">Monto calculado</div>
        <div className="card-value">
          ${montoCalculado.toLocaleString("es-AR")}
        </div>
        <div className="card-note">Horas x valor hora</div>
      </article>

      <button className="primary-button" type="submit">
        Registrar pago
      </button>
    </form>
  );
}