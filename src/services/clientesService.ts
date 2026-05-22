import type { Cliente } from "../domain/cliente";
import { registrarEventoAuditoria } from "./auditoriaService";
import { getEnvios } from "./enviosService";
import { loadData, saveData, STORAGE_KEYS } from "./storage";

export function getClientes(): Cliente[] {
  return loadData<Cliente[]>(STORAGE_KEYS.CLIENTES, []);
}

export function saveCliente(cliente: Cliente): Cliente[] {
  const clientes = getClientes();
  const actualizados = [cliente, ...clientes];

  saveData(STORAGE_KEYS.CLIENTES, actualizados);

  registrarEventoAuditoria({
    tipo: "CLIENTE_CREADO",
    descripcion: `Cliente creado: ${cliente.razonSocial}`,
    entidad: "CLIENTE",
    entidadId: cliente.id,
  });

  return actualizados;
}

export function deleteCliente(id: string): Cliente[] {
  const envios = getEnvios();

  const tieneEnvios = envios.some((envio) => envio.clienteId === id);

  if (tieneEnvios) {
    registrarEventoAuditoria({
      tipo: "CLIENTE_ELIMINACION_BLOQUEADA",
      descripcion: "No se puede eliminar un cliente con envíos asociados.",
      entidad: "CLIENTE",
      entidadId: id,
    });

    throw new Error("No se puede eliminar un cliente con envíos asociados.");
  }

  const clientes = getClientes();

  const clienteEliminado = clientes.find((cliente) => cliente.id === id);

  const actualizados = clientes.filter((cliente) => cliente.id !== id);

  saveData(STORAGE_KEYS.CLIENTES, actualizados);

  registrarEventoAuditoria({
    tipo: "CLIENTE_ELIMINADO",
    descripcion: `Cliente eliminado: ${
      clienteEliminado?.razonSocial ?? "sin identificar"
    }`,
    entidad: "CLIENTE",
    entidadId: id,
  });

  return actualizados;
}