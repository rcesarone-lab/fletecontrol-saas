import IngresoForm from "../components/ingresos/IngresoForm";

import IngresosTable from "../components/ingresos/IngresosTable";

import Toast from "../components/ui/Toast";

import { useIngresos } from "../hooks/useIngresos";

import { useToast } from "../hooks/useToast";

import { formatCurrency } from "../utils/currency";

export default function IngresosFacturacion() {
  const {
    ingresos,
    agregarIngreso,
    eliminarIngreso,
  } = useIngresos();

  const { message, type, showToast, clearToast } =
    useToast();

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

  return (
    <>
      <h1 className="page-title">
        Ingresos y Facturación
      </h1>

      <p className="page-description">
        Control de cobros, conciliación financiera y
        facturación simulada.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">
            Ingresos brutos
          </div>

          <div className="card-value">
            {formatCurrency(totalBruto)}
          </div>

          <div className="card-note">
            Total facturado
          </div>
        </article>

        <article className="card">
          <div className="card-label">
            Comisiones
          </div>

          <div className="card-value">
            {formatCurrency(totalComisiones)}
          </div>

          <div className="card-note">
            MercadoPago y otros
          </div>
        </article>

        <article className="card">
          <div className="card-label">
            Retenciones
          </div>

          <div className="card-value">
            {formatCurrency(totalRetenciones)}
          </div>

          <div className="card-note">
            Bancarias o impositivas
          </div>
        </article>

        <article className="card">
          <div className="card-label">
            Neto real
          </div>

          <div className="card-value">
            {formatCurrency(totalNeto)}
          </div>

          <div className="card-note">
            Ingreso disponible
          </div>
        </article>
      </section>

      <div style={{ marginTop: 18 }}>
        <IngresoForm
          onSubmit={agregarIngreso}
          onError={(msg) =>
            showToast(msg, "error")
          }
          onSuccess={(msg) =>
            showToast(msg, "success")
          }
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <IngresosTable
          ingresos={ingresos}
          onDelete={eliminarIngreso}
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