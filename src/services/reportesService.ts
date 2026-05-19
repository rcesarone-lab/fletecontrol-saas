import { getEnvios } from "./enviosService";
import { getGastosVehiculo } from "./vehiculoService";
import { getPagosAyudantes } from "./ayudantesService";
import { getIngresos } from "./ingresosService";
import { getEnviosPendientesDeCobro } from "./cobranzaService";

export function getResumenFinanciero() {
  const envios = getEnvios();
  const ingresos = getIngresos();
  const gastosVehiculo = getGastosVehiculo();
  const pagosAyudantes = getPagosAyudantes();

  const ingresosBrutos = ingresos.reduce(
    (total, ingreso) => total + ingreso.monto,
    0
  );

  const ingresosNetos = ingresos.reduce(
    (total, ingreso) => total + ingreso.montoNeto,
    0
  );

  const comisiones = ingresos.reduce(
    (total, ingreso) => total + ingreso.comision,
    0
  );

  const retenciones = ingresos.reduce(
    (total, ingreso) => total + ingreso.retencion,
    0
  );

  const gastosVehiculoTotal = gastosVehiculo.reduce(
    (total, gasto) => total + gasto.monto,
    0
  );

  const pagosAyudantesTotal = pagosAyudantes.reduce(
    (total, pago) => total + pago.monto,
    0
  );

  const costosTotales =
    gastosVehiculoTotal + pagosAyudantesTotal + comisiones + retenciones;

  const rentabilidadNeta = ingresosBrutos - costosTotales;

  const enviosPendientes = envios.filter(
    (envio) => envio.estado === "PENDIENTE"
  ).length;

  const enviosEnTransito = envios.filter(
    (envio) => envio.estado === "EN_TRANSITO"
  ).length;

  const enviosEntregados = envios.filter(
    (envio) => envio.estado === "ENTREGADO"
  ).length;

  const enviosPendientesDeCobro = getEnviosPendientesDeCobro();

  return {
    ingresosBrutos,
    ingresosNetos,
    comisiones,
    retenciones,
    gastosVehiculoTotal,
    pagosAyudantesTotal,
    costosTotales,
    rentabilidadNeta,
    totalEnvios: envios.length,
    enviosPendientes,
    enviosPendientesDeCobro: enviosPendientesDeCobro.length,
    enviosEnTransito,
    enviosEntregados,
    totalClientesOperativos: new Set(
      envios.map((envio) => envio.empresaCliente.trim().toLowerCase())
    ).size,
  };
}