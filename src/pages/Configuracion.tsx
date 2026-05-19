import BackupPanel from "../components/configuracion/BackupPanel";
import ConfiguracionForm from "../components/configuracion/ConfiguracionForm";
import Toast from "../components/ui/Toast";
import { useConfiguracion } from "../hooks/useConfiguracion";
import { useToast } from "../hooks/useToast";

export default function Configuracion() {
  const { configuracion, actualizarConfiguracion } = useConfiguracion();
  const { message, type, showToast, clearToast } = useToast();

  if (!configuracion) {
    return (
      <section className="card">
        <div className="placeholder">Cargando configuración...</div>
      </section>
    );
  }

  return (
    <>
      <h1 className="page-title">Configuración</h1>

      <p className="page-description">
        Parámetros generales del sistema, datos fiscales, vehículo y respaldo
        operativo.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Proyecto</div>
          <div className="card-value">{configuracion.empresa}</div>
          <div className="card-note">Nombre visible del sistema</div>
        </article>

        <article className="card">
          <div className="card-label">Monotributista</div>
          <div className="card-value">
            {configuracion.monotributista.nombre}
          </div>
          <div className="card-note">
            CUIT: {configuracion.monotributista.cuit || "Pendiente"}
          </div>
        </article>

        <article className="card">
          <div className="card-label">Vehículo</div>
          <div className="card-value">{configuracion.vehiculo.patente}</div>
          <div className="card-note">{configuracion.vehiculo.modelo}</div>
        </article>

        <article className="card">
          <div className="card-label">Punto de venta</div>
          <div className="card-value">
            {configuracion.monotributista.puntoVenta}
          </div>
          <div className="card-note">
            Categoría {configuracion.monotributista.categoria}
          </div>
        </article>
      </section>

      <div style={{ marginTop: 18 }}>
        <ConfiguracionForm
          configuracion={configuracion}
          onSubmit={actualizarConfiguracion}
          onError={(msg) => showToast(msg, "error")}
          onSuccess={(msg) => showToast(msg, "success")}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <BackupPanel />
      </div>

      <Toast message={message} type={type} onClose={clearToast} />
    </>
  );
}