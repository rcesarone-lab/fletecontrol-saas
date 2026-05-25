import { useRef, useState } from "react";

import AyudanteForm from "../components/ayudantes/AyudanteForm";
import PagosAyudanteTable from "../components/ayudantes/PagosAyudanteTable";

import ConfirmModal from "../components/ui/ConfirmModal";
import Toast from "../components/ui/Toast";

import type { PagoAyudante } from "../domain/ayudante";
import { useAyudantes } from "../hooks/useAyudantes";
import { useToast } from "../hooks/useToast";

import { formatCurrency } from "../utils/currency";

export default function Ayudantes() {
  const { pagos, agregarPago, actualizarPago, eliminarPago } = useAyudantes();

  const { message, type, showToast, clearToast } = useToast();

  const [pagoAEliminar, setPagoAEliminar] = useState<string | null>(null);
  const [pagoEditando, setPagoEditando] = useState<PagoAyudante | null>(null);

  const formRef = useRef<HTMLDivElement | null>(null);

  const totalPagado = pagos.reduce((total, pago) => total + pago.monto, 0);

  const totalHoras = pagos.reduce(
    (total, pago) => total + pago.horasTrabajadas,
    0
  );

  const pagosTransferencia = pagos.filter(
    (pago) => pago.metodoPago === "TRANSFERENCIA"
  ).length;

  const ayudantesUnicos = new Set(
    pagos.map((pago) => pago.ayudanteNombre.trim().toLowerCase())
  ).size;

  function guardarPago(data: {
    ayudanteNombre: string;
    horasTrabajadas: number;
    valorHora: number;
    metodoPago: PagoAyudante["metodoPago"];
    comprobanteUrl?: string;
  }) {
    if (pagoEditando) {
      actualizarPago({
        ...pagoEditando,
        ...data,
      });

      setPagoEditando(null);
      return;
    }

    agregarPago(data);
  }

  function editarPago(pago: PagoAyudante) {
    setPagoEditando(pago);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);

    setTimeout(() => {
      const firstInput = formRef.current?.querySelector(
        "input, select, textarea"
      ) as HTMLElement | null;

      firstInput?.focus({ preventScroll: true });
    }, 350);
  }

  function confirmarEliminacion() {
    if (!pagoAEliminar) return;

    eliminarPago(pagoAEliminar);
    setPagoAEliminar(null);
    showToast("Pago eliminado correctamente.", "success");
  }

  function cancelarEliminacion() {
    setPagoAEliminar(null);
  }

  return (
    <>
      <h1 className="page-title">Ayudantes</h1>

      <p className="page-description">
        Control de horas trabajadas, liquidación automática y pagos realizados.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Total pagado</div>
          <div className="card-value">{formatCurrency(totalPagado)}</div>
          <div className="card-note">Costo humano registrado</div>
        </article>

        <article className="card">
          <div className="card-label">Horas trabajadas</div>
          <div className="card-value">{totalHoras}</div>
          <div className="card-note">Acumulado operativo</div>
        </article>

        <article className="card">
          <div className="card-label">Ayudantes únicos</div>
          <div className="card-value">{ayudantesUnicos}</div>
          <div className="card-note">Personas registradas</div>
        </article>

        <article className="card">
          <div className="card-label">Transferencias</div>
          <div className="card-value">{pagosTransferencia}</div>
          <div className="card-note">Pagos bancarizados</div>
        </article>
      </section>

      <div ref={formRef} style={{ marginTop: 18 }}>
        <AyudanteForm
          pagoEditando={pagoEditando}
          onSubmit={guardarPago}
          onCancelEdit={() => setPagoEditando(null)}
          onError={(msg) => showToast(msg, "error")}
          onSuccess={(msg) => showToast(msg, "success")}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <PagosAyudanteTable
          pagos={pagos}
          onEdit={editarPago}
          onDelete={(id) => setPagoAEliminar(id)}
        />
      </div>

      <Toast message={message} type={type} onClose={clearToast} />

      <ConfirmModal
        open={Boolean(pagoAEliminar)}
        title="Eliminar pago"
        message="Esta acción eliminará el pago seleccionado del historial de ayudantes. ¿Deseás continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminacion}
        onCancel={cancelarEliminacion}
      />
    </>
  );
}