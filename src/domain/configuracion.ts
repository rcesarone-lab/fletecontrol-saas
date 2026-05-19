export type ConfiguracionSistema = {
  empresa: string;

  monotributista: {
    nombre: string;
    cuit: string;
    categoria: string;
    puntoVenta: number;
  };

  ayudantes: {
    valorHoraDefault: number;
  };

  vehiculo: {
    patente: string;
    modelo: string;
  };

  tarifas: {
    tarifaMinimaGremial: number;
  };
};