export type TipoGastoVehiculo =
  | "COMBUSTIBLE"
  | "MANTENIMIENTO"
  | "SEGURO"
  | "PEAJE"
  | "OTRO";

export type GastoVehiculo = {
  id: string;

  fecha: string;

  tipo: TipoGastoVehiculo;

  descripcion: string;

  monto: number;

  vencimiento?: string;
};