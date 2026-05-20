import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

import { getEnvios } from "../../services/enviosService";
import { getIngresos } from "../../services/ingresosService";
import { getGastosVehiculo } from "../../services/vehiculoService";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
];

export default function DashboardCharts() {
  const envios = getEnvios();
  const ingresos = getIngresos();
  const gastos = getGastosVehiculo();

  const estadosMap = envios.reduce(
    (acc, envio) => {
      acc[envio.estado] = (acc[envio.estado] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>
  );

  const estadosData = Object.entries(estadosMap).map(
    ([estado, cantidad]) => ({
      estado,
      cantidad,
    })
  );

  const clientesMap = ingresos.reduce(
    (acc, ingreso) => {
      acc[ingreso.cliente] =
        (acc[ingreso.cliente] || 0) + ingreso.montoNeto;

      return acc;
    },
    {} as Record<string, number>
  );

  const clientesData = Object.entries(clientesMap).map(
    ([cliente, total]) => ({
      cliente:
        cliente.length > 14
          ? `${cliente.slice(0, 14)}...`
          : cliente,

      total,
    })
  );

  const totalIngresos = ingresos.reduce(
    (acc, item) => acc + item.montoNeto,
    0
  );

  const totalGastos = gastos.reduce(
    (acc, item) => acc + item.monto,
    0
  );

  const resumenData = [
    {
      nombre: "Ingresos",
      total: totalIngresos,
    },
    {
      nombre: "Gastos",
      total: totalGastos,
    },
  ];

  return (
    <div className="grid-2">
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Ingresos vs Gastos</h2>

            <p className="card-note">
              Comparativo financiero operativo
            </p>
          </div>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={resumenData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="nombre" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="total" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <h2>Estados de envíos</h2>

            <p className="card-note">
              Distribución operativa actual
            </p>
          </div>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={estadosData}
                dataKey="cantidad"
                nameKey="estado"
                outerRadius={100}
                label
              >
                {estadosData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <h2>Facturación por cliente</h2>

            <p className="card-note">
              Clientes con mayor ingreso neto
            </p>
          </div>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={clientesData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="cliente" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="total" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}