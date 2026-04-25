"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type ToastVariant = "info" | "success" | "error";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const toast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 z-[100] flex flex-col items-center gap-2 px-4 [bottom:max(1.5rem,env(safe-area-inset-bottom,0px))]">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onExpire={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onExpire }: { toast: Toast; onExpire: () => void }) {
  useEffect(() => {
    const timeout = window.setTimeout(onExpire, 4000);
    return () => window.clearTimeout(timeout);
  }, [onExpire]);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto max-w-md rounded-2xl px-5 py-3 text-sm font-medium shadow-lg",
        toast.variant === "success" && "bg-(--color-mint) text-(--color-primary-foreground)",
        toast.variant === "error" && "bg-(--color-destructive) text-(--color-destructive-foreground)",
        toast.variant === "info" && "bg-(--color-foreground) text-(--color-background)",
      )}
    >
      {toast.message}
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
