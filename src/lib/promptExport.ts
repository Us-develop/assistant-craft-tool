import { jsPDF } from "jspdf";

function sanitizeFilePart(name: string): string {
  return name
    .replace(/[/\\?%*:|"<>.\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "assistant";
}

/**
 * Download prompt text as a multi-page A4 PDF.
 */
export function downloadPromptPdf(
  content: string,
  options: {
    filePrefix: string;
    titleLine?: string;
    lang: "nl" | "en";
    variant: "instruction" | "kickoff";
  },
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 16;
  const maxW = 180;
  const lineH = 5;
  const pageH = doc.internal.pageSize.getHeight();
  const defaultTitle =
    options.variant === "kickoff"
      ? options.lang === "nl"
        ? "Kick-off bericht"
        : "Kick-off message"
      : options.lang === "nl"
        ? "Systeeminstructie"
        : "System instruction";
  const title = options.titleLine ?? defaultTitle;

  doc.setFontSize(14);
  doc.text(title, margin, margin);
  doc.setFontSize(9);
  let y = margin + 8;

  const bodyLines = doc.splitTextToSize(content, maxW);
  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i] as string;
    if (y > pageH - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineH;
  }

  const variantKey =
    options.variant === "instruction"
      ? options.lang === "nl"
        ? "systeeminstructie"
        : "system-instruction"
      : "kickoff";
  const fileName = `${sanitizeFilePart(options.filePrefix)}-${variantKey}.pdf`;
  doc.save(fileName);
}

export function buildMailtoOpenInstruction(
  lang: "nl" | "en",
  assistantName: string,
  activeTab: "instruction" | "kickoff",
): { subject: string; body: string } {
  const name = assistantName.trim() || (lang === "nl" ? "AI-assistent" : "AI assistant");
  if (activeTab === "kickoff") {
    return {
      subject:
        lang === "nl" ? `Kick-off bericht: ${name}` : `Kick-off message: ${name}`,
      body:
        lang === "nl"
          ? "Plak hieronder je kick-off bericht (al gekopieerd naar je klembord).\n"
          : "Paste your kick-off message below (already copied to your clipboard).\n",
    };
  }
  return {
    subject: lang === "nl" ? `Systeemprompt: ${name}` : `System prompt: ${name}`,
    body:
      lang === "nl"
        ? "Plak hieronder je volledige systeemprompt (al gekopieerd naar je klembord).\n"
        : "Paste your full system prompt below (already copied to your clipboard).\n",
  };
}
