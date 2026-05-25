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

import { getFacturas } from "../../services/facturacionService";
import { getIngresos } from "../../services/ingresosService";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

export default function DashboardCharts() {
  const facturas = getFacturas();
  const ingresos = getIngresos();

  const totalFacturado = facturas.reduce(
    (total, factura) => total + factura.importeTotal,
    0
  );

  const totalCobrado = ingresos.reduce(
    (total, ingreso) => total + ingreso.montoNeto,
    0
  );

  const totalPendiente = facturas
    .filter((factura) => factura.estado === "PENDIENTE_COBRO")
    .reduce((total, factura) => total + factura.importeTotal, 0);

  const resumenData = [
    { nombre: "Facturado", total: totalFacturado },
    { nombre: "Cobrado", total: totalCobrado },
    { nombre: "Pendiente", total: totalPendiente },
  ];

  const metodosMap = ingresos.reduce((acc, ingreso) => {
    acc[ingreso.metodoCobro] = (acc[ingreso.metodoCobro] || 0) + ingreso.montoNeto;
    return acc;
  }, {} as Record<string, number>);

  const metodosData = Object.entries(metodosMap).map(([metodo, total]) => ({
    metodo,
    total,
  }));

  const clientesMap = facturas.reduce((acc, factura) => {
    acc[factura.cliente] = (acc[factura.cliente] || 0) + factura.importeTotal;
    return acc;
  }, {} as Record<string, number>);

  const clientesData = Object.entries(clientesMap)
    .map(([cliente, total]) => ({
      cliente: cliente.length > 16 ? `${cliente.slice(0, 16)}...` : cliente,
      total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const estadoFacturasMap = facturas.reduce((acc, factura) => {
    acc[factura.estado] = (acc[factura.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const estadoFacturasData = Object.entries(estadoFacturasMap).map(
    ([estado, cantidad]) => ({
      estado,
      cantidad,
    })
  );

  return (
    <div className="grid-2" style={{ marginTop: 18 }}>
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Facturado vs cobrado</h2>
            <p className="card-note">Situación financiera consolidada</p>
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
            <h2>Estado de facturas</h2>
            <p className="card-note">Pendientes, cobradas y anuladas</p>
          </div>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={estadoFacturasData}
                dataKey="cantidad"
                nameKey="estado"
                outerRadius={100}
                label
              >
                {estadoFacturasData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
            <h2>Top clientes facturados</h2>
            <p className="card-note">Ranking por facturación emitida</p>
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

      <section className="card">
        <div className="section-header">
          <div>
            <h2>Métodos de cobro</h2>
            <p className="card-note">Distribución por medio de pago</p>
          </div>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={metodosData}
                dataKey="total"
                nameKey="metodo"
                outerRadius={100}
                label
              >
                {metodosData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}