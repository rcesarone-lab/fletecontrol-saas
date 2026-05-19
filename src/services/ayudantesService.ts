import type { PagoAyudante } from "../domain/ayudante";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getPagosAyudantes(): PagoAyudante[] {
  return loadData<PagoAyudante[]>(STORAGE_KEYS.AYUDANTES, []);
}

export function savePagoAyudante(pago: PagoAyudante): PagoAyudante[] {
  const pagos = getPagosAyudantes();
  const actualizados = [pago, ...pagos];

  saveData(STORAGE_KEYS.AYUDANTES, actualizados);

  return actualizados;
}

export function deletePagoAyudante(id: string): PagoAyudante[] {
  const pagos = getPagosAyudantes();
  const actualizados = pagos.filter((pago) => pago.id !== id);

  saveData(STORAGE_KEYS.AYUDANTES, actualizados);

  return actualizados;
}