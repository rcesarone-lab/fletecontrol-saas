import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { MetodoPago } from "../../domain/ayudante";

import { useConfiguracion } from "../../hooks/useConfiguracion";

type AyudanteFormProps = {
  onSubmit: (data: {
    ayudanteNombre: string;
    horasTrabajadas: number;
    valorHora: number;
    metodoPago: MetodoPago;
    comprobanteUrl?: string;
  }) => void;

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
  onSubmit,
  onError,
  onSuccess,
}: AyudanteFormProps) {
  const { configuracion } = useConfiguracion();

  const valorHoraBase =
    configuracion?.ayudantes
      .valorHoraDefault ?? 4500;

  const [ayudanteNombre, setAyudanteNombre] =
    useState("");

  const [horasTrabajadas, setHorasTrabajadas] =
    useState(0);

  const [valorHora, setValorHora] =
    useState(valorHoraBase);

  const [metodoPago, setMetodoPago] =
    useState<MetodoPago>("EFECTIVO");

  const [comprobanteUrl, setComprobanteUrl] =
    useState("");

  useEffect(() => {
    setValorHora(valorHoraBase);
  }, [valorHoraBase]);

  const montoCalculado = useMemo(() => {
    return horasTrabajadas * valorHora;
  }, [horasTrabajadas, valorHora]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!ayudanteNombre.trim()) {
      onError("Completá el nombre del ayudante.");
      return;
    }

    if (horasTrabajadas <= 0) {
      onError(
        "Las horas trabajadas deben ser mayores a cero."
      );
      return;
    }

    if (valorHora <= 0) {
      onError(
        "El valor hora debe ser mayor a cero."
      );
      return;
    }

    onSubmit({
      ayudanteNombre,

      horasTrabajadas,

      valorHora,

      metodoPago,

      comprobanteUrl,
    });

    onSuccess(
      "Pago de ayudante registrado correctamente."
    );

    setAyudanteNombre("");

    setHorasTrabajadas(0);

    setValorHora(valorHoraBase);

    setMetodoPago("EFECTIVO");

    setComprobanteUrl("");
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Ayudante</label>

        <input
          value={ayudanteNombre}
          onChange={(e) =>
            setAyudanteNombre(e.target.value)
          }
          placeholder="Ej: Carlos Gómez"
        />
      </div>

      <div className="form-field">
        <label>Horas trabajadas</label>

        <input
          type="number"
          value={horasTrabajadas}
          onChange={(e) =>
            setHorasTrabajadas(
              Number(e.target.value)
            )
          }
        />
      </div>

      <div className="form-field">
        <label>Valor hora</label>

        <input
          type="number"
          value={valorHora}
          onChange={(e) =>
            setValorHora(Number(e.target.value))
          }
        />
      </div>

      <div className="form-field">
        <label>Método de pago</label>

        <select
          value={metodoPago}
          onChange={(e) =>
            setMetodoPago(
              e.target.value as MetodoPago
            )
          }
        >
          {metodosPago.map((metodo) => (
            <option
              key={metodo}
              value={metodo}
            >
              {metodo}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field full">
        <label>
          Comprobante / referencia
        </label>

        <input
          value={comprobanteUrl}
          onChange={(e) =>
            setComprobanteUrl(e.target.value)
          }
          placeholder="Ej: nro transferencia o referencia"
        />
      </div>

      <article className="card">
        <div className="card-label">
          Monto calculado
        </div>

        <div className="card-value">
          $
          {montoCalculado.toLocaleString(
            "es-AR"
          )}
        </div>

        <div className="card-note">
          Horas x valor hora
        </div>
      </article>

      <button
        className="primary-button"
        type="submit"
      >
        Registrar pago
      </button>
    </form>
  );
}