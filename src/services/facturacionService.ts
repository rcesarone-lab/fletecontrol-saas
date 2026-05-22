import type { Cliente } from "../domain/cliente";
import type { ConfiguracionSistema } from "../domain/configuracion";
import type { Envio } from "../domain/envio";
import type { Factura } from "../domain/factura";
import type { MetodoCobro } from "../domain/ingreso";
import { registrarEventoAuditoria } from "./auditoriaService";
import { getClientes } from "./clientesService";
import { getConfiguracion } from "./configuracionService";
import { getEnvios, updateEstadoEnvio } from "./enviosService";
import { saveIngreso } from "./ingresosService";
import { esEnvioDisponibleParaFacturar } from "./operacionRules";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getFacturas(): Factura[] {
  return loadData<Factura[]>(STORAGE_KEYS.FACTURAS, []);
}

function buscarCliente(clienteId: string): Cliente | undefined {
  return getClientes().find((cliente) => cliente.id === clienteId);
}

function estaDentroDelPeriodo(fecha: string, desde?: string, hasta?: string) {
  if (desde && fecha < desde) return false;
  if (hasta && fecha > hasta) return false;

  return true;
}

export function getEnviosFacturables(input: {
  clienteId: string;
  desde?: string;
  hasta?: string;
}): Envio[] {
  const facturas = getFacturas();

  const enviosYaFacturados = new Set(
    facturas
      .filter((factura) => factura.estado !== "ANULADA")
      .flatMap((factura) => factura.envioIds)
  );

  return getEnvios().filter(
    (envio) =>
      envio.clienteId === input.clienteId &&
      esEnvioDisponibleParaFacturar(envio.estado) &&
      estaDentroDelPeriodo(envio.fecha, input.desde, input.hasta) &&
      !enviosYaFacturados.has(envio.id)
  );
}

export function emitirFacturaPorCorte(input: {
  clienteId: string;
  envioIds: string[];
  periodoDesde?: string;
  periodoHasta?: string;
  concepto?: string;
  configuracion?: ConfiguracionSistema;
}): Factura {
  const cliente = buscarCliente(input.clienteId);

  if (!cliente) {
    throw new Error("No se encontró el cliente seleccionado.");
  }

  if (input.envioIds.length === 0) {
    throw new Error("Seleccioná al menos un envío para facturar.");
  }

  const enviosFacturables = getEnviosFacturables({
    clienteId: input.clienteId,
    desde: input.periodoDesde,
    hasta: input.periodoHasta,
  });

  const enviosSeleccionados = enviosFacturables.filter((envio) =>
    input.envioIds.includes(envio.id)
  );

  if (enviosSeleccionados.length !== input.envioIds.length) {
    throw new Error(
      "Uno o más envíos seleccionados ya no están disponibles para facturar."
    );
  }

  const facturas = getFacturas();
  const configuracion = input.configuracion ?? getConfiguracion();

  const importeTotal = enviosSeleccionados.reduce(
    (total, envio) => total + envio.tarifaContratante,
    0
  );

  const nuevaFactura: Factura = {
    id: crypto.randomUUID(),
    envioIds: enviosSeleccionados.map((envio) => envio.id),
    clienteId: cliente.id,
    cliente: cliente.razonSocial,
    clienteCuit: cliente.cuit,
    clienteDireccion: cliente.direccion,
    fecha: new Date().toISOString().split("T")[0],
    periodoDesde: input.periodoDesde,
    periodoHasta: input.periodoHasta,
    concepto:
      input.concepto ||
      `Viajes realizados ${
        input.periodoDesde && input.periodoHasta
          ? `del ${input.periodoDesde} al ${input.periodoHasta}`
          : "según detalle operativo"
      }`,
    tipo: "C",
    numero: facturas.length + 1,
    puntoVenta: configuracion.monotributista.puntoVenta,
    importeTotal,
    estado: "PENDIENTE_COBRO",
    origen: "SIMULADA",
  };

  const actualizadas = [nuevaFactura, ...facturas];

  saveData(STORAGE_KEYS.FACTURAS, actualizadas);

  enviosSeleccionados.forEach((envio) => {
    updateEstadoEnvio(envio.id, "FACTURADO", {
      permitirFacturadoDesdeFacturacion: true,
    });
  });

  registrarEventoAuditoria({
    tipo: "CORTE_FACTURACION_EMITIDO",
    descripcion: `Corte de facturación emitido para ${cliente.razonSocial}`,
    entidad: "FACTURA",
    entidadId: nuevaFactura.id,
  });

  return nuevaFactura;
}

export function registrarCobroFactura(input: {
  facturaId: string;
  metodoCobro: MetodoCobro;
  referenciaOperacion?: string;
  comision?: number;
  retencion?: number;
  observaciones?: string;
}) {
  const facturas = getFacturas();

  const factura = facturas.find((item) => item.id === input.facturaId);

  if (!factura) {
    throw new Error("No se encontró la factura seleccionada.");
  }

  if (factura.estado === "COBRADA") {
    throw new Error("La factura ya se encuentra cobrada.");
  }

  if (factura.estado === "ANULADA") {
    throw new Error("No se puede cobrar una factura anulada.");
  }

  const comision = input.comision ?? 0;
  const retencion = input.retencion ?? 0;

  const nuevoIngreso = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString().split("T")[0],
    facturaId: factura.id,
    clienteId: factura.clienteId,
    cliente: factura.cliente,
    concepto: `Cobro factura ${String(factura.puntoVenta ?? 1).padStart(
      4,
      "0"
    )}-${String(factura.numero ?? 0).padStart(8, "0")}`,
    monto: factura.importeTotal,
    metodoCobro: input.metodoCobro,
    referenciaOperacion: input.referenciaOperacion,
    comision,
    retencion,
    montoNeto: factura.importeTotal - comision - retencion,
    estado: "COBRADO" as const,
    observaciones: input.observaciones,
  };

  saveIngreso(nuevoIngreso);

  const actualizadas = facturas.map((item) =>
    item.id === factura.id ? { ...item, estado: "COBRADA" as const } : item
  );

  saveData(STORAGE_KEYS.FACTURAS, actualizadas);

  factura.envioIds.forEach((envioId) => {
    updateEstadoEnvio(envioId, "COBRADO", {
      permitirCobradoDesdeIngreso: true,
    });
  });

  registrarEventoAuditoria({
    tipo: "FACTURA_COBRADA",
    descripcion: `Factura cobrada: ${factura.cliente}`,
    entidad: "FACTURA",
    entidadId: factura.id,
  });

  return actualizadas;
}

export function deleteFacturaPorEnvios(envioIds: string[]): Factura[] {
  const facturas = getFacturas();

  const facturaEliminada = facturas.find((factura) =>
    factura.envioIds.some((id) => envioIds.includes(id))
  );

  const actualizadas = facturas.filter(
    (factura) => !factura.envioIds.some((id) => envioIds.includes(id))
  );

  saveData(STORAGE_KEYS.FACTURAS, actualizadas);

  if (facturaEliminada) {
    registrarEventoAuditoria({
      tipo: "FACTURA_ELIMINADA",
      descripcion: `Factura eliminada: ${facturaEliminada.cliente}`,
      entidad: "FACTURA",
      entidadId: facturaEliminada.id,
    });
  }

  return actualizadas;
}