import type { Cliente } from "../../domain/cliente";

type ClientesTableProps = {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
};

export default function ClientesTable({
  clientes,
  onEdit,
  onDelete,
}: ClientesTableProps) {
  if (clientes.length === 0) {
    return (
      <section className="card">
        <div className="placeholder">
          Todavía no hay clientes registrados.
        </div>
      </section>
    );
  }

  return (
    <section className="card table-card">
      <h2>Clientes registrados</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Razón social</th>
              <th>CUIT</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.razonSocial}</td>
                <td>{cliente.cuit || "-"}</td>
                <td>{cliente.contacto || "-"}</td>
                <td>{cliente.telefono || "-"}</td>
                <td>{cliente.email || "-"}</td>
                <td>{cliente.direccion || "-"}</td>
                <td>
                  <div className="action-group">
                    <button
                      className="secondary-button"
                      onClick={() => onEdit(cliente)}
                    >
                      Editar
                    </button>

                    <button
                      className="danger-button"
                      onClick={() => onDelete(cliente.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}