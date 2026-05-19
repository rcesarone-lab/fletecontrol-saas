import BackupPanel from "../components/configuracion/BackupPanel.tsx";
import { seedConfiguracion } from "../data/seedConfiguracion";

export default function Configuracion() {
  return (
    <>
      <h1 className="page-title">Configuración</h1>

      <p className="page-description">
        Parámetros generales del sistema, configuración inicial y respaldo operativo.
      </p>

      <section className="card">
        <h2>Información del proyecto</h2>

        <div className="grid grid-2">
          <article className="card">
            <div className="card-label">Proyecto</div>
            <div className="card-value">{seedConfiguracion.empresa}</div>
          </article>

          <article className="card">
            <div className="card-label">Categoría Monotributo</div>
            <div className="card-value">
              {seedConfiguracion.monotributista.categoria}
            </div>
          </article>

          <article className="card">
            <div className="card-label">Valor Hora Ayudante</div>
            <div className="card-value">
              ${seedConfiguracion.ayudantes.valorHoraDefault}
            </div>
          </article>

          <article className="card">
            <div className="card-label">Tarifa mínima gremial</div>
            <div className="card-value">
              ${seedConfiguracion.tarifas.tarifaMinimaGremial}
            </div>
          </article>
        </div>
      </section>

      <div style={{ marginTop: 18 }}>
        <BackupPanel />
      </div>
    </>
  );
}