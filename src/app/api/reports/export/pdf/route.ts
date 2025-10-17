import PDFDocument from "pdfkit";
import { prisma } from "@/lib/db";

export async function GET() {
  const doc = new PDFDocument();
  const chunks: Uint8Array[] = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) =>
    doc.on("end", () => resolve(Buffer.concat(chunks)))
  );

  doc.fontSize(18).text("Rapport Mensuel", { underline: true });
  const count = await prisma.booking.count();
  doc.moveDown().fontSize(12).text(`Total réservations: ${count}`);
  doc.end();

  const buf = await done;
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=report.pdf",
    },
  });
}
