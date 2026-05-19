import { Envio } from '../domain/envio'

export const seedEnvios: Envio[] = [
  { id: 'e1', clienteId: 'c1', origen: 'Origen A', destino: 'Destino A', fecha: new Date().toISOString(), tarifa: 120, estado: 'pendiente' },
]
