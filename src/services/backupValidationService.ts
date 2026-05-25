import { STORAGE_KEYS } from "./storage";

type BackupData = Record<string, unknown>;

type FacturaDemo = {
  id: string;
  clienteId?: string;
  cliente?: string;
  envioIds?: string[];
  estado: "PENDIENTE_COBRO" | "COBRADA" | "ANULADA";
  periodoDesde?: string;
  periodoHasta?: string;
  importeTotal: number;
};

type EnvioDemo = {
  id: string;
  clienteId?: string;
  empresaCliente?: string;
  fecha: string;
  estado: string;
  tarifaContratante: number;
};

type IngresoDemo = {
  id: string;
  facturaId?: string;
  monto: number;
  montoNeto: number;
  comision: number;
  retencion: number;
};

function mismoCliente(envio: EnvioDemo, factura: FacturaDemo) {
  if (factura.clienteId && envio.clienteId) {
    return envio.clienteId === factura.clienteId;
  }

  if (factura.cliente && envio.empresaCliente) {
    return envio.empresaCliente === factura.cliente;
  }

  return false;
}

function dentroPeriodo(envio: EnvioDemo, factura: FacturaDemo) {
  if (factura.periodoDesde && envio.fecha < factura.periodoDesde) return false;
  if (factura.periodoHasta && envio.fecha > factura.periodoHasta) return false;

  return true;
}

export function validarBackupFleteControl(datos: BackupData) {
  const errores: string[] = [];

  const envios = (datos[STORAGE_KEYS.ENVIOS] ?? []) as EnvioDemo[];
  const facturas = (datos[STORAGE_KEYS.FACTURAS] ?? []) as FacturaDemo[];
  const ingresos = (datos[STORAGE_KEYS.INGRESOS] ?? []) as IngresoDemo[];

  const enviosPorId = new Map(envios.map((envio) => [envio.id, envio]));
  const facturasPorId = new Map(facturas.map((factura) => [factura.id, factura]));

  facturas.forEach((factura) => {
    if (factura.estado === "ANULADA") return;

    const envioIdsFactura = factura.envioIds ?? [];

    if (envioIdsFactura.length === 0) {
      errores.push(`Factura ${factura.id} no tiene envíos asociados.`);
      return;
    }

    const enviosPeriodoCliente = envios.filter(
      (envio) => mismoCliente(envio, factura) && dentroPeriodo(envio, factura)
    );

    const idsPeriodoCliente = enviosPeriodoCliente.map((envio) => envio.id);

    const faltantesEnFactura = idsPeriodoCliente.filter(
      (id) => !envioIdsFactura.includes(id)
    );

    if (faltantesEnFactura.length > 0) {
      errores.push(
        `Factura ${factura.id} no incluye todos los envíos del cliente/período: ${faltantesEnFactura.join(", ")}.`
      );
    }

    envioIdsFactura.forEach((envioId) => {
      const envio = enviosPorId.get(envioId);

      if (!envio) {
        errores.push(`Factura ${factura.id} referencia envío inexistente ${envioId}.`);
        return;
      }

      if (!mismoCliente(envio, factura)) {
        errores.push(`Factura ${factura.id} contiene envío ${envioId} de otro cliente.`);
      }

      if (!dentroPeriodo(envio, factura)) {
        errores.push(`Envío ${envioId} está fuera del período de factura ${factura.id}.`);
      }

      if (factura.estado === "COBRADA" && envio.estado !== "COBRADO") {
        errores.push(
          `Factura COBRADA ${factura.id} tiene envío ${envioId} en estado ${envio.estado}.`
        );
      }

      if (factura.estado === "PENDIENTE_COBRO" && envio.estado !== "FACTURADO") {
        errores.push(
          `Factura PENDIENTE_COBRO ${factura.id} tiene envío ${envioId} en estado ${envio.estado}.`
        );
      }
    });

    const sumaEnvios = envioIdsFactura.reduce((total, envioId) => {
      const envio = enviosPorId.get(envioId);
      return total + (envio?.tarifaContratante ?? 0);
    }, 0);

    if (sumaEnvios !== factura.importeTotal) {
      errores.push(
        `Factura ${factura.id} tiene importe ${factura.importeTotal}, pero sus envíos suman ${sumaEnvios}.`
      );
    }
  });

  ingresos.forEach((ingreso) => {
    if (!ingreso.facturaId) return;

    const factura = facturasPorId.get(ingreso.facturaId);

    if (!factura) {
      errores.push(`Cobro ${ingreso.id} referencia factura inexistente ${ingreso.facturaId}.`);
      return;
    }

    if (factura.estado !== "COBRADA") {
      errores.push(`Cobro ${ingreso.id} referencia factura ${factura.id} que no está COBRADA.`);
    }

    if (ingreso.monto !== factura.importeTotal) {
      errores.push(
        `Cobro ${ingreso.id} tiene monto ${ingreso.monto}, pero la factura ${factura.id} tiene importe ${factura.importeTotal}.`
      );
    }

    const netoEsperado = ingreso.monto - ingreso.comision - ingreso.retencion;

    if (ingreso.montoNeto !== netoEsperado) {
      errores.push(
        `Cobro ${ingreso.id} tiene neto ${ingreso.montoNeto}, pero debería ser ${netoEsperado}.`
      );
    }
  });

  return {
    valido: errores.length === 0,
    errores,
  };
}