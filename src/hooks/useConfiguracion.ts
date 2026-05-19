import { useEffect, useState } from "react";
import type { ConfiguracionSistema } from "../domain/configuracion";
import {
  getConfiguracion,
  saveConfiguracion,
} from "../services/configuracionService";

export function useConfiguracion() {
  const [configuracion, setConfiguracion] =
    useState<ConfiguracionSistema | null>(null);

  useEffect(() => {
    setConfiguracion(getConfiguracion());
  }, []);

  function actualizarConfiguracion(data: ConfiguracionSistema) {
    const actualizada = saveConfiguracion(data);
    setConfiguracion(actualizada);
  }

  return {
    configuracion,
    actualizarConfiguracion,
  };
}