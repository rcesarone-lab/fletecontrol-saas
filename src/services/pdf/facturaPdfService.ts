import jsPDF from "jspdf";
import type { ConfiguracionSistema } from "../../domain/configuracion";
import type { Factura } from "../../domain/factura";

type FacturaPdfData = {
  factura: Factura;
  configuracion: ConfiguracionSistema;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumeroFactura(puntoVenta?: number, numero?: number) {
  const pv = String(puntoVenta ?? 1).padStart(4, "0");
  const nro = String(numero ?? 0).padStart(8, "0");

  return `${pv}-${nro}`;
}

export function descargarFacturaPdf({
  factura,
  configuracion,
}: FacturaPdfData) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const right = pageWidth - margin;

  const puntoVenta =
    factura.puntoVenta ?? configuracion.monotributista.puntoVenta;

  const numeroFactura = formatNumeroFactura(puntoVenta, factura.numero);

  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.4);

  // Marco principal
  doc.rect(margin, 12, pageWidth - margin * 2, 250);

  // Encabezado
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, 12, pageWidth - margin * 2, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("FleteControl-SaaS", margin + 6, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Gestión de fletes y encomiendas", margin + 6, 33);

  // Caja tipo comprobante
  doc.setDrawColor(255, 255, 255);
  doc.rect(pageWidth / 2 - 8, 16, 16, 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("C", pageWidth / 2 - 4, 29);

  doc.setFontSize(9);
  doc.text("FACTURA", right - 42, 22);

  doc.setFont("helvetica", "normal");
  doc.text(`Nro: ${numeroFactura}`, right - 42, 30);
  doc.text(`Fecha: ${factura.fecha}`, right - 42, 37);

  // Reset color
  doc.setTextColor(15, 23, 42);
  doc.setDrawColor(30, 41, 59);

  // Aviso demo
  doc.setFillColor(254, 243, 199);
  doc.rect(margin, 45, pageWidth - margin * 2, 11, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(
    "COMPROBANTE DEMO / NO FISCAL - Pendiente integración AFIP",
    margin + 5,
    52
  );

  // Datos emisor
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Datos del emisor", margin + 5, 68);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Nombre: ${configuracion.monotributista.nombre}`, margin + 5, 78);
  doc.text(
    `CUIT: ${configuracion.monotributista.cuit || "Pendiente"}`,
    margin + 5,
    85
  );
  doc.text(
    `Condición: Monotributo - Categoría ${configuracion.monotributista.categoria}`,
    margin + 5,
    92
  );
  doc.text(`Punto de venta: ${puntoVenta}`, margin + 5, 99);
  doc.text(
    `Vehículo: ${configuracion.vehiculo.modelo} - ${configuracion.vehiculo.patente}`,
    margin + 5,
    106
  );

  // Datos cliente
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Datos del cliente", margin + 5, 124);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Razón social: ${factura.cliente}`, margin + 5, 134);
  doc.text(`CUIT: ${factura.clienteCuit || "Pendiente"}`, margin + 5, 141);
  doc.text(
    `Dirección: ${factura.clienteDireccion || "Pendiente"}`,
    margin + 5,
    148
  );

  // Tabla detalle
  const tableY = 165;

  doc.setFillColor(226, 232, 240);
  doc.rect(margin + 5, tableY, pageWidth - margin * 2 - 10, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Detalle", margin + 8, tableY + 7);
  doc.text("Importe", right - 45, tableY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Servicio de transporte / flete", margin + 8, tableY + 22);
  doc.text(formatCurrency(factura.importeTotal), right - 45, tableY + 22);

  doc.line(margin + 5, tableY + 31, right - 5, tableY + 31);

  // Total
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("TOTAL", right - 70, tableY + 48);
  doc.text(formatCurrency(factura.importeTotal), right - 45, tableY + 48);

  // Espacio AFIP futuro
  doc.setDrawColor(148, 163, 184);
  doc.setLineDashPattern([2, 2], 0);
  doc.rect(margin + 5, 225, pageWidth - margin * 2 - 10, 22);
  doc.setLineDashPattern([], 0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Espacio reservado para CAE / Vencimiento CAE / QR AFIP", margin + 8, 237);

  // Footer
  doc.setFontSize(8);
  doc.text("Documento generado desde FleteControl-SaaS.", margin + 5, 270);
  doc.text("Powered by CRamirez", margin + 5, 276);

  doc.save(`factura-c-${numeroFactura}.pdf`);
}