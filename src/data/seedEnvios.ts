import type { Envio } from '../domain/envio'

export const seedEnvios: Envio[] = [
  {
    id: 'e1',
    empresaCliente: 'Cliente Uno',
    materiales: 'Carga general',
    direccionDestino: 'Destino A',
    localidad: 'Localidad A',
    provincia: 'Buenos Aires',
    fecha: new Date().toISOString(),
    tarifaGremial: 120,
    tarifaContratante: 150,
    costoEstimado: 270,
    estado: 'PENDIENTE',
  },
]
