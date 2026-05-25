import { useEffect, useState } from "react";
import type { Cliente } from "../domain/cliente";
import {
  deleteCliente,
  getClientes,
  saveCliente,
  updateCliente,
} from "../services/clientesService";

type NuevoClienteInput = {
  razonSocial: string;
  cuit?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
};


export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    setClientes(getClientes());
  }, []);

  function agregarCliente(input: NuevoClienteInput) {
    const nuevoCliente: Cliente = {
      id: crypto.randomUUID(),
      ...input,
    };

    const actualizados = saveCliente(nuevoCliente);
    setClientes(actualizados);
  }

  function actualizarCliente(cliente: Cliente) {
    const actualizados = updateCliente(cliente);
    setClientes(actualizados);
  }

  function eliminarCliente(id: string) {
    const actualizados = deleteCliente(id);
    setClientes(actualizados);
  }

  return {
    clientes,
    agregarCliente,
    eliminarCliente,
    actualizarCliente,
  };
}