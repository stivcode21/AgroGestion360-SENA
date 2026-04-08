import jsPDF from "jspdf";

const drawLabelValue = (doc, label, value, x, y, valueX = 58) => {
  doc.setTextColor(22, 30, 26);
  doc.setFont("helvetica", "bold");
  doc.text(label, x, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(value ?? ""), valueX, y);
};

const drawSectionDivider = (doc, y, pageWidth) => {
  doc.setDrawColor("#C9D1CC");
  doc.line(14, y, pageWidth - 14, y);
};

export const generateActivityPaymentInvoicePdf = (invoiceData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor("#C9D1CC");
  doc.setTextColor(22, 30, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("AgroGestion360", 14, 14);

  doc.setFontSize(18);
  doc.text(invoiceData.title || "Factura de pago", 14, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  drawLabelValue(
    doc,
    "Fecha de generacion:",
    invoiceData.generatedAt || "",
    14,
    34,
  );

  drawSectionDivider(doc, 42, pageWidth);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Datos del trabajador", 14, 51);

  doc.setFontSize(10);
  drawLabelValue(doc, "ID:", invoiceData.worker?.id ?? "", 14, 60, 46);
  drawLabelValue(
    doc,
    "Nombre:",
    invoiceData.worker?.nombre ?? "",
    14,
    68,
    46,
  );
  drawLabelValue(
    doc,
    "Documento:",
    invoiceData.worker?.numeroDocumento ?? "",
    14,
    76,
    46,
  );
  drawLabelValue(doc, "Rol:", invoiceData.worker?.rol ?? "", 14, 84, 46);

  drawSectionDivider(doc, 92, pageWidth);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Datos de la actividad", 14, 101);

  doc.setFontSize(10);
  drawLabelValue(doc, "ID actividad:", invoiceData.activity?.id ?? "", 14, 110, 54);

  doc.setFont("helvetica", "bold");
  doc.text("Actividad:", 14, 118);
  doc.setFont("helvetica", "normal");
  const activityLines = doc.splitTextToSize(
    String(invoiceData.activity?.nombre ?? ""),
    pageWidth - 68,
  );
  doc.text(activityLines, 46, 118);

  const amountY = 118 + activityLines.length * 5 + 3;
  drawLabelValue(
    doc,
    "Monto pagado:",
    invoiceData.activity?.montoPagado ?? "",
    14,
    amountY,
    54,
  );

  drawSectionDivider(doc, amountY + 8, pageWidth);

  const signatureStartY = Math.max(165, amountY + 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Firma", 14, signatureStartY);

  doc.setDrawColor("#6E7C74");
  doc.line(32, signatureStartY + 24, pageWidth - 32, signatureStartY + 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    invoiceData.signature?.label || "Firma del trabajador",
    14,
    signatureStartY + 31,
  );

  doc.setFontSize(9);
  doc.text(`Pagina 1`, pageWidth - 25, pageHeight - 10);

  doc.save(invoiceData.fileName || "factura-pago-actividad.pdf");
};

export const generateFacturaPdf = generateActivityPaymentInvoicePdf;
