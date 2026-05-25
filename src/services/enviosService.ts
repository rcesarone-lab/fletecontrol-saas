import type { Envio, EstadoEnvio } from "../domain/envio";
import { registrarEventoAuditoria } from "./auditoriaService";
import { getFacturas } from "./facturacionService";
import { puedeCambiarEstadoEnvio } from "./operacionRules";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getEnvios(): Envio[] {
  return loadData<Envio[]>(STORAGE_KEYS.ENVIOS, []);
}

export function saveEnvio(envio: Envio): Envio[] {
  const envios = getEnvios();
  const nuevosEnvios = [envio, ...envios];

  saveData(STORAGE_KEYS.ENVIOS, nuevosEnvios);

  registrarEventoAuditoria({
    tipo: "ENVIO_CREADO",
    descripcion: `Envío creado para ${envio.empresaCliente}: ${envio.materiales}`,
    entidad: "ENVIO",
    entidadId: envio.id,
  });

  return nuevosEnvios;
}

export function updateEstadoEnvio(
  id: string,
  estado: EstadoEnvio,
  options?: {
    permitirCobradoDesdeIngreso?: boolean;
    permitirReversionDesdeIngreso?: boolean;
    permitirFacturadoDesdeFacturacion?: boolean;
  }
): Envio[] {
  const envios = getEnvios();
  const envioActual = envios.find((envio) => envio.id === id);

  if (!envioActual) {
    throw new Error("No se encontró el envío.");
  }

  if (estado === "COBRADO" && options?.permitirCobradoDesdeIngreso) {
    const actualizados = envios.map((envio) =>
      envio.id === id ? { ...envio, estado } : envio
    );

    saveData(STORAGE_KEYS.ENVIOS, actualizados);

    registrarEventoAuditoria({
      tipo: "ENVIO_ESTADO_CAMBIADO",
      descripcion: `Estado de envío actualizado de ${envioActual.estado} a COBRADO por ingreso registrado`,
      entidad: "ENVIO",
      entidadId: id,
    });

    return actualizados;
  }

  if (estado === "ENTREGADO" && options?.permitirReversionDesdeIngreso) {
    const actualizados = envios.map((envio) =>
      envio.id === id ? { ...envio, estado } : envio
    );

    saveData(STORAGE_KEYS.ENVIOS, actualizados);

    registrarEventoAuditoria({
      tipo: "ENVIO_ESTADO_CAMBIADO",
      descripcion: `Estado de envío revertido de ${envioActual.estado} a ENTREGADO por eliminación de ingreso`,
      entidad: "ENVIO",
      entidadId: id,
    });

    return actualizados;
  }

  if (estado === "FACTURADO" && options?.permitirFacturadoDesdeFacturacion) {
    const actualizados = envios.map((envio) =>
      envio.id === id ? { ...envio, estado } : envio
    );

    saveData(STORAGE_KEYS.ENVIOS, actualizados);

    registrarEventoAuditoria({
      tipo: "ENVIO_ESTADO_CAMBIADO",
      descripcion: `Estado de envío actualizado de ${envioActual.estado} a FACTURADO por corte de facturación`,
      entidad: "ENVIO",
      entidadId: id,
    });

    return actualizados;
  }

  const validacion = puedeCambiarEstadoEnvio(envioActual.estado, estado);

  if (!validacion.permitido) {
    registrarEventoAuditoria({
      tipo: "ENVIO_ESTADO_BLOQUEADO",
      descripcion: validacion.motivo ?? "Cambio de estado bloqueado",
      entidad: "ENVIO",
      entidadId: id,
    });

    throw new Error(validacion.motivo);
  }

  const actualizados = envios.map((envio) =>
    envio.id === id ? { ...envio, estado } : envio
  );

  saveData(STORAGE_KEYS.ENVIOS, actualizados);

  registrarEventoAuditoria({
    tipo: "ENVIO_ESTADO_CAMBIADO",
    descripcion: `Estado de envío actualizado de ${envioActual.estado} a ${estado}`,
    entidad: "ENVIO",
    entidadId: id,
  });

  return actualizados;
}

export function deleteEnvio(id: string): Envio[] {
  const facturas = getFacturas();

  const tieneFacturas = facturas.some((factura) =>
    factura.envioIds.includes(id)
  );

  if (tieneFacturas) {
    registrarEventoAuditoria({
      tipo: "ENVIO_ELIMINACION_BLOQUEADA",
      descripcion: "No se puede eliminar un envío con facturas asociadas.",
      entidad: "ENVIO",
      entidadId: id,
    });

    throw new Error("No se puede eliminar un envío con facturas asociadas.");
  }

  const envios = getEnvios();

  const envioEliminado = envios.find((envio) => envio.id === id);

  const filtrados = envios.filter((envio) => envio.id !== id);

  saveData(STORAGE_KEYS.ENVIOS, filtrados);

  registrarEventoAuditoria({
    tipo: "ENVIO_ELIMINADO",
    descripcion: `Envío eliminado: ${envioEliminado?.empresaCliente ?? "sin cliente"
      }`,
    entidad: "ENVIO",
    entidadId: id,
  });

  return filtrados;
}

export function updateEnvio(envioActualizado: Envio): Envio[] {
  const envios = getEnvios();

  const envioExistente = envios.find(
    (envio) => envio.id === envioActualizado.id
  );

  if (!envioExistente) {
    throw new Error("No se encontró el envío.");
  }

  if (
    envioExistente.estado === "ENTREGADO" ||
    envioExistente.estado === "FACTURADO" ||
    envioExistente.estado === "COBRADO"
  ) {
    registrarEventoAuditoria({
      tipo: "ENVIO_ESTADO_BLOQUEADO",
      descripcion:
        "No se puede editar un envío entregado, facturado o cobrado.",
      entidad: "ENVIO",
      entidadId: envioActualizado.id,
    });

    throw new Error(
      "No se puede editar un envío entregado, facturado o cobrado."
    );
  }

  const actualizados = envios.map((envio) =>
    envio.id === envioActualizado.id ? envioActualizado : envio
  );

  saveData(STORAGE_KEYS.ENVIOS, actualizados);

  registrarEventoAuditoria({
    tipo: "ENVIO_ESTADO_CAMBIADO",
    descripcion: `Envío actualizado: ${envioActualizado.empresaCliente}`,
    entidad: "ENVIO",
    entidadId: envioActualizado.id,
  });

  return actualizados;
}