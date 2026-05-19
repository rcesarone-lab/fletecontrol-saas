import { useEffect, useState } from "react";
import type { MetodoPago, PagoAyudante } from "../domain/ayudante";
import {
  deletePagoAyudante,
  getPagosAyudantes,
  savePagoAyudante,
} from "../services/ayudantesService";
import { getToday } from "../utils/dates";

type NuevoPagoAyudanteInput = {
  ayudanteNombre: string;
  horasTrabajadas: number;
  valorHora: number;
  metodoPago: MetodoPago;
  comprobanteUrl?: string;
};

export function useAyudantes() {
  const [pagos, setPagos] = useState<PagoAyudante[]>([]);

  useEffect(() => {
    setPagos(getPagosAyudantes());
  }, []);

  function agregarPago(input: NuevoPagoAyudanteInput) {
    const nuevoPago: PagoAyudante = {
      id: crypto.randomUUID(),
      fecha: getToday(),
      monto: input.horasTrabajadas * input.valorHora,
      ...input,
    };

    const actualizados = savePagoAyudante(nuevoPago);
    setPagos(actualizados);
  }

  function eliminarPago(id: string) {
    const actualizados = deletePagoAyudante(id);
    setPagos(actualizados);
  }

  return {
    pagos,
    agregarPago,
    eliminarPago,
  };
}