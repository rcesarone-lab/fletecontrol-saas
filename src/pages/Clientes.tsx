import { useState } from "react";
import ClienteForm from "../components/clientes/ClienteForm";
import ClientesTable from "../components/clientes/ClientesTable";
import ConfirmModal from "../components/ui/ConfirmModal";
import Toast from "../components/ui/Toast";
import { useClientes } from "../hooks/useClientes";
import { useToast } from "../hooks/useToast";

export default function Clientes() {
  const { clientes, agregarCliente, eliminarCliente } = useClientes();
  const { message, type, showToast, clearToast } = useToast();

  const [clienteAEliminar, setClienteAEliminar] = useState<string | null>(null);

  function confirmarEliminacion() {
    if (!clienteAEliminar) return;

    try {
      eliminarCliente(clienteAEliminar);
      showToast("Cliente eliminado correctamente.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el cliente.",
        "error"
      );
    } finally {
      setClienteAEliminar(null);
    }
  }

  function cancelarEliminacion() {
    setClienteAEliminar(null);
  }

  return (
    <>
      <h1 className="page-title">Clientes</h1>

      <p className="page-description">
        Registro de empresas solicitantes, datos fiscales y contactos operativos.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Total clientes</div>
          <div className="card-value">{clientes.length}</div>
          <div className="card-note">Empresas registradas</div>
        </article>

        <article className="card">
          <div className="card-label">Con CUIT</div>
          <div className="card-value">
            {clientes.filter((cliente) => cliente.cuit?.trim()).length}
          </div>
          <div className="card-note">Listos para facturación</div>
        </article>

        <article className="card">
          <div className="card-label">Con email</div>
          <div className="card-value">
            {clientes.filter((cliente) => cliente.email?.trim()).length}
          </div>
          <div className="card-note">Contacto digital</div>
        </article>

        <article className="card">
          <div className="card-label">Pendientes datos</div>
          <div className="card-value">
            {
              clientes.filter(
                (cliente) => !cliente.cuit?.trim() || !cliente.email?.trim()
              ).length
            }
          </div>
          <div className="card-note">Requieren completar ficha</div>
        </article>
      </section>

      <div style={{ marginTop: 18 }}>
        <ClienteForm
          onSubmit={agregarCliente}
          onError={(msg) => showToast(msg, "error")}
          onSuccess={(msg) => showToast(msg, "success")}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <ClientesTable
          clientes={clientes}
          onDelete={(id) => setClienteAEliminar(id)}
        />
      </div>

      <Toast message={message} type={type} onClose={clearToast} />

      <ConfirmModal
        open={Boolean(clienteAEliminar)}
        title="Eliminar cliente"
        message="Esta acción eliminará el cliente seleccionado. Si tiene envíos o ingresos asociados, podrían quedar referencias históricas. ¿Deseás continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminacion}
        onCancel={cancelarEliminacion}
      />
    </>
  );
}