import { PDFParse } from "pdf-parse";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const MAX_TEXT_OUT = 25_000;

function isTextFileName(name: string): boolean {
  return /\.(txt|md|markdown|csv)$/i.test(name);
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return Response.json(
        { error: "File too large (max 4 MB per file)" },
        { status: 413 },
      );
    }

    const name = file.name || "upload";
    const buf = Buffer.from(await file.arrayBuffer());

    let text: string;

    if (file.type === "application/pdf" || name.toLowerCase().endsWith(".pdf")) {
      const parser = new PDFParse({ data: new Uint8Array(buf) });
      try {
        const result = await parser.getText();
        text = (result.text ?? "").trim();
      } finally {
        await parser.destroy().catch(() => {});
      }
    } else if (file.type.startsWith("text/") || isTextFileName(name)) {
      text = buf.toString("utf8");
    } else {
      return Response.json(
        { error: "Unsupported type. Use PDF, TXT, or Markdown." },
        { status: 415 },
      );
    }

    if (text.length > MAX_TEXT_OUT) {
      text = text.slice(0, MAX_TEXT_OUT) + "\n[... truncated by server]";
    }

    if (!text.trim()) {
      return Response.json(
        { error: "No text could be extracted. Try a text-based PDF or a .txt/.md file." },
        { status: 422 },
      );
    }

    return Response.json({ name, text: text.trim() });
  } catch (error) {
    console.error("extract-document error:", error);
    return Response.json(
      { error: "Could not read this file. Try another format or a smaller file." },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
