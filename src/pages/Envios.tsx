import { useMemo, useRef, useState } from "react";
import type { Envio, EstadoEnvio } from "../domain/envio";

import EnvioForm from "../components/envios/EnvioForm";
import EnviosTable from "../components/envios/EnviosTable";

import ConfirmModal from "../components/ui/ConfirmModal";
import Toast from "../components/ui/Toast";

import { useClientes } from "../hooks/useClientes";
import { useEnvios } from "../hooks/useEnvios";
import { useToast } from "../hooks/useToast";

const estadosFiltro: EstadoEnvio[] = [
  "PENDIENTE",
  "EN_TRANSITO",
  "ENTREGADO",
  "FACTURADO",
  "COBRADO",
  "CANCELADO",
];

export default function Envios() {
  const { clientes } = useClientes();

  const {
    envios,
    agregarEnvio,
    actualizarEnvio,
    cambiarEstado,
    eliminarEnvio,
    refrescarEnvios,
  } = useEnvios();

  const { message, type, showToast, clearToast } = useToast();

  const [envioAEliminar, setEnvioAEliminar] = useState<string | null>(null);
  const [envioEditando, setEnvioEditando] = useState<Envio | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const [clienteFiltro, setClienteFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [desdeFiltro, setDesdeFiltro] = useState("");
  const [hastaFiltro, setHastaFiltro] = useState("");
  const [textoFiltro, setTextoFiltro] = useState("");

  const enviosFiltrados = useMemo(() => {
    const texto = textoFiltro.trim().toLowerCase();

    return envios.filter((envio) => {
      const coincideCliente =
        !clienteFiltro || envio.clienteId === clienteFiltro;

      const coincideEstado =
        !estadoFiltro || envio.estado === estadoFiltro;

      const coincideDesde =
        !desdeFiltro || envio.fecha >= desdeFiltro;

      const coincideHasta =
        !hastaFiltro || envio.fecha <= hastaFiltro;

      const coincideTexto =
        !texto ||
        envio.empresaCliente.toLowerCase().includes(texto) ||
        envio.materiales.toLowerCase().includes(texto) ||
        envio.direccionDestino.toLowerCase().includes(texto) ||
        envio.localidad.toLowerCase().includes(texto) ||
        envio.provincia.toLowerCase().includes(texto);

      return (
        coincideCliente &&
        coincideEstado &&
        coincideDesde &&
        coincideHasta &&
        coincideTexto
      );
    });
  }, [
    envios,
    clienteFiltro,
    estadoFiltro,
    desdeFiltro,
    hastaFiltro,
    textoFiltro,
  ]);

  function limpiarFiltros() {
    setClienteFiltro("");
    setEstadoFiltro("");
    setDesdeFiltro("");
    setHastaFiltro("");
    setTextoFiltro("");
  }

  function guardarEnvio(data: {
    clienteId: string;
    empresaCliente: string;
    materiales: string;
    direccionDestino: string;
    localidad: string;
    provincia: string;
    tarifaReferenciaMercado: number;
    tarifaContratante: number;
    costoEstimado: number;
    observaciones?: string;
  }) {
    if (envioEditando) {
      actualizarEnvio({
        ...envioEditando,
        ...data,
      });

      setEnvioEditando(null);
      return;
    }

    agregarEnvio(data);
  }

  function confirmarEliminacion() {
    if (!envioAEliminar) return;

    try {
      eliminarEnvio(envioAEliminar);
      showToast("Envío eliminado correctamente.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el envío.",
        "error"
      );
    } finally {
      setEnvioAEliminar(null);
    }
  }

  function cancelarEliminacion() {
    setEnvioAEliminar(null);
  }

  return (
    <>
      <h1 className="page-title">Gestión de Envíos</h1>

      <p className="page-description">
        Registro operativo de viajes, materiales transportados y control de
        tarifas.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Total envíos</div>
          <div className="card-value">{envios.length}</div>
          <div className="card-note">Operaciones registradas</div>
        </article>

        <article className="card">
          <div className="card-label">Pendientes</div>
          <div className="card-value">
            {envios.filter((envio) => envio.estado === "PENDIENTE").length}
          </div>
          <div className="card-note">Esperando salida</div>
        </article>

        <article className="card">
          <div className="card-label">Facturados</div>
          <div className="card-value">
            {envios.filter((envio) => envio.estado === "FACTURADO").length}
          </div>
          <div className="card-note">Pendientes de cobro</div>
        </article>

        <article className="card">
          <div className="card-label">Cobrados</div>
          <div className="card-value">
            {envios.filter((envio) => envio.estado === "COBRADO").length}
          </div>
          <div className="card-note">Operaciones cerradas</div>
        </article>
      </section>


      <div ref={formRef} style={{ marginTop: 18 }}>
        <EnvioForm
          clientes={clientes}
          envioEditando={envioEditando}
          onCancelEdit={() => setEnvioEditando(null)}
          onSubmit={guardarEnvio}
          onError={(msg) => showToast(msg, "error")}
          onSuccess={(msg) => showToast(msg, "success")}
        />
      </div>

      <section className="card" style={{ marginTop: 18 }}>
        <h2>Filtros de envíos</h2>

        <div className="form-grid compact-filters">
          <div className="form-field">
            <label>Cliente</label>
            <select
              value={clienteFiltro}
              onChange={(e) => setClienteFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.razonSocial}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Estado</label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              {estadosFiltro.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Fecha Desde</label>
            <input
              type="date"
              value={desdeFiltro}
              onChange={(e) => setDesdeFiltro(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Fecha Hasta</label>
            <input
              type="date"
              value={hastaFiltro}
              onChange={(e) => setHastaFiltro(e.target.value)}
            />
          </div>

          <div className="form-field full">
            <label>Texto libre</label>
            <input
              value={textoFiltro}
              onChange={(e) => setTextoFiltro(e.target.value)}
              placeholder="Buscar por cliente, destino o materiales..."
            />
          </div>

          <button className="secondary-button" type="button" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </section>

      <div style={{ marginTop: 18 }}>
        <EnviosTable
          envios={enviosFiltrados}
          onEdit={(envio) => {
            setEnvioEditando(envio);

            setTimeout(() => {
              formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });

              const firstInput = formRef.current?.querySelector(
                "input, select, textarea"
              ) as HTMLElement | null;

              firstInput?.focus();
            }, 0);
          }}
          onChangeEstado={(id, estado) => {
            try {
              cambiarEstado(id, estado);
              showToast("Estado actualizado correctamente.", "success");
            } catch (error) {
              showToast(
                error instanceof Error
                  ? error.message
                  : "No se pudo actualizar el estado.",
                "error"
              );
              refrescarEnvios();
            }
          }}
          onDelete={(id) => setEnvioAEliminar(id)}
        />
      </div>

      <Toast message={message} type={type} onClose={clearToast} />

      <ConfirmModal
        open={Boolean(envioAEliminar)}
        title="Eliminar envío"
        message="Esta acción eliminará el envío seleccionado. Si tiene facturas asociadas, no podrá eliminarse. ¿Deseás continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminacion}
        onCancel={cancelarEliminacion}
      />
    </>
  );
}