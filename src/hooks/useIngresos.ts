import { useEffect, useState } from "react";
import type { EstadoCobro, Ingreso, MetodoCobro } from "../domain/ingreso";
import { getConfiguracion } from "../services/configuracionService";
import { updateEstadoEnvio } from "../services/enviosService";
import { emitirFacturaSimulada } from "../services/facturacionService";
import {
  deleteIngreso,
  getIngresos,
  saveIngreso,
} from "../services/ingresosService";
import { getToday } from "../utils/dates";

type NuevoIngresoInput = {
  clienteId?: string;
  cliente: string;
  clienteCuit?: string;
  clienteDireccion?: string;
  envioId?: string;
  concepto: string;
  monto: number;
  metodoCobro: MetodoCobro;
  comision: number;
  retencion: number;
  estado: EstadoCobro;
  facturaEmitida: boolean;
};

export function useIngresos() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);

  useEffect(() => {
    setIngresos(getIngresos());
  }, []);

  function agregarIngreso(input: NuevoIngresoInput) {
    const montoNeto = input.monto - input.comision - input.retencion;

    const nuevoIngreso: Ingreso = {
      id: crypto.randomUUID(),
      fecha: getToday(),
      clienteId: input.clienteId,
      cliente: input.cliente,
      envioId: input.envioId,
      concepto: input.concepto,
      monto: input.monto,
      metodoCobro: input.metodoCobro,
      comision: input.comision,
      retencion: input.retencion,
      montoNeto,
      estado: input.estado,
      facturaEmitida: input.facturaEmitida,
    };

    const actualizados = saveIngreso(nuevoIngreso);

    if (input.facturaEmitida) {
      emitirFacturaSimulada({
        clienteId: input.clienteId,
        cliente: input.cliente,
        clienteCuit: input.clienteCuit,
        clienteDireccion: input.clienteDireccion,
        importeTotal: input.monto,
        configuracion: getConfiguracion(),
      });
    }

    if (input.envioId && input.estado === "COBRADO") {
      updateEstadoEnvio(input.envioId, "COBRADO");
    }

    setIngresos(actualizados);
  }

  function eliminarIngreso(id: string) {
    const ingresoAEliminar = ingresos.find((ingreso) => ingreso.id === id);

    const actualizados = deleteIngreso(id);

    if (ingresoAEliminar?.envioId) {
      updateEstadoEnvio(ingresoAEliminar.envioId, "ENTREGADO");
    }

    setIngresos(actualizados);
  }

  return {
    ingresos,
    agregarIngreso,
    eliminarIngreso,
  };
}