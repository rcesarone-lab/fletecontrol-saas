import { useState } from "react";

import IngresoForm from "../components/ingresos/IngresoForm";
import IngresosTable from "../components/ingresos/IngresosTable";

import ConfirmModal from "../components/ui/ConfirmModal";
import Toast from "../components/ui/Toast";

import { useClientes } from "../hooks/useClientes";
import { useEnvios } from "../hooks/useEnvios";
import { useIngresos } from "../hooks/useIngresos";
import { useToast } from "../hooks/useToast";

import { formatCurrency } from "../utils/currency";

export default function IngresosFacturacion() {
  const { clientes } = useClientes();
  const { envios } = useEnvios();

  const { ingresos, agregarIngreso, eliminarIngreso } =
    useIngresos();

  const { message, type, showToast, clearToast } =
    useToast();

  const [ingresoAEliminar, setIngresoAEliminar] =
    useState<string | null>(null);

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

    eliminarIngreso(ingresoAEliminar);

    setIngresoAEliminar(null);

    showToast(
      "Ingreso eliminado correctamente. Si estaba asociado a un envío, el estado fue revertido.",
      "success"
    );
  }

  function cancelarEliminacion() {
    setIngresoAEliminar(null);
  }

  return (
    <>
      <h1 className="page-title">
        Ingresos y Facturación
      </h1>

      <p className="page-description">
        Control de cobros, conciliación financiera y facturación simulada.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Ingresos brutos</div>
          <div className="card-value">
            {formatCurrency(totalBruto)}
          </div>
          <div className="card-note">Total facturado</div>
        </article>

        <article className="card">
          <div className="card-label">Comisiones</div>
          <div className="card-value">
            {formatCurrency(totalComisiones)}
          </div>
          <div className="card-note">MercadoPago y otros</div>
        </article>

        <article className="card">
          <div className="card-label">Retenciones</div>
          <div className="card-value">
            {formatCurrency(totalRetenciones)}
          </div>
          <div className="card-note">Bancarias o impositivas</div>
        </article>

        <article className="card">
          <div className="card-label">Neto real</div>
          <div className="card-value">
            {formatCurrency(totalNeto)}
          </div>
          <div className="card-note">Ingreso disponible</div>
        </article>
      </section>

      {clientes.length === 0 ? (
        <section className="card" style={{ marginTop: 18 }}>
          <h2>Primero registra un cliente</h2>

          <p className="page-description">
            Para registrar ingresos o emitir una factura simulada,
            primero necesitás cargar al menos una empresa cliente en el
            módulo Clientes.
          </p>
        </section>
      ) : (
        <div style={{ marginTop: 18 }}>
          <IngresoForm
            clientes={clientes}
            envios={envios}
            onSubmit={agregarIngreso}
            onError={(msg) => showToast(msg, "error")}
            onSuccess={(msg) => showToast(msg, "success")}
          />
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <IngresosTable
          ingresos={ingresos}
          onDelete={(id) => setIngresoAEliminar(id)}
        />
      </div>

      <Toast
        message={message}
        type={type}
        onClose={clearToast}
      />

      <ConfirmModal
        open={Boolean(ingresoAEliminar)}
        title="Eliminar ingreso"
        message="Esta acción eliminará el ingreso seleccionado. Si está asociado a un envío cobrado, el envío volverá al estado ENTREGADO. ¿Deseás continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminacion}
        onCancel={cancelarEliminacion}
      />
    </>
  );
}