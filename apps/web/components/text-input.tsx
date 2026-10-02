import { useId, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id?: string;
  label: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
}

/** A labeled text input that associates helper and validation copy accessibly. */
export function TextInput({
  id,
  label,
  helperText,
  error,
  className,
  style,
  "aria-describedby": describedBy,
  ...inputProps
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? `text-input-${generatedId}`;
  const helperId = helperText ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const descriptionIds = [describedBy, helperId, errorId].filter(Boolean).join(" ") || undefined;

  const inputStyle: CSSProperties = {
    backgroundColor: "var(--color-card)",
    border: `1px solid ${error ? "var(--color-destructive)" : "var(--color-border)"}`,
    borderRadius: "var(--radius-control)",
    color: "var(--color-foreground)",
    display: "block",
    fontFamily: "inherit",
    fontSize: 16,
    lineHeight: "24px",
    minHeight: 44,
    padding: "9px 12px",
    width: "100%",
    ...style,
  };

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label
        htmlFor={inputId}
        style={{ color: "var(--color-foreground)", fontSize: 14, fontWeight: 500, lineHeight: "20px" }}
      >
        {label}
      </label>
      <input
        {...inputProps}
        id={inputId}
        className={className}
        aria-describedby={descriptionIds}
        aria-invalid={error ? true : inputProps["aria-invalid"]}
        style={inputStyle}
      />
      {helperText && (
        <div id={helperId} style={{ color: "var(--color-muted-foreground)", fontSize: 13, lineHeight: "18px" }}>
          {helperText}
        </div>
      )}
      {error && (
        <div id={errorId} style={{ color: "var(--color-destructive)", fontSize: 13, lineHeight: "18px" }}>
          {error}
        </div>
      )}
    </div>
  );
}
