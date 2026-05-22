export type EstadoFactura =
  | "BORRADOR"
  | "EMITIDA"
  | "PENDIENTE_COBRO"
  | "COBRADA"
  | "ANULADA";

export type OrigenFactura = "SIMULADA" | "AFIP";

export type Factura = {
  id: string;

  envioIds: string[];

  clienteId?: string;
  cliente: string;
  clienteCuit?: string;
  clienteDireccion?: string;

  fecha: string;

  periodoDesde?: string;
  periodoHasta?: string;

  concepto: string;

  tipo: "C";

  puntoVenta?: number;
  numero?: number;

  cae?: string;
  vencimientoCae?: string;

  importeTotal: number;

  estado: EstadoFactura;
  origen: OrigenFactura;
};