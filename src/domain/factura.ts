export type EstadoFactura = "BORRADOR" | "EMITIDA" | "ANULADA";

export type OrigenFactura = "SIMULADA" | "AFIP";

export type Factura = {
  id: string;

  envioId: string;

  clienteId?: string;

  cliente: string;

  clienteCuit?: string;

  clienteDireccion?: string;

  fecha: string;

  tipo: "C";

  puntoVenta?: number;

  numero?: number;

  cae?: string;

  vencimientoCae?: string;

  importeTotal: number;

  estado: EstadoFactura;

  origen: OrigenFactura;
};