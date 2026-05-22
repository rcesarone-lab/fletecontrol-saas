import type {
  EventoAuditoria,
  TipoEventoAuditoria,
} from "../domain/auditoria";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

const AUDITORIA_EVENT = "fletecontrol-auditoria-updated";

type RegistrarEventoInput = {
  tipo: TipoEventoAuditoria;
  descripcion: string;
  entidad?: string;
  entidadId?: string;
};

export function getEventosAuditoria(): EventoAuditoria[] {
  return loadData<EventoAuditoria[]>(STORAGE_KEYS.AUDITORIA, []);
}

export function registrarEventoAuditoria(
  input: RegistrarEventoInput
): EventoAuditoria[] {
  const eventos = getEventosAuditoria();

  const nuevoEvento: EventoAuditoria = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    tipo: input.tipo,
    descripcion: input.descripcion,
    entidad: input.entidad,
    entidadId: input.entidadId,
  };

  const actualizados = [nuevoEvento, ...eventos].slice(0, 80);

  saveData(STORAGE_KEYS.AUDITORIA, actualizados);

  window.dispatchEvent(new Event(AUDITORIA_EVENT));

  return actualizados;
}

export function limpiarAuditoria(): void {
  saveData(STORAGE_KEYS.AUDITORIA, []);
  window.dispatchEvent(new Event(AUDITORIA_EVENT));
}

export function getAuditoriaEventName() {
  return AUDITORIA_EVENT;
}