import type { Ingreso } from "../domain/ingreso";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getIngresos(): Ingreso[] {
  return loadData<Ingreso[]>(STORAGE_KEYS.INGRESOS, []);
}

export function saveIngreso(ingreso: Ingreso): Ingreso[] {
  const ingresos = getIngresos();

  const actualizados = [ingreso, ...ingresos];

  saveData(STORAGE_KEYS.INGRESOS, actualizados);

  return actualizados;
}

export function deleteIngreso(id: string): Ingreso[] {
  const ingresos = getIngresos();

  const actualizados = ingresos.filter(
    (ingreso) => ingreso.id !== id
  );

  saveData(STORAGE_KEYS.INGRESOS, actualizados);

  return actualizados;
}