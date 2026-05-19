import { useEffect, useState } from "react";
import type {
  EstadoCobro,
  Ingreso,
  MetodoCobro,
} from "../domain/ingreso";

import {
  deleteIngreso,
  getIngresos,
  saveIngreso,
} from "../services/ingresosService";

import { emitirFacturaSimulada } from "../services/facturacionService";

import { getToday } from "../utils/dates";

type NuevoIngresoInput = {
  cliente: string;

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
    const montoNeto =
      input.monto - input.comision - input.retencion;

    const nuevoIngreso: Ingreso = {
      id: crypto.randomUUID(),

      fecha: getToday(),

      montoNeto,

      ...input,
    };

    const actualizados = saveIngreso(nuevoIngreso);

    if (input.facturaEmitida) {
      emitirFacturaSimulada({
        cliente: input.cliente,
        importeTotal: input.monto,
      });
    }

    setIngresos(actualizados);
  }

  function eliminarIngreso(id: string) {
    const actualizados = deleteIngreso(id);

    setIngresos(actualizados);
  }

  return {
    ingresos,
    agregarIngreso,
    eliminarIngreso,
  };
}