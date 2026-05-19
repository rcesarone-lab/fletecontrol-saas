export type MetodoCobro =
  | "EFECTIVO"
  | "TRANSFERENCIA"
  | "MERCADOPAGO"
  | "CHEQUE";

export type EstadoCobro =
  | "PENDIENTE"
  | "COBRADO";

export type Ingreso = {
  id: string;

  fecha: string;

  clienteId?: string;

  cliente: string;

  envioId?: string;

  concepto: string;

  monto: number;

  metodoCobro: MetodoCobro;

  comision: number;

  retencion: number;

  montoNeto: number;

  estado: EstadoCobro;

  facturaEmitida: boolean;
};