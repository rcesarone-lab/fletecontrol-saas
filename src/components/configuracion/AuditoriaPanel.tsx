import { useEffect, useState } from "react";
import type { EventoAuditoria } from "../../domain/auditoria";
import {
  getAuditoriaEventName,
  getEventosAuditoria,
  limpiarAuditoria,
} from "../../services/auditoriaService";

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleString("es-AR");
}

export default function AuditoriaPanel() {
  const [eventos, setEventos] = useState<EventoAuditoria[]>([]);

  function cargarEventos() {
    setEventos(getEventosAuditoria());
  }

  useEffect(() => {
    cargarEventos();

    const eventName = getAuditoriaEventName();

    window.addEventListener(eventName, cargarEventos);

    return () => {
      window.removeEventListener(eventName, cargarEventos);
    };
  }, []);

  function handleLimpiar() {
    limpiarAuditoria();
  }

  return (
    <section className="card table-card">
      <div className="section-header">
        <div>
          <h2>Auditoría operativa</h2>
          <p className="card-note">
            Últimos eventos registrados por el sistema.
          </p>
        </div>

        {eventos.length > 0 && (
          <button className="secondary-button" onClick={handleLimpiar}>
            Limpiar
          </button>
        )}
      </div>

      {eventos.length === 0 ? (
        <div className="placeholder">
          Todavía no hay eventos de auditoría registrados.
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Evento</th>
                <th>Descripción</th>
                <th>Entidad</th>
              </tr>
            </thead>

            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id}>
                  <td>{formatFecha(evento.fecha)}</td>
                  <td>{evento.tipo}</td>
                  <td>{evento.descripcion}</td>
                  <td>{evento.entidad || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}