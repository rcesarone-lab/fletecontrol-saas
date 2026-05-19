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

export function descargarFacturaPdf({
  factura,
  configuracion,
}: FacturaPdfData) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("FleteControl-SaaS", 20, 22);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Gestión de fletes y encomiendas", 20, 30);

  doc.rect(pageWidth / 2 - 8, 12, 16, 18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("C", pageWidth / 2 - 4, 25);

  doc.setFontSize(12);
  doc.text("FACTURA", pageWidth - 55, 20);

  doc.setFont("helvetica", "normal");
  doc.text(
    `Punto de Venta: ${
      factura.puntoVenta ?? configuracion.monotributista.puntoVenta
    }`,
    pageWidth - 75,
    30
  );

  doc.text(
    `Nro: ${String(factura.numero ?? 0).padStart(8, "0")}`,
    pageWidth - 75,
    37
  );

  doc.text(`Fecha: ${factura.fecha}`, pageWidth - 75, 44);

  doc.line(20, 55, pageWidth - 20, 55);

  doc.setFont("helvetica", "bold");
  doc.text("Datos del emisor", 20, 68);

  doc.setFont("helvetica", "normal");
  doc.text(`Nombre: ${configuracion.monotributista.nombre}`, 20, 78);
  doc.text(`CUIT: ${configuracion.monotributista.cuit || "Pendiente"}`, 20, 86);
  doc.text(
    `Categoría Monotributo: ${configuracion.monotributista.categoria}`,
    20,
    94
  );
  doc.text(
    `Vehículo: ${configuracion.vehiculo.modelo} - ${configuracion.vehiculo.patente}`,
    20,
    102
  );

  doc.setFont("helvetica", "bold");
  doc.text("Datos del cliente", 20, 120);

  doc.setFont("helvetica", "normal");
  doc.text(`Razón social: ${factura.cliente}`, 20, 130);
  doc.text(`CUIT: ${factura.clienteCuit || "Pendiente"}`, 20, 138);
  doc.text(`Dirección: ${factura.clienteDireccion || "Pendiente"}`, 20, 146);

  doc.line(20, 158, pageWidth - 20, 158);

  doc.setFont("helvetica", "bold");
  doc.text("Detalle", 20, 172);
  doc.text("Importe", pageWidth - 55, 172);

  doc.setFont("helvetica", "normal");
  doc.text("Servicio de transporte / flete", 20, 186);
  doc.text(formatCurrency(factura.importeTotal), pageWidth - 55, 186);

  doc.line(20, 203, pageWidth - 20, 203);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TOTAL", pageWidth - 75, 218);
  doc.text(formatCurrency(factura.importeTotal), pageWidth - 55, 218);

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