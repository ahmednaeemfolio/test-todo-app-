import { useId } from "react";
import type {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
} from "react";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: ReactNode;
  id?: string;
  helperText?: ReactNode;
  error?: ReactNode;
}

const labelStyle: CSSProperties = {
  color: "var(--color-foreground, #202431)",
  display: "block",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "20px",
  marginBottom: 8,
};

const inputStyle: CSSProperties = {
  backgroundColor: "var(--color-card, #ffffff)",
  border: "1px solid var(--color-border, #d9dce5)",
  borderRadius: "var(--radius-control, 10px)",
  display: "block",
  fontSize: 16,
  lineHeight: "24px",
  minHeight: 44,
  padding: "9px 12px",
  width: "100%",
};

const descriptionStyle: CSSProperties = {
  color: "var(--color-muted-foreground, #626879)",
  fontSize: 13,
  lineHeight: "18px",
  margin: "6px 0 0",
};

export function TextInput({
  id,
  label,
  helperText,
  error,
  style,
  "aria-describedby": describedBy,
  ...inputProps
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedByIds = [describedBy, helperId, errorId]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  return (
    <div>
      <label htmlFor={inputId} style={labelStyle}>
        {label}
      </label>
      <input
        {...inputProps}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedByIds || undefined}
        style={{
          ...inputStyle,
          ...(error
            ? { borderColor: "var(--color-destructive, #b42332)" }
            : undefined),
          ...style,
        }}
      />
      {helperText ? (
        <p id={helperId} style={descriptionStyle}>
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          style={{
            ...descriptionStyle,
            color: "var(--color-destructive, #b42332)",
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
