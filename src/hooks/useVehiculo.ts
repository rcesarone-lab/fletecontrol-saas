import { useEffect, useState } from "react";
import type { GastoVehiculo, TipoGastoVehiculo } from "../domain/vehiculo";
import {
  deleteGastoVehiculo,
  getGastosVehiculo,
  saveGastoVehiculo,
  updateGastoVehiculo,
} from "../services/vehiculoService";
import { getToday } from "../utils/dates";

type NuevoGastoVehiculoInput = {
  tipo: TipoGastoVehiculo;
  descripcion: string;
  monto: number;
  vencimiento?: string;
  fecha?: string;
};

export function useVehiculo() {
  const [gastos, setGastos] = useState<GastoVehiculo[]>([]);

  useEffect(() => {
    setGastos(getGastosVehiculo());
  }, []);

  function agregarGasto(input: NuevoGastoVehiculoInput) {
    const nuevoGasto: GastoVehiculo = {
      id: crypto.randomUUID(),
      fecha: input.fecha || getToday(),
      ...input,
    };

    const actualizados = saveGastoVehiculo(nuevoGasto);
    setGastos(actualizados);
  }

  function actualizarGasto(gasto: GastoVehiculo) {
    const actualizados = updateGastoVehiculo(gasto);
    setGastos(actualizados);
  }

  function eliminarGasto(id: string) {
    const actualizados = deleteGastoVehiculo(id);
    setGastos(actualizados);
  }

  return {
    gastos,
    agregarGasto,
    actualizarGasto,
    eliminarGasto,
  };
}