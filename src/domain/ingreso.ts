export type MetodoCobro =
  | "EFECTIVO"
  | "TRANSFERENCIA"
  | "MERCADOPAGO"
  | "CHEQUE";

export type EstadoCobro = "PENDIENTE" | "COBRADO";

export type Ingreso = {
  id: string;
  fecha: string;

  facturaId?: string;

  clienteId?: string;
  cliente: string;

  concepto: string;
  monto: number;

  metodoCobro: MetodoCobro;
  referenciaOperacion?: string;

  comision: number;
  retencion: number;
  montoNeto: number;

  estado: EstadoCobro;

  observaciones?: string;
};