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

export function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) return fallback;

    const parsed = JSON.parse(raw);

    // Migración ENVÍOS v1 → v2
    if (key === STORAGE_KEYS.ENVIOS && Array.isArray(parsed)) {
      return parsed.map((envio) => ({
        ...envio,

        tarifaReferenciaMercado:
          envio.tarifaReferenciaMercado ??
          envio.tarifaGremial ??
          0,
      })) as T;
    }

    // Migración CONFIGURACIÓN v1 → v2
    if (
      key === STORAGE_KEYS.CONFIGURACION &&
      parsed?.tarifas
    ) {
      return {
        ...parsed,

        tarifas: {
          ...parsed.tarifas,

          tarifaReferenciaMercadoDefault:
            parsed.tarifas
              .tarifaReferenciaMercadoDefault ??
            parsed.tarifas
              .tarifaMinimaGremial ??
            0,
        },
      } as T;
    }

    return parsed;
  } catch (error) {
    console.error(
      `Error cargando localStorage key "${key}"`,
      error
    );

    return fallback;
  }
}

export function clearStorage() {
  localStorage.clear();
}