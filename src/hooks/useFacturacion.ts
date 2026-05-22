import { useEffect, useState } from "react";
import type { Envio } from "../domain/envio";
import type { Factura } from "../domain/factura";
import {
  emitirFacturaPorCorte,
  getEnviosFacturables,
  getFacturas,
} from "../services/facturacionService";

type BuscarFacturablesInput = {
  clienteId: string;
  desde?: string;
  hasta?: string;
};

type EmitirCorteInput = {
  clienteId: string;
  envioIds: string[];
  periodoDesde?: string;
  periodoHasta?: string;
  concepto?: string;
};

export function useFacturacion() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [enviosFacturables, setEnviosFacturables] = useState<Envio[]>([]);

  useEffect(() => {
    setFacturas(getFacturas());
  }, []);

  function buscarEnviosFacturables(input: BuscarFacturablesInput) {
    const encontrados = getEnviosFacturables(input);
    setEnviosFacturables(encontrados);
  }

  function emitirCorte(input: EmitirCorteInput) {
    emitirFacturaPorCorte(input);
    setFacturas(getFacturas());
    setEnviosFacturables([]);
  }

  function refrescarFacturas() {
    setFacturas(getFacturas());
  }

  return {
    facturas,
    enviosFacturables,
    buscarEnviosFacturables,
    emitirCorte,
    refrescarFacturas,
  };
}