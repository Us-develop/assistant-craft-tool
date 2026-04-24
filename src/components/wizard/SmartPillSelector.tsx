"use client";

import { useState } from "react";
import { useWizard } from "./WizardContext";
import { Sparkles, Loader2, X } from "lucide-react";

interface SmartPillSelectorProps {
  category: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}

export default function SmartPillSelector({
  category,
  options,
  selected,
  onToggle,
}: SmartPillSelectorProps) {
  const { lang, data } = useWizard();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          currentSelections: selected,
          data,
          lang,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const result = await response.json();
      const raw = Array.isArray(result.suggestions) ? (result.suggestions as string[]) : [];
      // Only exclude fixed options and already-selected items — not the previous
      // ghost list, so a second "Suggest more" replaces with a fresh batch.
      const newSuggestions = raw.filter(
        (s) => typeof s === "string" && !options.includes(s) && !selected.includes(s),
      );
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error("Suggestion error:", err);
      setError(lang === "nl" ? "Kon geen suggesties ophalen" : "Could not fetch suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    onToggle(suggestion);
    setSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

  const handleDismissSuggestion = (suggestion: string) => {
    setSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`pill-tag ${selected.includes(opt) ? "active" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion}-${index}`}
              className="group relative inline-flex items-center gap-1 rounded-full border border-dashed border-(--color-lavender) bg-(--color-titan-white) px-3 py-1.5 text-sm text-(--color-foreground)"
            >
              <button
                type="button"
                onClick={() => handleAcceptSuggestion(suggestion)}
                className="hover:underline"
              >
                {suggestion}
              </button>
              <button
                type="button"
                onClick={() => handleDismissSuggestion(suggestion)}
                className="ml-1 rounded-full p-0.5 text-(--color-muted-foreground) transition-colors hover:bg-(--color-neutral-30) hover:text-(--color-foreground)"
                aria-label={lang === "nl" ? "Verwijder suggestie" : "Dismiss suggestion"}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={fetchSuggestions}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-card) px-3 py-1.5 text-xs font-medium text-(--color-foreground) transition-colors hover:border-(--color-foreground) disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {lang === "nl" ? "Laden..." : "Loading..."}
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5" />
            {lang === "nl" ? "Suggereer meer" : "Suggest more"}
          </>
        )}
      </button>

      {error && <p className="text-xs text-(--color-destructive)">{error}</p>}
    </div>
  );
}
