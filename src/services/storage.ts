export const STORAGE_KEYS = {
  ENVIOS: "FC_ENVIOS",

  CLIENTES: "FC_CLIENTES",

  AYUDANTES: "FC_AYUDANTES",

  VEHICULO_GASTOS: "FC_VEHICULO_GASTOS",

  FACTURAS: "FC_FACTURAS",

  INGRESOS: "FC_INGRESOS",

  CONFIGURACION: "FC_CONFIGURACION",
};

export function saveData<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadData<T>(key: string, defaultValue: T): T {
  const raw = localStorage.getItem(key);

  if (!raw) {
    return defaultValue;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error parsing localStorage", error);

    return defaultValue;
  }
}

export function clearStorage() {
  localStorage.clear();
}