export type EstadoEnvio =
  | "PENDIENTE"
  | "EN_TRANSITO"
  | "ENTREGADO"
  | "CANCELADO";

export type Envio = {
  id: string;

  fecha: string;

  empresaCliente: string;

  materiales: string;

  direccionDestino: string;

  localidad: string;

  provincia: string;

  estado: EstadoEnvio;

  tarifaGremial: number;

  tarifaContratante: number;

  costoEstimado: number;

  observaciones?: string;
};