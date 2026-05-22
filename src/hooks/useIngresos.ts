import { useEffect, useState } from "react";
import type { EstadoCobro, Ingreso, MetodoCobro } from "../domain/ingreso";
import {
  deleteIngreso,
  getIngresos,
  saveIngreso,
} from "../services/ingresosService";
import { getToday } from "../utils/dates";

type NuevoIngresoInput = {
  facturaId?: string;
  clienteId?: string;
  cliente: string;
  concepto: string;
  monto: number;
  metodoCobro: MetodoCobro;
  referenciaOperacion?: string;
  comision: number;
  retencion: number;
  estado: EstadoCobro;
  observaciones?: string;
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
      facturaId: input.facturaId,
      clienteId: input.clienteId,
      cliente: input.cliente,
      concepto: input.concepto,
      monto: input.monto,
      metodoCobro: input.metodoCobro,
      referenciaOperacion: input.referenciaOperacion,
      comision: input.comision,
      retencion: input.retencion,
      montoNeto,
      estado: input.estado,
      observaciones: input.observaciones,
    };

    const actualizados = saveIngreso(nuevoIngreso);
    setIngresos(actualizados);
  }

  function eliminarIngreso(id: string) {
    const actualizados = deleteIngreso(id);
    setIngresos(actualizados);
  }

  function refrescarIngresos() {
    setIngresos(getIngresos());
  }

  return {
    ingresos,
    agregarIngreso,
    eliminarIngreso,
    refrescarIngresos,
  };
}