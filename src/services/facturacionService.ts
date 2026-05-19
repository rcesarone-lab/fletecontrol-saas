import type { ConfiguracionSistema } from "../domain/configuracion";
import type { Factura } from "../domain/factura";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getFacturas(): Factura[] {
  return loadData<Factura[]>(STORAGE_KEYS.FACTURAS, []);
}

export function emitirFacturaSimulada(data: {
  clienteId?: string;
  cliente: string;
  clienteCuit?: string;
  clienteDireccion?: string;
  importeTotal: number;
  configuracion: ConfiguracionSistema;
}): Factura {
  const facturas = getFacturas();

  const nuevaFactura: Factura = {
    id: crypto.randomUUID(),
    envioId: "MANUAL",
    clienteId: data.clienteId,
    cliente: data.cliente,
    clienteCuit: data.clienteCuit,
    clienteDireccion: data.clienteDireccion,
    fecha: new Date().toISOString().split("T")[0],
    tipo: "C",
    numero: facturas.length + 1,
    puntoVenta: data.configuracion.monotributista.puntoVenta,
    importeTotal: data.importeTotal,
    estado: "EMITIDA",
    origen: "SIMULADA",
  };

  const actualizadas = [nuevaFactura, ...facturas];

  saveData(STORAGE_KEYS.FACTURAS, actualizadas);

  return nuevaFactura;
}