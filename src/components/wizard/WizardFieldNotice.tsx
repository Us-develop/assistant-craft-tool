import { clsx } from "clsx";

export function wizardInvalidInputClass(invalid: boolean): string {
  return clsx("input-field", invalid && "wizard-field-invalid");
}

export function wizardInvalidGroupClass(invalid: boolean): string {
  return clsx(invalid && "wizard-field-invalid-group");
}

/** Inline error tied to `#ff2752` validation UX */
export function WizardFieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-[0.8125rem] leading-snug text-[#ff2752]" role="alert">
      {message}
    </p>
  );
}
