import type { GastoVehiculo } from "../domain/vehiculo";
import { registrarEventoAuditoria } from "./auditoriaService";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getGastosVehiculo(): GastoVehiculo[] {
  return loadData<GastoVehiculo[]>(STORAGE_KEYS.VEHICULO_GASTOS, []);
}

export function saveGastoVehiculo(gasto: GastoVehiculo): GastoVehiculo[] {
  const gastos = getGastosVehiculo();
  const actualizados = [gasto, ...gastos];

  saveData(STORAGE_KEYS.VEHICULO_GASTOS, actualizados);

  registrarEventoAuditoria({
    tipo: "GASTO_VEHICULO_CREADO",
    descripcion: `Gasto de vehículo registrado: ${gasto.descripcion}`,
    entidad: "VEHICULO",
    entidadId: gasto.id,
  });

  return actualizados;
}

export function deleteGastoVehiculo(id: string): GastoVehiculo[] {
  const gastos = getGastosVehiculo();

  const gastoEliminado = gastos.find((gasto) => gasto.id === id);

  const actualizados = gastos.filter((gasto) => gasto.id !== id);

  saveData(STORAGE_KEYS.VEHICULO_GASTOS, actualizados);

  registrarEventoAuditoria({
    tipo: "GASTO_VEHICULO_ELIMINADO",
    descripcion: `Gasto de vehículo eliminado: ${
      gastoEliminado?.descripcion ?? "sin descripción"
    }`,
    entidad: "VEHICULO",
    entidadId: id,
  });

  return actualizados;
}

export function updateGastoVehiculo(
  gastoActualizado: GastoVehiculo
): GastoVehiculo[] {
  const gastos = getGastosVehiculo();

  const actualizados = gastos.map((gasto) =>
    gasto.id === gastoActualizado.id ? gastoActualizado : gasto
  );

  saveData(STORAGE_KEYS.VEHICULO_GASTOS, actualizados);

  registrarEventoAuditoria({
    tipo: "GASTO_VEHICULO_CREADO",
    descripcion: `Gasto de vehículo actualizado: ${gastoActualizado.descripcion}`,
    entidad: "VEHICULO",
    entidadId: gastoActualizado.id,
  });

  return actualizados;
}
