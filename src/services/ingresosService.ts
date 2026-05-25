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
    descripcion: `Ingreso eliminado: ${ingresoEliminado?.cliente ?? "sin cliente"
      }`,
    entidad: "INGRESO",
    entidadId: id,
  });

  return actualizados;
}

export function updateIngresoAdministrativo(input: {
  id: string;
  metodoCobro: Ingreso["metodoCobro"];
  referenciaOperacion?: string;
  comision: number;
  retencion: number;
  observaciones?: string;
}): Ingreso[] {
  const ingresos = getIngresos();

  const ingresoActual = ingresos.find((ingreso) => ingreso.id === input.id);

  if (!ingresoActual) {
    throw new Error("No se encontró el cobro seleccionado.");
  }

  const actualizado: Ingreso = {
    ...ingresoActual,
    metodoCobro: input.metodoCobro,
    referenciaOperacion: input.referenciaOperacion,
    comision: input.comision,
    retencion: input.retencion,
    montoNeto: ingresoActual.monto - input.comision - input.retencion,
    observaciones: input.observaciones,
  };

  const actualizados = ingresos.map((ingreso) =>
    ingreso.id === input.id ? actualizado : ingreso
  );

  saveData(STORAGE_KEYS.INGRESOS, actualizados);

  registrarEventoAuditoria({
    tipo: "INGRESO_CREADO",
    descripcion: `Cobro actualizado administrativamente: ${actualizado.cliente}`,
    entidad: "INGRESO",
    entidadId: actualizado.id,
  });

  return actualizados;
}