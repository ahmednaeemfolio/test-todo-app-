import { useId, type InputHTMLAttributes, type ReactNode } from "react";

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id?: string;
  label: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
};

/** A visibly labeled field with helper and validation text associated to its input. */
export function TextInput({
  id,
  label,
  helperText,
  error,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
  "aria-errormessage": ariaErrorMessage,
  ...inputProps
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const hasHelper = helperText !== undefined && helperText !== null && helperText !== false;
  const hasError = error !== undefined && error !== null && error !== false;
  const descriptionIds = [describedBy, hasHelper ? helperId : undefined, hasError ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="text-input-field"
      style={{ display: "grid", gap: "6px", minWidth: 0 }}
    >
      <label
        className="text-input-label"
        htmlFor={inputId}
        style={{ color: "var(--color-foreground)", fontSize: "14px", fontWeight: 500, lineHeight: "20px" }}
      >
        {label}
      </label>
      <input
        {...inputProps}
        id={inputId}
        className={["text-input", className].filter(Boolean).join(" ")}
        aria-describedby={descriptionIds || undefined}
        aria-invalid={hasError ? true : ariaInvalid}
        aria-errormessage={hasError ? errorId : ariaErrorMessage}
      />
      {hasHelper ? (
        <div id={helperId} className="muted-text" style={{ fontSize: "13px", lineHeight: "18px" }}>
          {helperText}
        </div>
      ) : null}
      {hasError ? (
        <div
          id={errorId}
          className="status-error"
          aria-live="polite"
          style={{ color: "var(--color-destructive)", fontSize: "13px", lineHeight: "18px" }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
