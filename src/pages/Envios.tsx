import EnvioForm from "../components/envios/EnvioForm";
import EnviosTable from "../components/envios/EnviosTable";
import { useEnvios } from "../hooks/useEnvios";

export default function Envios() {
  const { envios, agregarEnvio, cambiarEstado, eliminarEnvio } = useEnvios();

  const pendientes = envios.filter((envio) => envio.estado === "PENDIENTE").length;
  const enTransito = envios.filter((envio) => envio.estado === "EN_TRANSITO").length;
  const entregados = envios.filter((envio) => envio.estado === "ENTREGADO").length;

  return (
    <>
      <h1 className="page-title">Gestión de Envíos</h1>

      <p className="page-description">
        Registro operativo de solicitudes de transporte, destinos, estados y tarifas.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Total envíos</div>
          <div className="card-value">{envios.length}</div>
          <div className="card-note">Histórico registrado</div>
        </article>

        <article className="card">
          <div className="card-label">Pendientes</div>
          <div className="card-value">{pendientes}</div>
          <div className="card-note">Aún no iniciados</div>
        </article>

        <article className="card">
          <div className="card-label">En tránsito</div>
          <div className="card-value">{enTransito}</div>
          <div className="card-note">En operación</div>
        </article>

        <article className="card">
          <div className="card-label">Entregados</div>
          <div className="card-value">{entregados}</div>
          <div className="card-note">Finalizados</div>
        </article>
      </section>

      <div style={{ marginTop: 18 }}>
        <EnvioForm onSubmit={agregarEnvio} />
      </div>

      <div style={{ marginTop: 18 }}>
        <EnviosTable
          envios={envios}
          onChangeEstado={cambiarEstado}
          onDelete={eliminarEnvio}
        />
      </div>
    </>
  );
}