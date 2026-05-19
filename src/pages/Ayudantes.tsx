import AyudanteForm from "../components/ayudantes/AyudanteForm";
import PagosAyudanteTable from "../components/ayudantes/PagosAyudanteTable";
import Toast from "../components/ui/Toast";
import { useAyudantes } from "../hooks/useAyudantes";
import { useToast } from "../hooks/useToast";
import { formatCurrency } from "../utils/currency";

export default function Ayudantes() {
  const { pagos, agregarPago, eliminarPago } = useAyudantes();

  const { message, type, showToast, clearToast } = useToast();

  const totalPagado = pagos.reduce(
    (total, pago) => total + pago.monto,
    0
  );

  const totalHoras = pagos.reduce(
    (total, pago) => total + pago.horasTrabajadas,
    0
  );

  const pagosTransferencia = pagos.filter(
    (pago) => pago.metodoPago === "TRANSFERENCIA"
  ).length;

  const ayudantesUnicos = new Set(
    pagos.map((pago) =>
      pago.ayudanteNombre.trim().toLowerCase()
    )
  ).size;

  return (
    <>
      <h1 className="page-title">Ayudantes</h1>

      <p className="page-description">
        Control de horas trabajadas, liquidación automática y pagos realizados.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Total pagado</div>

          <div className="card-value">
            {formatCurrency(totalPagado)}
          </div>

          <div className="card-note">
            Costo humano registrado
          </div>
        </article>

        <article className="card">
          <div className="card-label">Horas trabajadas</div>

          <div className="card-value">
            {totalHoras}
          </div>

          <div className="card-note">
            Acumulado operativo
          </div>
        </article>

        <article className="card">
          <div className="card-label">Ayudantes únicos</div>

          <div className="card-value">
            {ayudantesUnicos}
          </div>

          <div className="card-note">
            Personas registradas
          </div>
        </article>

        <article className="card">
          <div className="card-label">Transferencias</div>

          <div className="card-value">
            {pagosTransferencia}
          </div>

          <div className="card-note">
            Pagos bancarizados
          </div>
        </article>
      </section>

      <div style={{ marginTop: 18 }}>
        <AyudanteForm
          onSubmit={agregarPago}
          onError={(msg) => showToast(msg, "error")}
          onSuccess={(msg) => showToast(msg, "success")}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <PagosAyudanteTable
          pagos={pagos}
          onDelete={eliminarPago}
        />
      </div>

      <Toast
        message={message}
        type={type}
        onClose={clearToast}
      />
    </>
  );
}