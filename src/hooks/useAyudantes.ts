import { useEffect, useState } from "react";
import type { MetodoPago, PagoAyudante } from "../domain/ayudante";
import {
  deletePagoAyudante,
  getPagosAyudantes,
  savePagoAyudante,
  updatePagoAyudante,
} from "../services/ayudantesService";
import { getToday } from "../utils/dates";

type NuevoPagoAyudanteInput = {
  ayudanteNombre: string;
  horasTrabajadas: number;
  valorHora: number;
  metodoPago: MetodoPago;
  comprobanteUrl?: string;
  fecha?: string;
};

export function useAyudantes() {
  const [pagos, setPagos] = useState<PagoAyudante[]>([]);

  useEffect(() => {
    setPagos(getPagosAyudantes());
  }, []);

  function agregarPago(input: NuevoPagoAyudanteInput) {
    const nuevoPago: PagoAyudante = {
      id: crypto.randomUUID(),
      fecha: input.fecha || getToday(),
      monto: input.horasTrabajadas * input.valorHora,
      ...input,
    };

    const actualizados = savePagoAyudante(nuevoPago);
    setPagos(actualizados);
  }

  function actualizarPago(pago: PagoAyudante) {
    const actualizado: PagoAyudante = {
      ...pago,
      monto: pago.horasTrabajadas * pago.valorHora,
    };

    const actualizados = updatePagoAyudante(actualizado);
    setPagos(actualizados);
  }

  function eliminarPago(id: string) {
    const actualizados = deletePagoAyudante(id);
    setPagos(actualizados);
  }

  return {
    pagos,
    agregarPago,
    actualizarPago,
    eliminarPago,
  };
}