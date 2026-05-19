import type { ConfiguracionSistema } from "../domain/configuracion";
import { seedConfiguracion } from "../data/seedConfiguracion";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getConfiguracion(): ConfiguracionSistema {
  return loadData<ConfiguracionSistema>(
    STORAGE_KEYS.CONFIGURACION,
    seedConfiguracion
  );
}

export function saveConfiguracion(
  configuracion: ConfiguracionSistema
): ConfiguracionSistema {
  saveData(STORAGE_KEYS.CONFIGURACION, configuracion);
  return configuracion;
}