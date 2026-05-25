import { useMemo, useRef, useState } from "react";

import IngresosTable from "../components/ingresos/IngresosTable";
import IngresoEditForm from "../components/ingresos/IngresoEditForm";

import ConfirmModal from "../components/ui/ConfirmModal";
import Toast from "../components/ui/Toast";

import type { Ingreso, MetodoCobro } from "../domain/ingreso";

import { useIngresos } from "../hooks/useIngresos";
import { useToast } from "../hooks/useToast";
import { useClientes } from "../hooks/useClientes";

import { formatCurrency } from "../utils/currency";

const metodosCobro: MetodoCobro[] = [
  "EFECTIVO",
  "TRANSFERENCIA",
  "MERCADOPAGO",
  "CHEQUE",
];

export default function IngresosFacturacion() {
  const {
    ingresos,
    eliminarIngreso,
    actualizarIngresoAdministrativo,
  } = useIngresos();

  const { clientes } = useClientes();

  const {
    message,
    type,
    showToast,
    clearToast,
  } = useToast();

  const [ingresoAEliminar, setIngresoAEliminar] =
    useState<string | null>(null);

  const [ingresoEditando, setIngresoEditando] =
    useState<Ingreso | null>(null);

  const editFormRef =
    useRef<HTMLDivElement | null>(null);

  const [clienteFiltro, setClienteFiltro] =
    useState("");

  const [metodoFiltro, setMetodoFiltro] =
    useState("");

  const [desdeFiltro, setDesdeFiltro] =
    useState("");

  const [hastaFiltro, setHastaFiltro] =
    useState("");

  const [textoFiltro, setTextoFiltro] =
    useState("");

  const ingresosFiltrados = useMemo(() => {
    const texto =
      textoFiltro.trim().toLowerCase();

    return ingresos.filter((ingreso) => {
      const coincideCliente =
        !clienteFiltro ||
        ingreso.clienteId === clienteFiltro;

      const coincideMetodo =
        !metodoFiltro ||
        ingreso.metodoCobro === metodoFiltro;

      const coincideDesde =
        !desdeFiltro ||
        ingreso.fecha >= desdeFiltro;

      const coincideHasta =
        !hastaFiltro ||
        ingreso.fecha <= hastaFiltro;

      const coincideTexto =
        !texto ||
        ingreso.cliente
          .toLowerCase()
          .includes(texto) ||
        ingreso.concepto
          .toLowerCase()
          .includes(texto) ||
        ingreso.referenciaOperacion
          ?.toLowerCase()
          .includes(texto) ||
        ingreso.observaciones
          ?.toLowerCase()
          .includes(texto);

      return (
        coincideCliente &&
        coincideMetodo &&
        coincideDesde &&
        coincideHasta &&
        coincideTexto
      );
    });
  }, [
    ingresos,
    clienteFiltro,
    metodoFiltro,
    desdeFiltro,
    hastaFiltro,
    textoFiltro,
  ]);

  const totalBruto =
    ingresosFiltrados.reduce(
      (total, ingreso) =>
        total + ingreso.monto,
      0
    );

  const totalComisiones =
    ingresosFiltrados.reduce(
      (total, ingreso) =>
        total + ingreso.comision,
      0
    );

  const totalRetenciones =
    ingresosFiltrados.reduce(
      (total, ingreso) =>
        total + ingreso.retencion,
      0
    );

  const totalNeto =
    ingresosFiltrados.reduce(
      (total, ingreso) =>
        total + ingreso.montoNeto,
      0
    );

  function confirmarEliminacion() {
    if (!ingresoAEliminar) return;

    try {
      eliminarIngreso(ingresoAEliminar);

      showToast(
        "Cobro eliminado correctamente.",
        "success"
      );
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
      <h1 className="page-title">
        Cobros
      </h1>

      <p className="page-description">
        Historial de cobros registrados
        desde facturas emitidas.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">
            Cobros brutos
          </div>

          <div className="card-value">
            {formatCurrency(totalBruto)}
          </div>

          <div className="card-note">
            Total cobrado
          </div>
        </article>

        <article className="card">
          <div className="card-label">
            Comisiones
          </div>

          <div className="card-value">
            {formatCurrency(
              totalComisiones
            )}
          </div>

          <div className="card-note">
            MercadoPago y otros medios
          </div>
        </article>

        <article className="card">
          <div className="card-label">
            Retenciones
          </div>

          <div className="card-value">
            {formatCurrency(
              totalRetenciones
            )}
          </div>

          <div className="card-note">
            Bancarias o impositivas
          </div>
        </article>

        <article className="card">
          <div className="card-label">
            Neto cobrado
          </div>

          <div className="card-value">
            {formatCurrency(totalNeto)}
          </div>

          <div className="card-note">
            Ingreso disponible
          </div>
        </article>
      </section>

      <section
        className="card"
        style={{ marginTop: 18 }}
      >
        <div className="section-header">
          <div>
            <h2>
              Filtros de cobranza
            </h2>

            <p className="card-note">
              Filtrá cobros por cliente,
              método, fecha o texto.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>Cliente</label>

            <select
              value={clienteFiltro}
              onChange={(e) =>
                setClienteFiltro(
                  e.target.value
                )
              }
            >
              <option value="">
                Todos
              </option>

              {clientes.map(
                (cliente) => (
                  <option
                    key={cliente.id}
                    value={cliente.id}
                  >
                    {
                      cliente.razonSocial
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div className="form-field">
            <label>Método</label>

            <select
              value={metodoFiltro}
              onChange={(e) =>
                setMetodoFiltro(
                  e.target.value
                )
              }
            >
              <option value="">
                Todos
              </option>

              {metodosCobro.map(
                (metodo) => (
                  <option
                    key={metodo}
                    value={metodo}
                  >
                    {metodo}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="form-field">
            <label>Desde</label>

            <input
              type="date"
              value={desdeFiltro}
              onChange={(e) =>
                setDesdeFiltro(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-field">
            <label>Hasta</label>

            <input
              type="date"
              value={hastaFiltro}
              onChange={(e) =>
                setHastaFiltro(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-field full">
            <label>
              Búsqueda textual
            </label>

            <input
              value={textoFiltro}
              onChange={(e) =>
                setTextoFiltro(
                  e.target.value
                )
              }
              placeholder="Cliente, referencia, concepto u observaciones"
            />
          </div>
        </div>
      </section>

      {ingresoEditando && (
        <div
          ref={editFormRef}
          style={{ marginTop: 18 }}
        >
          <IngresoEditForm
            ingresoEditando={
              ingresoEditando
            }
            onCancel={() =>
              setIngresoEditando(null)
            }
            onSubmit={(data) => {
              actualizarIngresoAdministrativo(
                data
              );

              showToast(
                "Cobro actualizado correctamente.",
                "success"
              );

              setIngresoEditando(null);
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <IngresosTable
          ingresos={ingresosFiltrados}
          onEdit={(ingreso) => {
            setIngresoEditando(
              ingreso
            );

            setTimeout(() => {
              editFormRef.current?.scrollIntoView(
                {
                  behavior: "smooth",
                  block: "start",
                }
              );

              const firstInput =
                editFormRef.current?.querySelector(
                  "input, select, textarea"
                ) as HTMLElement | null;

              firstInput?.focus();
            }, 0);
          }}
          onDelete={(id) =>
            setIngresoAEliminar(id)
          }
        />
      </div>

      <Toast
        message={message}
        type={type}
        onClose={clearToast}
      />

      <ConfirmModal
        open={Boolean(
          ingresoAEliminar
        )}
        title="Eliminar cobro"
        message="Esta acción eliminará el cobro seleccionado del historial financiero. ¿Deseás continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={
          confirmarEliminacion
        }
        onCancel={
          cancelarEliminacion
        }
      />
    </>
  );
}