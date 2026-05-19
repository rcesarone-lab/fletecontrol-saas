import { type FormEvent, useEffect, useState } from "react";
import type { Cliente } from "../../domain/cliente";
import { useConfiguracion } from "../../hooks/useConfiguracion";

type EnvioFormProps = {
  clientes: Cliente[];

  onSubmit: (data: {
    clienteId: string;
    empresaCliente: string;
    materiales: string;
    direccionDestino: string;
    localidad: string;
    provincia: string;
    tarifaGremial: number;
    tarifaContratante: number;
    costoEstimado: number;
    observaciones?: string;
  }) => void;

  onError: (message: string) => void;

  onSuccess: (message: string) => void;
};

export default function EnvioForm({
  clientes,
  onSubmit,
  onError,
  onSuccess,
}: EnvioFormProps) {
  const { configuracion } = useConfiguracion();

  const tarifaMinimaGremialBase =
    configuracion?.tarifas.tarifaMinimaGremial ?? 0;

  const [clienteId, setClienteId] = useState("");
  const [materiales, setMateriales] = useState("");
  const [direccionDestino, setDireccionDestino] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("Buenos Aires");
  const [tarifaGremial, setTarifaGremial] =
    useState(tarifaMinimaGremialBase);
  const [tarifaContratante, setTarifaContratante] = useState(0);
  const [costoEstimado, setCostoEstimado] = useState(0);
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    setTarifaGremial(tarifaMinimaGremialBase);
  }, [tarifaMinimaGremialBase]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const clienteSeleccionado = clientes.find(
      (cliente) => cliente.id === clienteId
    );

    if (!clienteSeleccionado) {
      onError("Seleccioná un cliente registrado.");
      return;
    }

    if (!materiales.trim()) {
      onError("Completá los materiales.");
      return;
    }

    if (!direccionDestino.trim()) {
      onError("Completá la dirección destino.");
      return;
    }

    if (tarifaContratante <= 0) {
      onError("La tarifa contratante debe ser mayor a cero.");
      return;
    }

    if (tarifaGremial < 0 || costoEstimado < 0) {
      onError("La tarifa gremial y el costo estimado no pueden ser negativos.");
      return;
    }

    onSubmit({
      clienteId: clienteSeleccionado.id,
      empresaCliente: clienteSeleccionado.razonSocial,
      materiales,
      direccionDestino,
      localidad,
      provincia,
      tarifaGremial,
      tarifaContratante,
      costoEstimado,
      observaciones,
    });

    onSuccess("Envío registrado correctamente.");

    setClienteId("");
    setMateriales("");
    setDireccionDestino("");
    setLocalidad("");
    setProvincia("Buenos Aires");
    setTarifaGremial(tarifaMinimaGremialBase);
    setTarifaContratante(0);
    setCostoEstimado(0);
    setObservaciones("");
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Cliente registrado</label>

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">Seleccionar cliente</option>

          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.razonSocial}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Materiales</label>

        <input
          value={materiales}
          onChange={(e) => setMateriales(e.target.value)}
          placeholder="Ej: cajas, repuestos, herramientas"
        />
      </div>

      <div className="form-field full">
        <label>Dirección destino</label>

        <input
          value={direccionDestino}
          onChange={(e) => setDireccionDestino(e.target.value)}
          placeholder="Ej: Av. Siempre Viva 123"
        />
      </div>

      <div className="form-field">
        <label>Localidad</label>

        <input
          value={localidad}
          onChange={(e) => setLocalidad(e.target.value)}
          placeholder="Ej: Caseros"
        />
      </div>

      <div className="form-field">
        <label>Provincia</label>

        <input
          value={provincia}
          onChange={(e) => setProvincia(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Tarifa gremial</label>

        <input
          type="number"
          value={tarifaGremial}
          onChange={(e) =>
            setTarifaGremial(Number(e.target.value))
          }
        />
      </div>

      <div className="form-field">
        <label>Tarifa contratante</label>

        <input
          type="number"
          value={tarifaContratante}
          onChange={(e) =>
            setTarifaContratante(Number(e.target.value))
          }
        />
      </div>

      <div className="form-field">
        <label>Costo estimado</label>

        <input
          type="number"
          value={costoEstimado}
          onChange={(e) => setCostoEstimado(Number(e.target.value))}
        />
      </div>

      <div className="form-field full">
        <label>Observaciones</label>

        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Notas internas del viaje"
        />
      </div>

      <button className="primary-button" type="submit">
        Registrar envío
      </button>
    </form>
  );
}