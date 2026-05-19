import type { GastoVehiculo } from "../domain/vehiculo";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getGastosVehiculo(): GastoVehiculo[] {
  return loadData<GastoVehiculo[]>(STORAGE_KEYS.VEHICULO_GASTOS, []);
}

export function saveGastoVehiculo(gasto: GastoVehiculo): GastoVehiculo[] {
  const gastos = getGastosVehiculo();
  const actualizados = [gasto, ...gastos];

  saveData(STORAGE_KEYS.VEHICULO_GASTOS, actualizados);

  return actualizados;
}

export function deleteGastoVehiculo(id: string): GastoVehiculo[] {
  const gastos = getGastosVehiculo();
  const actualizados = gastos.filter((gasto) => gasto.id !== id);

  saveData(STORAGE_KEYS.VEHICULO_GASTOS, actualizados);

  return actualizados;
}