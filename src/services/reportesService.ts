import { getPagosAyudantes } from "./ayudantesService";
import { getEnviosPendientesDeCobro } from "./cobranzaService";
import { getClientes } from "./clientesService";
import { getEnvios } from "./enviosService";
import { getFacturas } from "./facturacionService";
import { getIngresos } from "./ingresosService";
import { getGastosVehiculo } from "./vehiculoService";

function getMesActual() {
  return new Date().toISOString().slice(0, 7);
}

function getMesAnterior() {
  const fecha = new Date();
  fecha.setMonth(fecha.getMonth() - 1);
  return fecha.toISOString().slice(0, 7);
}

function perteneceAlMes(fecha: string, mes: string) {
  return fecha.startsWith(mes);
}

export function getResumenFinanciero() {
  const envios = getEnvios();
  const ingresos = getIngresos();
  const facturas = getFacturas();
  const clientes = getClientes();
  const gastosVehiculo = getGastosVehiculo();
  const pagosAyudantes = getPagosAyudantes();
  const enviosPendientesDeCobro = getEnviosPendientesDeCobro();

  const mesActual = getMesActual();
  const mesAnterior = getMesAnterior();

  const ingresosBrutos = ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
  const ingresosNetos = ingresos.reduce((total, ingreso) => total + ingreso.montoNeto, 0);
  const comisiones = ingresos.reduce((total, ingreso) => total + ingreso.comision, 0);
  const retenciones = ingresos.reduce((total, ingreso) => total + ingreso.retencion, 0);

  const gastosVehiculoTotal = gastosVehiculo.reduce((total, gasto) => total + gasto.monto, 0);
  const pagosAyudantesTotal = pagosAyudantes.reduce((total, pago) => total + pago.monto, 0);

  const costosOperativos = gastosVehiculoTotal + pagosAyudantesTotal;
  const costosTotales = costosOperativos + comisiones + retenciones;
  const margenOperativo = ingresosNetos - costosOperativos;
  const rentabilidadNeta = ingresosBrutos - costosTotales;

  const totalFacturado = facturas.reduce((total, factura) => total + factura.importeTotal, 0);

  const ticketPromedio = ingresos.length > 0 ? ingresosBrutos / ingresos.length : 0;

  const facturadoMesActual = facturas
    .filter((factura) => perteneceAlMes(factura.fecha, mesActual))
    .reduce((total, factura) => total + factura.importeTotal, 0);

  const facturadoMesAnterior = facturas
    .filter((factura) => perteneceAlMes(factura.fecha, mesAnterior))
    .reduce((total, factura) => total + factura.importeTotal, 0);

  const cobradoMesActual = ingresos
    .filter((ingreso) => perteneceAlMes(ingreso.fecha, mesActual))
    .reduce((total, ingreso) => total + ingreso.montoNeto, 0);

  const cobradoMesAnterior = ingresos
    .filter((ingreso) => perteneceAlMes(ingreso.fecha, mesAnterior))
    .reduce((total, ingreso) => total + ingreso.montoNeto, 0);

  const gastosVehiculoMesActual = gastosVehiculo
    .filter((gasto) => perteneceAlMes(gasto.fecha, mesActual))
    .reduce((total, gasto) => total + gasto.monto, 0);

  const pagosAyudantesMesActual = pagosAyudantes
    .filter((pago) => perteneceAlMes(pago.fecha, mesActual))
    .reduce((total, pago) => total + pago.monto, 0);

  const gastosMesActual = gastosVehiculoMesActual + pagosAyudantesMesActual;
  const margenMesActual = cobradoMesActual - gastosMesActual;

  const variacionFacturacionMensual =
    facturadoMesAnterior > 0
      ? ((facturadoMesActual - facturadoMesAnterior) / facturadoMesAnterior) * 100
      : facturadoMesActual > 0
      ? 100
      : 0;

  const enviosPendientes = envios.filter((envio) => envio.estado === "PENDIENTE").length;
  const enviosEnTransito = envios.filter((envio) => envio.estado === "EN_TRANSITO").length;
  const enviosEntregados = envios.filter((envio) => envio.estado === "ENTREGADO").length;
  const enviosCobrados = envios.filter((envio) => envio.estado === "COBRADO").length;
  const enviosCancelados = envios.filter((envio) => envio.estado === "CANCELADO").length;

  const clientesActivos = new Set(
    ingresos.map((ingreso) => ingreso.clienteId).filter(Boolean)
  ).size;

  return {
    ingresosBrutos,
    ingresosNetos,
    comisiones,
    retenciones,
    gastosVehiculoTotal,
    pagosAyudantesTotal,
    costosOperativos,
    costosTotales,
    margenOperativo,
    rentabilidadNeta,
    totalFacturado,
    ticketPromedio,

    mesActual,
    mesAnterior,
    facturadoMesActual,
    facturadoMesAnterior,
    cobradoMesActual,
    cobradoMesAnterior,
    gastosMesActual,
    margenMesActual,
    variacionFacturacionMensual,

    totalEnvios: envios.length,
    enviosPendientes,
    enviosEnTransito,
    enviosEntregados,
    enviosCobrados,
    enviosCancelados,
    enviosPendientesDeCobro: enviosPendientesDeCobro.length,

    totalClientes: clientes.length,
    clientesActivos,
    totalFacturas: facturas.length,
  };
}

export function getReporteClientes() {
  const envios = getEnvios();
  const ingresos = getIngresos();
  const clientes = getClientes();

  return clientes.map((cliente) => {
    const enviosCliente = envios.filter((envio) => envio.clienteId === cliente.id);
    const ingresosCliente = ingresos.filter((ingreso) => ingreso.clienteId === cliente.id);

    const totalFacturado = ingresosCliente.reduce(
      (total, ingreso) => total + ingreso.monto,
      0
    );

    const totalNeto = ingresosCliente.reduce(
      (total, ingreso) => total + ingreso.montoNeto,
      0
    );

    const costosEstimados = enviosCliente.reduce(
      (total, envio) => total + envio.costoEstimado,
      0
    );

    const margenEstimado = totalNeto - costosEstimados;

    return {
      clienteId: cliente.id,
      razonSocial: cliente.razonSocial,
      cuit: cliente.cuit,
      cantidadEnvios: enviosCliente.length,
      ingresosRegistrados: ingresosCliente.length,
      totalFacturado,
      totalNeto,
      costosEstimados,
      margenEstimado,
    };
  });
}