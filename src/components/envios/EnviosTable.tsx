import type { Envio, EstadoEnvio } from "../../domain/envio";
import ComparativoTarifa from "./ComparativoTarifa";

type EnviosTableProps = {
  envios: Envio[];
  onChangeEstado: (id: string, estado: EstadoEnvio) => void;
  onDelete: (id: string) => void;
};

const estados: EstadoEnvio[] = [
  "PENDIENTE",
  "EN_TRANSITO",
  "ENTREGADO",
  "COBRADO",
  "CANCELADO",
];

export default function EnviosTable({
  envios,
  onChangeEstado,
  onDelete,
}: EnviosTableProps) {
  if (envios.length === 0) {
    return (
      <section className="card">
        <div className="placeholder">
          Todavía no hay envíos registrados.
        </div>
      </section>
    );
  }

  return (
    <section className="card table-card">
      <h2>Envíos registrados</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Empresa</th>
              <th>Destino</th>
              <th>Materiales</th>
              <th>Estado</th>
              <th>Tarifas</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {envios.map((envio) => (
              <tr key={envio.id}>
                <td>{envio.fecha}</td>

                <td>{envio.empresaCliente}</td>

                <td>
                  {envio.direccionDestino}
                  <br />
                  <span className="muted">
                    {envio.localidad}, {envio.provincia}
                  </span>
                </td>

                <td>{envio.materiales}</td>

                <td>
                  <select
                    value={envio.estado}
                    onChange={(e) =>
                      onChangeEstado(envio.id, e.target.value as EstadoEnvio)
                    }
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <ComparativoTarifa
                    tarifaGremial={envio.tarifaGremial}
                    tarifaContratante={envio.tarifaContratante}
                    costoEstimado={envio.costoEstimado}
                  />
                </td>

                <td>
                  <button
                    className="danger-button"
                    onClick={() => onDelete(envio.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}