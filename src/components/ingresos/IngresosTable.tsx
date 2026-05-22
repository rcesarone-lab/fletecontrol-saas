import type { Ingreso } from "../../domain/ingreso";
import { formatCurrency } from "../../utils/currency";

type IngresosTableProps = {
  ingresos: Ingreso[];
  onDelete: (id: string) => void;
};

export default function IngresosTable({
  ingresos,
  onDelete,
}: IngresosTableProps) {
  if (ingresos.length === 0) {
    return (
      <section className="card">
        <div className="placeholder">
          Todavía no hay cobros registrados.
        </div>
      </section>
    );
  }

  return (
    <section className="card table-card">
      <h2>Cobros registrados</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Concepto</th>
              <th>Método</th>
              <th>Referencia</th>
              <th>Bruto</th>
              <th>Comisión</th>
              <th>Retención</th>
              <th>Neto</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {ingresos.map((ingreso) => (
              <tr key={ingreso.id}>
                <td>{ingreso.fecha}</td>
                <td>{ingreso.cliente}</td>
                <td>{ingreso.concepto}</td>
                <td>{ingreso.metodoCobro}</td>
                <td>{ingreso.referenciaOperacion || "-"}</td>
                <td>{formatCurrency(ingreso.monto)}</td>
                <td>{formatCurrency(ingreso.comision)}</td>
                <td>{formatCurrency(ingreso.retencion)}</td>
                <td>{formatCurrency(ingreso.montoNeto)}</td>
                <td>{ingreso.estado}</td>
                <td>
                  <button
                    className="danger-button"
                    onClick={() => onDelete(ingreso.id)}
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