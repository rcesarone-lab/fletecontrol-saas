import type { Envio } from "../domain/envio";
import { getEnvios } from "./enviosService";

export function getEnviosPendientesDeCobro(): Envio[] {
  const envios = getEnvios();

  return envios.filter((envio) => envio.estado === "FACTURADO");
}