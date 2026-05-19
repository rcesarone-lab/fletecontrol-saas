export type MetodoPago =
  | "EFECTIVO"
  | "TRANSFERENCIA"
  | "BILLETERA"
  | "CHEQUE";

export type PagoAyudante = {
  id: string;

  ayudanteNombre: string;

  fecha: string;

  horasTrabajadas: number;

  valorHora: number;

  monto: number;

  metodoPago: MetodoPago;

  comprobanteUrl?: string;
};