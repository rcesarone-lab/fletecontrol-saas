import type { GastoVehiculo } from "../../domain/vehiculo";
import { formatCurrency } from "../../utils/currency";

type GastosVehiculoTableProps = {
  gastos: GastoVehiculo[];
  onDelete: (id: string) => void;
};

export default function GastosVehiculoTable({
  gastos,
  onDelete,
}: GastosVehiculoTableProps) {
  if (gastos.length === 0) {
    return (
      <section className="card">
        <div className="placeholder">
          Todavía no hay gastos del vehículo registrados.
        </div>
      </section>
    );
  }

  return (
    <section className="card table-card">
      <h2>Gastos registrados</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Vencimiento</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {gastos.map((gasto) => (
              <tr key={gasto.id}>
                <td>{gasto.fecha}</td>
                <td>{gasto.tipo}</td>
                <td>{gasto.descripcion}</td>
                <td>{formatCurrency(gasto.monto)}</td>
                <td>{gasto.vencimiento || "-"}</td>
                <td>
                  <button
                    className="danger-button"
                    onClick={() => onDelete(gasto.id)}
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