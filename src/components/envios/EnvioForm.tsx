import { type FormEvent, useState } from "react";

type EnvioFormProps = {
  onSubmit: (data: {
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
};

export default function EnvioForm({ onSubmit }: EnvioFormProps) {
  const [empresaCliente, setEmpresaCliente] = useState("");
  const [materiales, setMateriales] = useState("");
  const [direccionDestino, setDireccionDestino] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("Buenos Aires");
  const [tarifaGremial, setTarifaGremial] = useState(35000);
  const [tarifaContratante, setTarifaContratante] = useState(0);
  const [costoEstimado, setCostoEstimado] = useState(0);
  const [observaciones, setObservaciones] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!empresaCliente.trim() || !materiales.trim() || !direccionDestino.trim()) {
      alert("Completá empresa, materiales y destino.");
      return;
    }

    onSubmit({
      empresaCliente,
      materiales,
      direccionDestino,
      localidad,
      provincia,
      tarifaGremial,
      tarifaContratante,
      costoEstimado,
      observaciones,
    });

    setEmpresaCliente("");
    setMateriales("");
    setDireccionDestino("");
    setLocalidad("");
    setProvincia("Buenos Aires");
    setTarifaGremial(35000);
    setTarifaContratante(0);
    setCostoEstimado(0);
    setObservaciones("");
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Empresa solicitante</label>
        <input
          value={empresaCliente}
          onChange={(e) => setEmpresaCliente(e.target.value)}
          placeholder="Ej: Empresa ABC"
        />
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
          onChange={(e) => setTarifaGremial(Number(e.target.value))}
        />
      </div>

      <div className="form-field">
        <label>Tarifa contratante</label>
        <input
          type="number"
          value={tarifaContratante}
          onChange={(e) => setTarifaContratante(Number(e.target.value))}
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