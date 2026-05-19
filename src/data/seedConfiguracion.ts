import type { ConfiguracionSistema } from "../domain/configuracion";

export const seedConfiguracion: ConfiguracionSistema = {
  empresa: "FleteControl-SaaS",

  monotributista: {
    nombre: "Transportista Demo",
    cuit: "",
    categoria: "C",
    puntoVenta: 1,
  },

  ayudantes: {
    valorHoraDefault: 4500,
  },

  vehiculo: {
    patente: "AA000AA",
    modelo: "Utilitario Demo",
  },

  tarifas: {
    tarifaMinimaGremial: 0,
  },
};