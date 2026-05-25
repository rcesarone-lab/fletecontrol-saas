import { type FormEvent, useEffect, useState } from "react";
import type { Cliente } from "../../domain/cliente";
import type { Envio } from "../../domain/envio";
import { useConfiguracion } from "../../hooks/useConfiguracion";

type EnvioFormProps = {
  clientes: Cliente[];

  envioEditando?: Envio | null;

  onCancelEdit?: () => void;

  onSubmit: (data: {
    clienteId: string;
    empresaCliente: string;
    materiales: string;
    direccionDestino: string;
    localidad: string;
    provincia: string;
    tarifaReferenciaMercado: number;
    tarifaContratante: number;
    costoEstimado: number;
    observaciones?: string;
    fecha?: string;
  }) => void;

  onError: (message: string) => void;

  onSuccess: (message: string) => void;
};

export default function EnvioForm({
  clientes,
  envioEditando,
  onCancelEdit,
  onSubmit,
  onError,
  onSuccess,
}: EnvioFormProps) {
  const { configuracion } = useConfiguracion();

  const tarifaMinimaGremialBase =
    configuracion?.tarifas.tarifaReferenciaMercadoDefault ?? 0;

  const [clienteId, setClienteId] = useState("");
  const [materiales, setMateriales] = useState("");
  const [direccionDestino, setDireccionDestino] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("Buenos Aires");

  const [tarifaReferenciaMercado, setTarifaReferenciaMercado] =
    useState(tarifaMinimaGremialBase);

  const [tarifaContratante, setTarifaContratante] = useState(0);

  const [costoEstimado, setCostoEstimado] = useState(0);

  const [observaciones, setObservaciones] = useState("");

  const estaEditando = Boolean(envioEditando);

  const [fecha, setFecha] = useState("");

  useEffect(() => {
    if (!envioEditando) {
      limpiarFormulario();
      return;
    }

    setClienteId(envioEditando.clienteId);
    setMateriales(envioEditando.materiales);
    setDireccionDestino(envioEditando.direccionDestino);
    setLocalidad(envioEditando.localidad);
    setProvincia(envioEditando.provincia);

    setTarifaReferenciaMercado(
      envioEditando.tarifaReferenciaMercado
    );

    setTarifaContratante(
      envioEditando.tarifaContratante
    );

    setCostoEstimado(envioEditando.costoEstimado);

    setObservaciones(
      envioEditando.observaciones ?? ""
    );
  }, [envioEditando]);

  useEffect(() => {
    if (!estaEditando) {
      setTarifaReferenciaMercado(
        tarifaMinimaGremialBase
      );
    }
  }, [tarifaMinimaGremialBase, estaEditando]);

  function limpiarFormulario() {
    setClienteId("");
    setMateriales("");
    setDireccionDestino("");
    setLocalidad("");
    setProvincia("Buenos Aires");

    setTarifaReferenciaMercado(
      tarifaMinimaGremialBase
    );

    setTarifaContratante(0);
    setCostoEstimado(0);
    setObservaciones("");
  }

  function cancelarEdicion() {
    limpiarFormulario();
    onCancelEdit?.();
  }

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
      onError(
        "La tarifa contratante debe ser mayor a cero."
      );

      return;
    }

    if (
      tarifaReferenciaMercado < 0 ||
      costoEstimado < 0
    ) {
      onError(
        "La tarifa de referencia y el costo estimado no pueden ser negativos."
      );

      return;
    }

    onSubmit({
      clienteId: clienteSeleccionado.id,
      empresaCliente:
        clienteSeleccionado.razonSocial,
      materiales,
      direccionDestino,
      localidad,
      provincia,
      tarifaReferenciaMercado,
      tarifaContratante,
      costoEstimado,
      observaciones,
      fecha,
    });

    onSuccess(
      estaEditando
        ? "Envío actualizado correctamente."
        : "Envío registrado correctamente."
    );

    if (!estaEditando) {
      limpiarFormulario();
    }
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-field full">
        <h2>
          {estaEditando
            ? "Editando envío"
            : "Registrar envío"}
        </h2>
      </div>

      <div className="form-field">
        <label>Cliente registrado</label>

        <select
          value={clienteId}
          onChange={(e) =>
            setClienteId(e.target.value)
          }
        >
          <option value="">
            Seleccionar cliente
          </option>

          {clientes.map((cliente) => (
            <option
              key={cliente.id}
              value={cliente.id}
            >
              {cliente.razonSocial}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Materiales</label>

        <input
          value={materiales}
          onChange={(e) =>
            setMateriales(e.target.value)
          }
          placeholder="Ej: cajas, repuestos, herramientas"
        />
      </div>

      <div className="form-field full">
        <label>Dirección destino</label>

        <input
          value={direccionDestino}
          onChange={(e) =>
            setDireccionDestino(e.target.value)
          }
          placeholder="Ej: Av. Siempre Viva 123"
        />
      </div>

      <div className="form-field">
        <label>Localidad</label>

        <input
          value={localidad}
          onChange={(e) =>
            setLocalidad(e.target.value)
          }
          placeholder="Ej: Caseros"
        />
      </div>

      <div className="form-field">
        <label>Provincia</label>

        <input
          value={provincia}
          onChange={(e) =>
            setProvincia(e.target.value)
          }
        />
      </div>

      <div className="form-field">
        <label>Tarifa referencia</label>

        <input
          type="number"
          value={tarifaReferenciaMercado}
          onChange={(e) =>
            setTarifaReferenciaMercado(
              Number(e.target.value)
            )
          }
        />
      </div>

      <div className="form-field">
        <label>Tarifa contratante</label>

        <input
          type="number"
          value={tarifaContratante}
          onChange={(e) =>
            setTarifaContratante(
              Number(e.target.value)
            )
          }
        />
      </div>

      <div className="form-field">
        <label>Costo estimado</label>

        <input
          type="number"
          value={costoEstimado}
          onChange={(e) =>
            setCostoEstimado(
              Number(e.target.value)
            )
          }
        />
      </div>

      <div className="form-field full">
        <label>Observaciones</label>

        <textarea
          value={observaciones}
          onChange={(e) =>
            setObservaciones(e.target.value)
          }
          placeholder="Notas internas del viaje"
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

      <button
        className="primary-button"
        type="submit"
      >
        {estaEditando
          ? "Actualizar envío"
          : "Registrar envío"}
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