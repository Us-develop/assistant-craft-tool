"use client";

import { useCallback, useRef, useState } from "react";
import { CONTEXT_DOC_LIMITS } from "@/lib/contextDocuments";
import { tr } from "@/lib/translations";
import type { Lang, WizardData } from "@/lib/wizardSchema";
import { Paperclip, Loader2, X, FileText } from "lucide-react";

type Props = {
  lang: Lang;
  documents: WizardData["contextDocuments"];
  onChange: (next: WizardData["contextDocuments"]) => void;
};

const ACCEPT = ".pdf,.txt,.md,.markdown,text/plain";
const MAX_CLIENT_BYTES = 4 * 1024 * 1024;

export default function ContextDocumentUpload({ lang, documents, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList?.length) return;
      setError(null);

      let list = [...documents];
      for (const file of Array.from(fileList)) {
        if (list.length >= CONTEXT_DOC_LIMITS.maxFiles) {
          setError(
            tr("step1.uploadErrorMaxFiles", lang).replace(
              "{n}",
              String(CONTEXT_DOC_LIMITS.maxFiles),
            ),
          );
          break;
        }

        if (file.size > MAX_CLIENT_BYTES) {
          setError(tr("step1.uploadErrorTooLarge", lang));
          continue;
        }

        setBusy(true);
        try {
          const form = new FormData();
          form.set("file", file);
          const res = await fetch("/api/ai/extract-document", {
            method: "POST",
            body: form,
          });
          const payload = (await res.json().catch(() => ({}))) as { name?: string; text?: string; error?: string };

          if (!res.ok) {
            setError(payload.error || tr("step1.uploadErrorGeneric", lang));
            continue;
          }

          if (!payload.text?.trim()) {
            setError(tr("step1.uploadErrorEmpty", lang));
            continue;
          }

          let text = payload.text;
          if (text.length > CONTEXT_DOC_LIMITS.maxCharsPerFile) {
            text = text.slice(0, CONTEXT_DOC_LIMITS.maxCharsPerFile) + "\n[...truncated]";
          }

          const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
          const name = payload.name || file.name;
          list = [...list, { id, name, text }];
        } catch {
          setError(tr("step1.uploadErrorGeneric", lang));
        } finally {
          setBusy(false);
        }
      }

      onChange(list);
      if (inputRef.current) inputRef.current.value = "";
    },
    [documents, lang, onChange],
  );

  const remove = (id: string) => {
    onChange(documents.filter((d) => d.id !== id));
    setError(null);
  };

  return (
    <div className="rounded-(--radius-m) border border-(--color-border) bg-(--color-secondary) p-4">
      <div className="mb-2 flex items-start gap-2">
        <span className="text-(--color-primary)">
          <Paperclip className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-medium text-(--color-foreground)">{tr("step1.uploadTitle", lang)}</p>
          <p className="mt-1 text-xs text-(--color-muted-foreground)">{tr("step1.uploadHint", lang)}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          disabled={busy || documents.length >= CONTEXT_DOC_LIMITS.maxFiles}
          onChange={(e) => {
            void addFiles(e.target.files);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy || documents.length >= CONTEXT_DOC_LIMITS.maxFiles}
          className="inline-flex items-center gap-1.5 rounded-full border border-(--color-foreground) bg-(--color-card) px-3 py-1.5 text-sm font-medium text-(--color-foreground) transition-colors hover:bg-(--color-muted) disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          {tr("step1.uploadButton", lang)}
        </button>
        {documents.length > 0 && (
          <span className="text-xs text-(--color-muted-foreground)">
            {documents.length}/{CONTEXT_DOC_LIMITS.maxFiles}
          </span>
        )}
      </div>

      {documents.length > 0 && (
        <ul className="mt-3 space-y-2">
          {documents.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-2 rounded-(--radius-m) border border-(--color-border) bg-(--color-card) px-3 py-2 text-sm"
            >
              <span className="min-w-0 flex-1 truncate" title={d.name}>
                {d.name}
              </span>
              <span className="shrink-0 text-xs text-(--color-muted-foreground)">
                {d.text.length.toLocaleString()} {tr("step1.uploadChars", lang)}
              </span>
              <button
                type="button"
                onClick={() => remove(d.id)}
                className="shrink-0 rounded-full p-1 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground)"
                aria-label={tr("step1.uploadRemove", lang)}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-2 text-xs text-(--color-destructive)">{error}</p>}
    </div>
  );
}
