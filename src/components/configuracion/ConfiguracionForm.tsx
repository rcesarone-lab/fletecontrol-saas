import { type FormEvent, useState } from "react";
import type { ConfiguracionSistema } from "../../domain/configuracion";

type ConfiguracionFormProps = {
  configuracion: ConfiguracionSistema;
  onSubmit: (data: ConfiguracionSistema) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export default function ConfiguracionForm({
  configuracion,
  onSubmit,
  onError,
  onSuccess,
}: ConfiguracionFormProps) {
  const [empresa, setEmpresa] = useState(configuracion.empresa);
  const [nombre, setNombre] = useState(configuracion.monotributista.nombre);
  const [cuit, setCuit] = useState(configuracion.monotributista.cuit || "");
  const [categoria, setCategoria] = useState(
    configuracion.monotributista.categoria
  );
  const [puntoVenta, setPuntoVenta] = useState(
    configuracion.monotributista.puntoVenta
  );
  const [valorHoraDefault, setValorHoraDefault] = useState(
    configuracion.ayudantes.valorHoraDefault
  );
  const [patente, setPatente] = useState(configuracion.vehiculo.patente);
  const [modelo, setModelo] = useState(configuracion.vehiculo.modelo);
  const [tarifaMinimaGremial, setTarifaMinimaGremial] = useState(
    configuracion.tarifas.tarifaMinimaGremial
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!empresa.trim()) {
      onError("Completá el nombre del proyecto o empresa.");
      return;
    }

    if (!nombre.trim()) {
      onError("Completá el nombre del monotributista.");
      return;
    }

    if (puntoVenta <= 0) {
      onError("El punto de venta debe ser mayor a cero.");
      return;
    }

    if (valorHoraDefault <= 0) {
      onError("El valor hora debe ser mayor a cero.");
      return;
    }

    if (tarifaMinimaGremial <= 0) {
      onError("La tarifa mínima gremial debe ser mayor a cero.");
      return;
    }

    onSubmit({
      empresa,
      monotributista: {
        nombre,
        cuit,
        categoria,
        puntoVenta,
      },
      ayudantes: {
        valorHoraDefault,
      },
      vehiculo: {
        patente,
        modelo,
      },
      tarifas: {
        tarifaMinimaGremial,
      },
    });

    onSuccess("Configuración actualizada correctamente.");
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Nombre del sistema / empresa</label>
        <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
      </div>

      <div className="form-field">
        <label>Nombre del monotributista</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>

      <div className="form-field">
        <label>CUIT</label>
        <input
          value={cuit}
          onChange={(e) => setCuit(e.target.value)}
          placeholder="Ej: 20-12345678-9"
        />
      </div>

      <div className="form-field">
        <label>Categoría monotributo</label>
        <input
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          placeholder="Ej: C"
        />
      </div>

      <div className="form-field">
        <label>Punto de venta</label>
        <input
          type="number"
          value={puntoVenta}
          onChange={(e) => setPuntoVenta(Number(e.target.value))}
        />
      </div>

      <div className="form-field">
        <label>Valor hora ayudante</label>
        <input
          type="number"
          value={valorHoraDefault}
          onChange={(e) => setValorHoraDefault(Number(e.target.value))}
        />
      </div>

      <div className="form-field">
        <label>Patente vehículo</label>
        <input value={patente} onChange={(e) => setPatente(e.target.value)} />
      </div>

      <div className="form-field">
        <label>Modelo vehículo</label>
        <input value={modelo} onChange={(e) => setModelo(e.target.value)} />
      </div>

      <div className="form-field">
        <label>Tarifa referencia mercado</label>
        <input
          type="number"
          value={tarifaMinimaGremial}
          onChange={(e) => setTarifaMinimaGremial(Number(e.target.value))}
        />
      </div>

      <button className="primary-button" type="submit">
        Guardar configuración
      </button>
    </form>
  );
}