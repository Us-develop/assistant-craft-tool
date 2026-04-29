"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useWizard } from "./WizardContext";
import { X, Send, Loader2, Sparkles, Minimize2, Maximize2 } from "lucide-react";
import AssistantRobotLottie from "@/components/AssistantRobotLottie";
import { cn } from "@/lib/cn";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const FAB_OFFSET_STORAGE_KEY = "act-assistant-fab-offset";
const FAB_MINIMIZED_STORAGE_KEY = "act-assistant-fab-minimized";

/** Icon-only FAB controls (minimize / expand) — above the main launcher in z-order. */
const fabControlIconBtnClass =
  "pointer-events-auto relative z-[30] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--color-border) bg-(--color-card)/95 shadow-sm backdrop-blur-sm hover:bg-(--color-muted)";
const DRAG_THRESHOLD_PX = 10;
const FAB_VIEWPORT_PAD = 12;

function clampFabTranslate(
  wrapEl: HTMLElement | null,
  x: number,
  y: number,
): { x: number; y: number } {
  if (!wrapEl || typeof window === "undefined") return { x, y };

  const prev = wrapEl.style.transform;
  wrapEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  const r = wrapEl.getBoundingClientRect();
  wrapEl.style.transform = prev;

  const pad = FAB_VIEWPORT_PAD;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let nx = x;
  let ny = y;
  if (r.left < pad) nx += pad - r.left;
  if (r.top < pad) ny += pad - r.top;
  if (r.right > vw - pad) nx -= r.right - (vw - pad);
  if (r.bottom > vh - pad) ny -= r.bottom - (vh - pad);
  return { x: nx, y: ny };
}

const STEP_HINTS: Record<number, { en: string; nl: string }> = {
  1: {
    en: "What domain should my assistant specialize in?",
    nl: "In welk domein moet mijn assistent gespecialiseerd zijn?",
  },
  2: {
    en: "What job title and experience level fits my use case?",
    nl: "Welke functietitel en ervaringsniveau past bij mijn situatie?",
  },
  3: {
    en: "What core belief should drive my assistant's approach?",
    nl: "Welke kernovertuiging moet de aanpak van mijn assistent sturen?",
  },
  4: {
    en: "How should my assistant sound? Give me tone examples.",
    nl: "Hoe moet mijn assistent klinken? Geef me toonvoorbeelden.",
  },
  5: {
    en: "Help me describe my target audience clearly.",
    nl: "Help me mijn doelgroep duidelijk te omschrijven.",
  },
  6: {
    en: "What quality checks should my assistant perform?",
    nl: "Welke kwaliteitscontroles moet mijn assistent uitvoeren?",
  },
  7: {
    en: "What rules should I set for my assistant?",
    nl: "Welke regels moet ik instellen voor mijn assistent?",
  },
  8: {
    en: "Help me write a good kick-off message.",
    nl: "Help me een goed opstartbericht te schrijven.",
  },
};

