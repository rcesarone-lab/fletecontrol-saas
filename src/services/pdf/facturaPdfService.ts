import jsPDF from "jspdf";
import type { ConfiguracionSistema } from "../../domain/configuracion";
import type { Factura } from "../../domain/factura";
import { getEnvios } from "../enviosService";

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

  const envios = getEnvios().filter((envio) =>
    factura.envioIds.includes(envio.id)
  );

  const pageWidth = doc.internal.pageSize.getWidth();

  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  const puntoVenta =
    factura.puntoVenta ?? configuracion.monotributista.puntoVenta;

  const numeroFactura = formatNumeroFactura(
    puntoVenta,
    factura.numero
  );

  // Fondo header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 38, "F");

  // Marca
  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);

  doc.text("FleteControl-SaaS", margin, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("Gestión de fletes y encomiendas", margin, 24);

  // Caja factura
  doc.setDrawColor(255, 255, 255);
  doc.rect(pageWidth / 2 - 10, 5, 20, 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);

  doc.text("C", pageWidth / 2 - 3, 18);

  doc.setFontSize(10);
  doc.text("Categoría C", pageWidth / 2 - 8, 30);

  // Datos factura
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  doc.text("FACTURA", pageWidth - 60, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Nro: ${numeroFactura}`, pageWidth - 60, 24);

  doc.text(`Fecha: ${factura.fecha}`, pageWidth - 60, 32);

  if (factura.periodoDesde && factura.periodoHasta) {
    doc.text(
      `Período: ${factura.periodoDesde} al ${factura.periodoHasta}`,
      pageWidth - 60,
      40
    );
  }

  // Aviso demo
  doc.setFillColor(254, 243, 199);
  doc.rect(0, 40, pageWidth, 10, "F");

  doc.setTextColor(15, 23, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(
    "COMPROBANTE DEMO / NO FISCAL - Pendiente integración AFIP",
    margin,
    47
  );

  // Cards
  const cardY = 58;
  const cardHeight = 68;
  const cardGap = 6;

  const cardWidth = (contentWidth - cardGap) / 2;

  // Emisor
  doc.setDrawColor(203, 213, 225);

  doc.roundedRect(
    margin,
    cardY,
    cardWidth,
    cardHeight,
    2,
    2
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text("DATOS DEL EMISOR", margin + 8, cardY + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let emisorY = cardY + 24;

  doc.text(
    `Nombre: ${configuracion.monotributista.nombre}`,
    margin + 8,
    emisorY
  );

  emisorY += 8;

  doc.text(
    `CUIT: ${configuracion.monotributista.cuit || "Pendiente"}`,
    margin + 8,
    emisorY
  );

  emisorY += 8;

  doc.text(
    `Condición IVA: Monotributo - Categoría ${configuracion.monotributista.categoria}`,
    margin + 8,
    emisorY
  );

  emisorY += 8;

  doc.text(
    `Punto de venta: ${puntoVenta}`,
    margin + 8,
    emisorY
  );

  emisorY += 8;

  doc.text(
    `Vehículo: ${configuracion.vehiculo.modelo} - ${configuracion.vehiculo.patente}`,
    margin + 8,
    emisorY
  );

  // Cliente
  const clienteX = margin + cardWidth + cardGap;

  doc.roundedRect(
    clienteX,
    cardY,
    cardWidth,
    cardHeight,
    2,
    2
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text("DATOS DEL CLIENTE", clienteX + 8, cardY + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let clienteY = cardY + 24;

  doc.text(
    `Razón social: ${factura.cliente}`,
    clienteX + 8,
    clienteY
  );

  clienteY += 10;

  doc.text(
    `CUIT: ${factura.clienteCuit || "Pendiente"}`,
    clienteX + 8,
    clienteY
  );

  clienteY += 8;

  doc.text(
    `Dirección: ${factura.clienteDireccion || "Pendiente"}`,
    clienteX + 8,
    clienteY
  );

  // Tabla detalle
  const tableY = 145;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text(
    "DETALLE DE SERVICIOS FACTURADOS",
    margin,
    tableY
  );

  const startY = tableY + 8;

  const columns = [
    { label: "Fecha", x: margin },
    { label: "Descripción", x: margin + 26 },
    { label: "Destino", x: margin + 108 },
    { label: "Importe", x: margin + 166 },
  ];

  doc.setFillColor(226, 232, 240);

  doc.rect(margin, startY, contentWidth, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  columns.forEach((column) => {
    doc.text(column.label, column.x + 2, startY + 7);
  });

  let rowY = startY + 10;

  doc.setFont("helvetica", "normal");

  envios.forEach((envio) => {
    rowY += 10;

    doc.text(envio.fecha, margin + 2, rowY);

    doc.text(
      envio.materiales.substring(0, 32),
      margin + 26,
      rowY
    );

    doc.text(
      `${envio.localidad}`.substring(0, 20),
      margin + 100,
      rowY
    );

    doc.text(
      formatCurrency(envio.tarifaContratante),
      margin + 168,
      rowY
    );

    doc.line(margin, rowY + 4, margin + contentWidth, rowY + 4);
  });

  // =========================
  // TOTAL A FACTURAR
  // =========================

  const totalsY = rowY + 18;
  const totalBoxWidth = 78;
  const totalBoxHeight = 28;
  const totalBoxX = pageWidth - margin - totalBoxWidth;

  doc.setFillColor(15, 23, 42);

  doc.roundedRect(
    totalBoxX,
    totalsY,
    totalBoxWidth,
    totalBoxHeight,
    2,
    2,
    "F"
  );

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text("TOTAL A FACTURAR", totalBoxX + 8, totalsY + 10);

  doc.setFontSize(17);

  doc.text(
    formatCurrency(factura.importeTotal),
    totalBoxX + 8,
    totalsY + 22
  );

  // Cantidad de servicios
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(
    `Cantidad de servicios incluidos: ${envios.length}`,
    margin,
    totalsY + 10
  );

  doc.text(
    `Concepto: ${factura.concepto}`,
    margin,
    totalsY + 20
  );

  // =========================
  // BLOQUE AFIP DEMO
  // =========================

  const afipY = totalsY + 54;

  doc.setDrawColor(203, 213, 225);

  doc.roundedRect(
    margin,
    afipY,
    contentWidth,
    32,
    2,
    2
  );

  // QR DEMO
  doc.setFillColor(226, 232, 240);

  doc.rect(margin + 6, afipY + 6, 18, 18, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);

  doc.text("QR", margin + 11, afipY + 16);

  // Datos CAE demo
  doc.setTextColor(15, 23, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text("CAE DEMO", margin + 32, afipY + 10);

  doc.setFont("helvetica", "normal");

  doc.text(
    "00000000000000",
    margin + 32,
    afipY + 18
  );

  doc.text(
    "Vencimiento CAE: 31/12/2026",
    margin + 32,
    afipY + 26
  );

  // Leyenda derecha
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "Documento demo generado desde FleteControl-SaaS.",
    pageWidth - 88,
    afipY + 12
  );

  doc.text(
    "Comprobante no válido como factura fiscal.",
    pageWidth - 88,
    afipY + 19
  );

  doc.text(
    "Powered by CRamirez",
    pageWidth - 88,
    afipY + 26
  );

  doc.save(`factura-c-${numeroFactura}.pdf`);
}