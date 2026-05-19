import type { Envio, EstadoEnvio } from "../domain/envio";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getEnvios(): Envio[] {
  return loadData<Envio[]>(STORAGE_KEYS.ENVIOS, []);
}

export function saveEnvio(envio: Envio): Envio[] {
  const envios = getEnvios();
  const nuevosEnvios = [envio, ...envios];

  saveData(STORAGE_KEYS.ENVIOS, nuevosEnvios);

  return nuevosEnvios;
}

export function updateEstadoEnvio(id: string, estado: EstadoEnvio): Envio[] {
  const envios = getEnvios();

  const actualizados = envios.map((envio) =>
    envio.id === id ? { ...envio, estado } : envio
  );

  saveData(STORAGE_KEYS.ENVIOS, actualizados);

  return actualizados;
}

export function deleteEnvio(id: string): Envio[] {
  const envios = getEnvios();

  const filtrados = envios.filter((envio) => envio.id !== id);

  saveData(STORAGE_KEYS.ENVIOS, filtrados);

  return filtrados;
}