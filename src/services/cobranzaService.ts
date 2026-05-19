import type { Envio } from "../domain/envio";
import { getEnvios } from "./enviosService";
import { getIngresos } from "./ingresosService";

export function getEnviosPendientesDeCobro(): Envio[] {
  const envios = getEnvios();
  const ingresos = getIngresos();

  const enviosConIngreso = new Set(
    ingresos
      .map((ingreso) => ingreso.envioId)
      .filter(Boolean)
  );

  return envios.filter(
    (envio) =>
      envio.estado === "ENTREGADO" &&
      !enviosConIngreso.has(envio.id)
  );
}