export default function AIAssistantPanel() {
  const { lang, step, data } = useWizard();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const fabWrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [fabTranslate, setFabTranslate] = useState({ x: 0, y: 0 });
  const [fabMinimized, setFabMinimized] = useState(false);
  const fabDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: { x: number; y: number };
    dragging: boolean;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(FAB_MINIMIZED_STORAGE_KEY) === "true") {
        setFabMinimized(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(FAB_OFFSET_STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw) as { x?: unknown; y?: unknown };
      if (typeof p.x !== "number" || typeof p.y !== "number") return;
      requestAnimationFrame(() => {
        setFabTranslate(
          clampFabTranslate(fabWrapRef.current, p.x as number, p.y as number),
        );
      });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [step]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFabMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (fabDragRef.current?.dragging) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const el = fabRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const my = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    setTilt({ x: my * 7, y: -mx * 7 });
  };

  const handleFabLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const openPanel = () => {
    setIsOpen(true);
  };

  const persistFabMinimized = useCallback((next: boolean) => {
    setFabMinimized(next);
    try {
      localStorage.setItem(FAB_MINIMIZED_STORAGE_KEY, next ? "true" : "false");
    } catch {
      /* ignore */
    }
  }, []);

  const handleFabPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    fabDragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origin: { ...fabTranslate },
      dragging: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* unsupported */
    }
  };

  const handleFabPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const s = fabDragRef.current;
    if (!s || e.pointerId !== s.pointerId) return;

    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (!s.dragging && dx * dx + dy * dy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
      s.dragging = true;
    }
    if (!s.dragging) return;

    e.preventDefault();
    const next = { x: s.origin.x + dx, y: s.origin.y + dy };
    setFabTranslate(clampFabTranslate(fabWrapRef.current, next.x, next.y));
  };

  const handleFabPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const s = fabDragRef.current;
    if (!s || e.pointerId !== s.pointerId) return;

    const wasDrag = s.dragging;
    fabDragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    if (wasDrag) {
      setFabTranslate((t) => {
        const c = clampFabTranslate(fabWrapRef.current, t.x, t.y);
        try {
          localStorage.setItem(FAB_OFFSET_STORAGE_KEY, JSON.stringify(c));
        } catch {
          /* ignore */
        }
        return c;
      });
      return;
    }

    openPanel();
  };

  const hint = STEP_HINTS[step]?.[lang] || STEP_HINTS[step]?.en || "";

  const handleHintClick = () => {
    setInput(hint);
  };

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: userMessage.trim(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            step,
            data,
            lang,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

        const decoder = new TextDecoder();
        let assistantContent = "";
        const assistantId = (Date.now() + 1).toString();

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "" },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: assistantContent } : m,
            ),
          );
        }

      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              lang === "nl"
                ? "Er ging iets mis. Probeer het opnieuw."
                : "Something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, step, data, lang, isLoading],
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isOpen) {
    const fabTitle =
      lang === "nl"
        ? "Sleep om te verplaatsen. Tik of klik om te openen."
        : "Drag to move. Tap or click to open.";
    const minimizeLabel =
      lang === "nl" ? "Robot verkleinen (minder afleidend)" : "Shrink robot (less distracting)";
    const expandLabel =
      lang === "nl" ? "Grote robot tonen" : "Show large robot";

    return (
      <div
        ref={fabWrapRef}
        className="pointer-events-auto fixed z-[60] flex flex-col items-end max-md:[bottom:max(1rem,env(safe-area-inset-bottom,0px))] max-md:[right:max(1rem,env(safe-area-inset-right,0px))] md:bottom-[-3rem] md:right-[-4rem]"
        style={{
          transform: `translate3d(${fabTranslate.x}px, ${fabTranslate.y}px, 0)`,
          touchAction: "none",
        }}
        onMouseLeave={fabMinimized ? undefined : handleFabLeave}
      >
        <div
          className={cn(
            "relative isolate inline-block",
            fabMinimized && "flex flex-col items-center gap-2 pb-1",
          )}
        >
          {!fabMinimized && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                persistFabMinimized(true);
              }}
              className={cn(
                fabControlIconBtnClass,
                "absolute bottom-8 left-1/2 max-md:hidden -translate-x-1/2",
              )}
              aria-label={minimizeLabel}
              title={minimizeLabel}
            >
              <Minimize2 className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            </button>
          )}
          <button
            ref={fabRef}
            type="button"
            onPointerDown={handleFabPointerDown}
            onPointerMove={handleFabPointerMove}
            onPointerUp={handleFabPointerUp}
            onPointerCancel={handleFabPointerUp}
            onClick={(e) => {
              /* Mouse/touch open via pointerup; keyboard synthesizes click with detail === 0 */
              if (e.detail === 0) openPanel();
            }}
            onMouseMove={fabMinimized ? undefined : handleFabMove}
            className="group relative z-[1] block cursor-grab touch-none border-0 bg-transparent p-0 shadow-none outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-(--color-foreground) focus-visible:ring-offset-2"
            style={{ perspective: 520, touchAction: "none" }}
            title={fabTitle}
            aria-label={lang === "nl" ? "Open AI assistent" : "Open AI assistant"}
          >
            {fabMinimized ? (
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md ring-1 ring-white/30 md:h-[3.25rem] md:w-[3.25rem]">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: "url(/us-holo-button.gif)" }}
                />
                <span aria-hidden className="absolute inset-0 bg-black/35" />
                <Sparkles
                  className="relative z-10 h-6 w-6 shrink-0 text-white drop-shadow-md md:h-7 md:w-7"
                  aria-hidden
                />
              </span>
            ) : (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-primary) text-(--color-primary-foreground) shadow-md md:hidden">
                  <Sparkles className="h-6 w-6 shrink-0" aria-hidden />
                </span>
                <span
                  className="hidden transition-transform duration-150 ease-out group-active:scale-[0.98] md:block"
                  style={{
                    transform: `perspective(520px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  }}
                >
                  <AssistantRobotLottie variant="fab" className="pointer-events-none" />
                </span>
              </>
            )}
          </button>
          {fabMinimized && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                persistFabMinimized(false);
              }}
              className={cn(fabControlIconBtnClass, "text-(--color-foreground)")}
              aria-label={expandLabel}
              title={expandLabel}
            >
              <Maximize2 className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed z-[60] flex w-auto flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-card) shadow-xl [bottom:max(0.75rem,env(safe-area-inset-bottom,0px))] [left:max(0.75rem,env(safe-area-inset-left,0px))] [right:max(0.75rem,env(safe-area-inset-right,0px))] max-sm:h-[min(32rem,85dvh)] max-sm:max-h-[85dvh] sm:bottom-6 sm:left-auto sm:right-6 sm:h-[32rem] sm:max-h-[min(32rem,90dvh)] sm:w-[min(380px,calc(100vw-1.5rem))] sm:max-w-[min(380px,calc(100vw-1.5rem))]"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-(--color-border) bg-(--color-primary) px-4 py-3 text-(--color-primary-foreground)">
        <div className="flex items-center gap-2">
          <AssistantRobotLottie variant="header" className="shrink-0" />
          <span className="font-medium">
            {lang === "nl" ? "AI Assistent" : "AI Assistant"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-lg p-1 transition-colors hover:bg-(--color-neutral-80)"
          aria-label={lang === "nl" ? "Sluit" : "Close"}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-end justify-center">
              <AssistantRobotLottie variant="empty" />
            </div>
            <div>
              <p className="text-sm font-medium text-(--color-foreground)">
                {lang === "nl"
                  ? `Hulp nodig bij stap ${step}?`
                  : `Need help with step ${step}?`}
              </p>
              <p className="mt-1 text-xs text-(--color-muted-foreground)">
                {lang === "nl"
                  ? "Vraag me om suggesties of advies."
                  : "Ask me for suggestions or advice."}
              </p>
            </div>
            {hint && (
              <button
                type="button"
                onClick={handleHintClick}
                className="max-w-full break-words rounded-full border border-(--color-border) bg-(--color-card) px-3 py-1.5 text-left text-xs text-(--color-foreground) transition-colors hover:bg-(--color-muted) sm:text-center"
              >
                {hint}
              </button>
            )}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                message.role === "user"
                  ? "bg-(--color-primary) text-(--color-primary-foreground)"
                  : "bg-(--color-muted) text-(--color-foreground)"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-(--color-muted) px-4 py-2.5 text-sm text-(--color-muted-foreground)">
              <Loader2 className="h-4 w-4 animate-spin" />
              {lang === "nl" ? "Denken..." : "Thinking..."}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="flex shrink-0 items-center gap-2 border-t border-(--color-border) p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === "nl" ? "Stel een vraag..." : "Ask a question..."}
          className="min-w-0 flex-1 rounded-full border border-(--color-border) bg-(--color-card) px-4 py-2.5 text-base outline-none transition-colors focus:border-(--color-foreground) sm:text-sm"
          autoComplete="off"
          autoCorrect="off"
          enterKeyHint="send"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-primary) text-(--color-primary-foreground) transition-colors hover:bg-(--color-neutral-80) disabled:bg-(--color-neutral-40) disabled:text-(--color-neutral-70)"
          aria-label={lang === "nl" ? "Verstuur" : "Send"}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
