import PDFDocument from "pdfkit";

export async function generateAnalysisPdf(options: {
  title: string;
  teamA: string;
  teamB: string;
  competition: string;
  resultText: string;
  resultJson: Record<string, unknown>;
}) {
  const doc = new PDFDocument({ margin: 40 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text(options.title, { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Confronto: ${options.teamA} x ${options.teamB}`);
  doc.text(`Campeonato: ${options.competition}`);
  doc.moveDown();
  doc.fontSize(14).text("Resumo humano", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(options.resultText, { align: "left" });
  doc.moveDown();
  doc.fontSize(14).text("JSON estruturado", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).text(JSON.stringify(options.resultJson, null, 2));

  doc.end();

  return await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
