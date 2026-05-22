import { useEffect, useState } from "react";
import type { Envio, EstadoEnvio } from "../domain/envio";
import {
  deleteEnvio,
  getEnvios,
  saveEnvio,
  updateEstadoEnvio,
} from "../services/enviosService";
import { getToday } from "../utils/dates";

type NuevoEnvioInput = {
  clienteId: string;
  empresaCliente: string;
  materiales: string;
  direccionDestino: string;
  localidad: string;
  provincia: string;
  tarifaReferenciaMercado: number;
  tarifaContratante: number;
  costoEstimado: number;
  observaciones?: string;
};

export function useEnvios() {
  const [envios, setEnvios] = useState<Envio[]>([]);

  useEffect(() => {
    setEnvios(getEnvios());
  }, []);

  function agregarEnvio(input: NuevoEnvioInput) {
    const nuevoEnvio: Envio = {
      id: crypto.randomUUID(),
      fecha: getToday(),
      estado: "PENDIENTE",
      ...input,
    };

    const actualizados = saveEnvio(nuevoEnvio);
    setEnvios(actualizados);
  }

  function cambiarEstado(id: string, estado: EstadoEnvio) {
    const actualizados = updateEstadoEnvio(id, estado);
    setEnvios(actualizados);
  }

  function eliminarEnvio(id: string) {
    const actualizados = deleteEnvio(id);
    setEnvios(actualizados);
  }

  function refrescarEnvios() {
    setEnvios(getEnvios());
  }

  return {
    envios,
    agregarEnvio,
    cambiarEstado,
    eliminarEnvio,
    refrescarEnvios,
  };
}