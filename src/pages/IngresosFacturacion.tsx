import IngresosTable from "../components/ingresos/IngresosTable";
import ConfirmModal from "../components/ui/ConfirmModal";
import Toast from "../components/ui/Toast";
import { useIngresos } from "../hooks/useIngresos";
import { useToast } from "../hooks/useToast";
import { formatCurrency } from "../utils/currency";
import { useState } from "react";

export default function IngresosFacturacion() {
  const { ingresos, eliminarIngreso } = useIngresos();
  const { message, type, showToast, clearToast } = useToast();

  const [ingresoAEliminar, setIngresoAEliminar] = useState<string | null>(null);

  const totalBruto = ingresos.reduce(
    (total, ingreso) => total + ingreso.monto,
    0
  );

  const totalComisiones = ingresos.reduce(
    (total, ingreso) => total + ingreso.comision,
    0
  );

  const totalRetenciones = ingresos.reduce(
    (total, ingreso) => total + ingreso.retencion,
    0
  );

  const totalNeto = ingresos.reduce(
    (total, ingreso) => total + ingreso.montoNeto,
    0
  );

  function confirmarEliminacion() {
    if (!ingresoAEliminar) return;

    try {
      eliminarIngreso(ingresoAEliminar);

      showToast("Cobro eliminado correctamente.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el cobro.",
        "error"
      );
    } finally {
      setIngresoAEliminar(null);
    }
  }

  function cancelarEliminacion() {
    setIngresoAEliminar(null);
  }

  return (
    <>
      <h1 className="page-title">Cobros</h1>

      <p className="page-description">
        Historial de cobros registrados desde facturas emitidas. La carga de
        nuevos cobros se realiza desde el módulo Facturación.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Cobros brutos</div>
          <div className="card-value">{formatCurrency(totalBruto)}</div>
          <div className="card-note">Total cobrado</div>
        </article>

        <article className="card">
          <div className="card-label">Comisiones</div>
          <div className="card-value">{formatCurrency(totalComisiones)}</div>
          <div className="card-note">MercadoPago y otros medios</div>
        </article>

        <article className="card">
          <div className="card-label">Retenciones</div>
          <div className="card-value">{formatCurrency(totalRetenciones)}</div>
          <div className="card-note">Bancarias o impositivas</div>
        </article>

        <article className="card">
          <div className="card-label">Neto cobrado</div>
          <div className="card-value">{formatCurrency(totalNeto)}</div>
          <div className="card-note">Ingreso disponible</div>
        </article>
      </section>

      <div style={{ marginTop: 18 }}>
        <IngresosTable
          ingresos={ingresos}
          onDelete={(id) => setIngresoAEliminar(id)}
        />
      </div>

      <Toast message={message} type={type} onClose={clearToast} />

      <ConfirmModal
        open={Boolean(ingresoAEliminar)}
        title="Eliminar cobro"
        message="Esta acción eliminará el cobro seleccionado del historial financiero. ¿Deseás continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminacion}
        onCancel={cancelarEliminacion}
      />
    </>
  );
}