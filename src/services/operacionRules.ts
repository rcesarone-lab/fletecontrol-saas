import type { EstadoEnvio } from "../domain/envio";

const ORDEN_ESTADOS: EstadoEnvio[] = [
  "PENDIENTE",
  "EN_TRANSITO",
  "ENTREGADO",
  "FACTURADO",
  "COBRADO",
];

export function puedeCambiarEstadoEnvio(
  estadoActual: EstadoEnvio,
  nuevoEstado: EstadoEnvio
) {
  if (estadoActual === nuevoEstado) {
    return {
      permitido: false,
      motivo: "El envío ya se encuentra en ese estado.",
    };
  }

  if (nuevoEstado === "FACTURADO") {
    return {
      permitido: false,
      motivo: "El estado FACTURADO solo puede asignarse desde Facturación.",
    };
  }

  if (nuevoEstado === "COBRADO") {
    return {
      permitido: false,
      motivo: "El estado COBRADO solo puede asignarse desde Ingresos.",
    };
  }

  if (estadoActual === "COBRADO") {
    return {
      permitido: false,
      motivo: "Un envío COBRADO no puede modificarse manualmente.",
    };
  }

  if (estadoActual === "FACTURADO") {
    return {
      permitido: false,
      motivo: "Un envío FACTURADO no puede modificarse manualmente.",
    };
  }

  if (estadoActual === "CANCELADO") {
    return {
      permitido: false,
      motivo: "Un envío CANCELADO no puede cambiar de estado.",
    };
  }

  if (nuevoEstado === "CANCELADO") {
    return {
      permitido: true,
    };
  }

  const actualIndex = ORDEN_ESTADOS.indexOf(estadoActual);
  const nuevoIndex = ORDEN_ESTADOS.indexOf(nuevoEstado);

  if (nuevoIndex < actualIndex) {
    return {
      permitido: false,
      motivo: "No se permite retroceder el estado del envío.",
    };
  }

  return {
    permitido: true,
  };
}

export function esEnvioDisponibleParaFacturar(estado: EstadoEnvio) {
  return estado === "ENTREGADO";
}

export function esEnvioDisponibleParaCobrar(estado: EstadoEnvio) {
  return estado === "FACTURADO";
}