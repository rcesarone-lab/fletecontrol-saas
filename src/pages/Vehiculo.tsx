import GastoVehiculoForm from "../components/vehiculo/GastoVehiculoForm";
import GastosVehiculoTable from "../components/vehiculo/GastosVehiculoTable";
import Toast from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import { useVehiculo } from "../hooks/useVehiculo";
import { formatCurrency } from "../utils/currency";

export default function Vehiculo() {
  const { gastos, agregarGasto, eliminarGasto } = useVehiculo();
  const { message, type, showToast, clearToast } = useToast();

  const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);

  const totalCombustible = gastos
    .filter((gasto) => gasto.tipo === "COMBUSTIBLE")
    .reduce((total, gasto) => total + gasto.monto, 0);

  const totalMantenimiento = gastos
    .filter((gasto) => gasto.tipo === "MANTENIMIENTO")
    .reduce((total, gasto) => total + gasto.monto, 0);

  const gastosConVencimiento = gastos.filter((gasto) =>
    Boolean(gasto.vencimiento)
  ).length;

  return (
    <>
      <h1 className="page-title">Vehículo y Gastos</h1>

      <p className="page-description">
        Control de combustible, mantenimiento, seguros, peajes y vencimientos.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Total gastos</div>
          <div className="card-value">{formatCurrency(totalGastos)}</div>
          <div className="card-note">Costo operativo registrado</div>
        </article>

        <article className="card">
          <div className="card-label">Combustible</div>
          <div className="card-value">{formatCurrency(totalCombustible)}</div>
          <div className="card-note">Consumo principal</div>
        </article>

        <article className="card">
          <div className="card-label">Mantenimiento</div>
          <div className="card-value">{formatCurrency(totalMantenimiento)}</div>
          <div className="card-note">Servicios y reparaciones</div>
        </article>

        <article className="card">
          <div className="card-label">Vencimientos</div>
          <div className="card-value">{gastosConVencimiento}</div>
          <div className="card-note">Registros con fecha de control</div>
        </article>
      </section>

      <div style={{ marginTop: 18 }}>
        <GastoVehiculoForm
          onSubmit={agregarGasto}
          onError={(msg) => showToast(msg, "error")}
          onSuccess={(msg) => showToast(msg, "success")}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <GastosVehiculoTable gastos={gastos} onDelete={eliminarGasto} />
      </div>

      <Toast message={message} type={type} onClose={clearToast} />
    </>
  );
}