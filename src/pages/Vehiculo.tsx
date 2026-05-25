import { useRef, useState } from "react";

import GastoVehiculoForm from "../components/vehiculo/GastoVehiculoForm";
import GastosVehiculoTable from "../components/vehiculo/GastosVehiculoTable";

import ConfirmModal from "../components/ui/ConfirmModal";
import Toast from "../components/ui/Toast";

import type { GastoVehiculo } from "../domain/vehiculo";
import { useToast } from "../hooks/useToast";
import { useVehiculo } from "../hooks/useVehiculo";

import { formatCurrency } from "../utils/currency";

export default function Vehiculo() {
  const { gastos, agregarGasto, actualizarGasto, eliminarGasto } =
    useVehiculo();

  const { message, type, showToast, clearToast } = useToast();

  const [gastoAEliminar, setGastoAEliminar] = useState<string | null>(null);
  const [gastoEditando, setGastoEditando] = useState<GastoVehiculo | null>(
    null
  );

  const formRef = useRef<HTMLDivElement | null>(null);

  const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);

  const combustible = gastos
    .filter((gasto) => gasto.tipo === "COMBUSTIBLE")
    .reduce((total, gasto) => total + gasto.monto, 0);

  const mantenimiento = gastos
    .filter((gasto) => gasto.tipo === "MANTENIMIENTO")
    .reduce((total, gasto) => total + gasto.monto, 0);

  function guardarGasto(data: {
    tipo: GastoVehiculo["tipo"];
    descripcion: string;
    monto: number;
    vencimiento?: string;
  }) {
    if (gastoEditando) {
      actualizarGasto({
        ...gastoEditando,
        ...data,
      });

      setGastoEditando(null);
      return;
    }

    agregarGasto(data);
  }

  function editarGasto(gasto: GastoVehiculo) {
    setGastoEditando(gasto);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);

    setTimeout(() => {
      const firstInput = formRef.current?.querySelector(
        "select, input, textarea"
      ) as HTMLElement | null;

      firstInput?.focus({ preventScroll: true });
    }, 350);
  }

  function confirmarEliminacion() {
    if (!gastoAEliminar) return;

    eliminarGasto(gastoAEliminar);
    setGastoAEliminar(null);
    showToast("Gasto eliminado correctamente.", "success");
  }

  function cancelarEliminacion() {
    setGastoAEliminar(null);
  }

  return (
    <>
      <h1 className="page-title">Vehículo y Gastos</h1>

      <p className="page-description">
        Control operativo del vehículo, mantenimiento y costos asociados.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Total gastos</div>
          <div className="card-value">{formatCurrency(totalGastos)}</div>
          <div className="card-note">Histórico registrado</div>
        </article>

        <article className="card">
          <div className="card-label">Combustible</div>
          <div className="card-value">{formatCurrency(combustible)}</div>
          <div className="card-note">Consumo operativo</div>
        </article>

        <article className="card">
          <div className="card-label">Mantenimiento</div>
          <div className="card-value">{formatCurrency(mantenimiento)}</div>
          <div className="card-note">Servicios y reparaciones</div>
        </article>

        <article className="card">
          <div className="card-label">Registros</div>
          <div className="card-value">{gastos.length}</div>
          <div className="card-note">Movimientos cargados</div>
        </article>
      </section>

      <div ref={formRef} style={{ marginTop: 18 }}>
        <GastoVehiculoForm
          gastoEditando={gastoEditando}
          onSubmit={guardarGasto}
          onCancelEdit={() => setGastoEditando(null)}
          onError={(msg) => showToast(msg, "error")}
          onSuccess={(msg) => showToast(msg, "success")}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <GastosVehiculoTable
          gastos={gastos}
          onEdit={editarGasto}
          onDelete={(id) => setGastoAEliminar(id)}
        />
      </div>

      <Toast message={message} type={type} onClose={clearToast} />

      <ConfirmModal
        open={Boolean(gastoAEliminar)}
        title="Eliminar gasto"
        message="Esta acción eliminará el gasto seleccionado del histórico operativo. ¿Deseás continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminacion}
        onCancel={cancelarEliminacion}
      />
    </>
  );
}