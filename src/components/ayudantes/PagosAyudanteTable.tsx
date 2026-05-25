import type { PagoAyudante } from "../../domain/ayudante";
import { formatCurrency } from "../../utils/currency";

type PagosAyudanteTableProps = {
  pagos: PagoAyudante[];
  onEdit: (pago: PagoAyudante) => void;
  onDelete: (id: string) => void;
};

export default function PagosAyudanteTable({
  pagos,
  onEdit,
  onDelete,
}: PagosAyudanteTableProps) {
  if (pagos.length === 0) {
    return (
      <section className="card">
        <div className="placeholder">
          Todavía no hay pagos de ayudantes registrados.
        </div>
      </section>
    );
  }

  return (
    <section className="card table-card">
      <h2>Pagos registrados</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ayudante</th>
              <th>Horas</th>
              <th>Valor hora</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Comprobante</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.fecha}</td>
                <td>{pago.ayudanteNombre}</td>
                <td>{pago.horasTrabajadas}</td>
                <td>{formatCurrency(pago.valorHora)}</td>
                <td>{formatCurrency(pago.monto)}</td>
                <td>{pago.metodoPago}</td>
                <td>{pago.comprobanteUrl || "-"}</td>
                <td>
                  <div className="action-group">
                    <button
                      className="secondary-button"
                      onClick={() => onEdit(pago)}
                    >
                      Editar
                    </button>

                    <button
                      className="danger-button"
                      onClick={() => onDelete(pago.id)}
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