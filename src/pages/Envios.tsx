import { useState } from "react";

import EnvioForm from "../components/envios/EnvioForm";
import EnviosTable from "../components/envios/EnviosTable";

import ConfirmModal from "../components/ui/ConfirmModal";
import Toast from "../components/ui/Toast";

import { useClientes } from "../hooks/useClientes";
import { useEnvios } from "../hooks/useEnvios";
import { useToast } from "../hooks/useToast";

export default function Envios() {
  const { clientes } = useClientes();

  const {
    envios,
    agregarEnvio,
    cambiarEstado,
    eliminarEnvio,
  } = useEnvios();

  const {
    message,
    type,
    showToast,
    clearToast,
  } = useToast();

  const [envioAEliminar, setEnvioAEliminar] =
    useState<string | null>(null);

  function confirmarEliminacion() {
    if (!envioAEliminar) return;

    eliminarEnvio(envioAEliminar);

    setEnvioAEliminar(null);

    showToast(
      "Envío eliminado correctamente.",
      "success"
    );
  }

  function cancelarEliminacion() {
    setEnvioAEliminar(null);
  }

  return (
    <>
      <h1 className="page-title">
        Gestión de Envíos
      </h1>

      <p className="page-description">
        Registro operativo de viajes,
        materiales transportados y control
        de tarifas.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">
            Total envíos
          </div>

          <div className="card-value">
            {envios.length}
          </div>

          <div className="card-note">
            Operaciones registradas
          </div>
        </article>

        <article className="card">
          <div className="card-label">
            Pendientes
          </div>

          <div className="card-value">
            {
              envios.filter(
                (envio) =>
                  envio.estado ===
                  "PENDIENTE"
              ).length
            }
          </div>

          <div className="card-note">
            Esperando salida
          </div>
        </article>

        <article className="card">
          <div className="card-label">
            En tránsito
          </div>

          <div className="card-value">
            {
              envios.filter(
                (envio) =>
                  envio.estado ===
                  "EN_TRANSITO"
              ).length
            }
          </div>

          <div className="card-note">
            Viajes activos
          </div>
        </article>

        <article className="card">
          <div className="card-label">
            Cobrados
          </div>

          <div className="card-value">
            {
              envios.filter(
                (envio) =>
                  envio.estado ===
                  "COBRADO"
              ).length
            }
          </div>

          <div className="card-note">
            Operaciones cerradas
          </div>
        </article>
      </section>

      <div style={{ marginTop: 18 }}>
        <EnvioForm
          clientes={clientes}
          onSubmit={agregarEnvio}
          onError={(msg) =>
            showToast(msg, "error")
          }
          onSuccess={(msg) =>
            showToast(msg, "success")
          }
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <EnviosTable
          envios={envios}
          onChangeEstado={cambiarEstado}
          onDelete={(id) =>
            setEnvioAEliminar(id)
          }
        />
      </div>

      <Toast
        message={message}
        type={type}
        onClose={clearToast}
      />

      <ConfirmModal
        open={Boolean(envioAEliminar)}
        title="Eliminar envío"
        message="Esta acción eliminará el envío seleccionado. Si tiene ingresos o facturas asociadas, podrían quedar registros históricos inconsistentes. ¿Deseás continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminacion}
        onCancel={cancelarEliminacion}
      />
    </>
  );
}