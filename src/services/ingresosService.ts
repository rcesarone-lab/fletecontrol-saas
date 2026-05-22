import type { Ingreso } from "../domain/ingreso";
import { registrarEventoAuditoria } from "./auditoriaService";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getIngresos(): Ingreso[] {
  return loadData<Ingreso[]>(STORAGE_KEYS.INGRESOS, []);
}

export function saveIngreso(ingreso: Ingreso): Ingreso[] {
  const ingresos = getIngresos();
  const actualizados = [ingreso, ...ingresos];

  saveData(STORAGE_KEYS.INGRESOS, actualizados);

  registrarEventoAuditoria({
    tipo: "INGRESO_CREADO",
    descripcion: `Ingreso registrado para ${ingreso.cliente}`,
    entidad: "INGRESO",
    entidadId: ingreso.id,
  });

  return actualizados;
}

export function deleteIngreso(id: string): Ingreso[] {
  const ingresos = getIngresos();

  const ingresoEliminado = ingresos.find((ingreso) => ingreso.id === id);

  const actualizados = ingresos.filter((ingreso) => ingreso.id !== id);

  saveData(STORAGE_KEYS.INGRESOS, actualizados);

  registrarEventoAuditoria({
    tipo: "INGRESO_ELIMINADO",
    descripcion: `Ingreso eliminado: ${
      ingresoEliminado?.cliente ?? "sin cliente"
    }`,
    entidad: "INGRESO",
    entidadId: id,
  });

  return actualizados;
}