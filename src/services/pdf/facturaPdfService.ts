import jsPDF from "jspdf";
import type { Factura } from "../../domain/factura";
import type { ConfiguracionSistema } from "../../domain/configuracion";

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

export function descargarFacturaPdf({
  factura,
  configuracion,
}: FacturaPdfData) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("FleteControl-SaaS", 20, 22);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Gestión de fletes y encomiendas", 20, 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.text("C", pageWidth / 2 - 5, 24);

  doc.setFontSize(12);
  doc.text("FACTURA", pageWidth - 55, 22);

  doc.setFont("helvetica", "normal");
  doc.text(
    `Punto de Venta: ${factura.puntoVenta ?? configuracion.monotributista.puntoVenta}`,
    pageWidth - 75,
    32
  );

  doc.text(
    `Nro: ${String(factura.numero ?? 0).padStart(8, "0")}`,
    pageWidth - 75,
    39
  );

  doc.text(`Fecha: ${factura.fecha}`, pageWidth - 75, 46);

  doc.line(20, 55, pageWidth - 20, 55);

  doc.setFont("helvetica", "bold");
  doc.text("Datos del emisor", 20, 68);

  doc.setFont("helvetica", "normal");
  doc.text(`Nombre: ${configuracion.monotributista.nombre}`, 20, 78);
  doc.text(`CUIT: ${configuracion.monotributista.cuit || "Pendiente"}`, 20, 86);
  doc.text(`Categoría Monotributo: ${configuracion.monotributista.categoria}`, 20, 94);
  doc.text(`Vehículo: ${configuracion.vehiculo.modelo} - ${configuracion.vehiculo.patente}`, 20, 102);

  doc.setFont("helvetica", "bold");
  doc.text("Datos del cliente", 20, 120);

  doc.setFont("helvetica", "normal");
  doc.text(`Cliente: ${factura.cliente}`, 20, 130);
  doc.text("Condición IVA: Consumidor / Responsable según corresponda", 20, 138);

  doc.line(20, 150, pageWidth - 20, 150);

  doc.setFont("helvetica", "bold");
  doc.text("Detalle", 20, 164);
  doc.text("Importe", pageWidth - 55, 164);

  doc.setFont("helvetica", "normal");
  doc.text("Servicio de transporte / flete", 20, 178);
  doc.text(formatCurrency(factura.importeTotal), pageWidth - 55, 178);

  doc.line(20, 195, pageWidth - 20, 195);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TOTAL", pageWidth - 75, 210);
  doc.text(formatCurrency(factura.importeTotal), pageWidth - 55, 210);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Factura C - Documento demo generado por FleteControl-SaaS.", 20, 245);
  doc.text("Este comprobante es una representación visual para piloto/demo.", 20, 252);
  doc.text("Powered by CRamirez", 20, 265);

  doc.save(
    `factura-c-${factura.puntoVenta ?? 1}-${String(factura.numero ?? 0).padStart(
      8,
      "0"
    )}.pdf`
  );
}