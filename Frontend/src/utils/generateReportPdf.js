import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateReportPdf = (reportData) => {
  // Se crea una hoja PDF vacia sobre la que luego dibujamos todo.
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  //configuracion inicial
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("AgroGestion360", 14, 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(reportData.title || "Reporte", 14, 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // La introduccion puede ocupar varias lineas, por eso se divide automaticamente.
  const introLines = doc.splitTextToSize(reportData.intro || "", 180);
  doc.text(introLines, 14, 32);

  let y = 32 + introLines.length * 5 + 6;

  if (reportData.periodLabel) {
    doc.setFont("helvetica", "bold");
    doc.text("Periodo:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(reportData.periodLabel, 55, y);
    y += 6;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Fecha de generacion:", 14, y);
  doc.setFont("helvetica", "normal");
  doc.text(reportData.generatedAt || "", 55, y);

  // Estas dos estructuras convierten columnas y filas del JSON en una tabla dinamica.
  const head = [(reportData.columns || []).map((column) => column.header)];
  const body = (reportData.rows || []).map((row) =>
    (reportData.columns || []).map((column) => row[column.key] ?? ""),
  );

  // AutoTable dibuja la tabla completa y agrega nuevas paginas si hace falta.
  autoTable(doc, {
    startY: y + 10,
    head,
    body,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
      valign: "middle",
    },
    headStyles: {
      fillColor: [220, 239, 229],
      textColor: [35, 64, 51],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [249, 251, 252],
    },
    didDrawPage: ({ pageNumber }) => {
      doc.setFontSize(9);
      doc.text(`Pagina ${pageNumber}`, pageWidth - 25, pageHeight - 10);
    },
  });

  // Al final dispara la descarga del archivo en el navegador.
  doc.save(reportData.fileName || "reporte.pdf");
};
