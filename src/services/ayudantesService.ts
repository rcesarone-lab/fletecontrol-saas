import type { PagoAyudante } from "../domain/ayudante";
import { registrarEventoAuditoria } from "./auditoriaService";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getPagosAyudantes(): PagoAyudante[] {
  return loadData<PagoAyudante[]>(STORAGE_KEYS.AYUDANTES, []);
}

export function savePagoAyudante(pago: PagoAyudante): PagoAyudante[] {
  const pagos = getPagosAyudantes();
  const actualizados = [pago, ...pagos];

  saveData(STORAGE_KEYS.AYUDANTES, actualizados);

  registrarEventoAuditoria({
    tipo: "PAGO_AYUDANTE_CREADO",
    descripcion: `Pago registrado para ayudante: ${pago.ayudanteNombre}`,
    entidad: "AYUDANTE",
    entidadId: pago.id,
  });

  return actualizados;
}

export function deletePagoAyudante(id: string): PagoAyudante[] {
  const pagos = getPagosAyudantes();

  const pagoEliminado = pagos.find((pago) => pago.id === id);

  const actualizados = pagos.filter((pago) => pago.id !== id);

  saveData(STORAGE_KEYS.AYUDANTES, actualizados);

  registrarEventoAuditoria({
    tipo: "PAGO_AYUDANTE_ELIMINADO",
    descripcion: `Pago de ayudante eliminado: ${
      pagoEliminado?.ayudanteNombre ?? "sin identificar"
    }`,
    entidad: "AYUDANTE",
    entidadId: id,
  });

  return actualizados;
}