import type { Cliente } from "../domain/cliente";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getClientes(): Cliente[] {
  return loadData<Cliente[]>(STORAGE_KEYS.CLIENTES, []);
}

export function saveCliente(cliente: Cliente): Cliente[] {
  const clientes = getClientes();
  const actualizados = [cliente, ...clientes];

  saveData(STORAGE_KEYS.CLIENTES, actualizados);

  return actualizados;
}

export function deleteCliente(id: string): Cliente[] {
  const clientes = getClientes();
  const actualizados = clientes.filter((cliente) => cliente.id !== id);

  saveData(STORAGE_KEYS.CLIENTES, actualizados);

  return actualizados;
}