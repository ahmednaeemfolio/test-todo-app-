import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id?: string;
  label: string;
  helperText?: string;
  error?: string;
};

/** A labeled native text input with associated helper and validation messages. */
export function TextInput({
  id,
  label,
  helperText,
  error,
  className,
  "aria-describedby": describedBy,
  ...inputProps
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? `text-input-${generatedId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedByIds = [describedBy, helperId, errorId].filter(Boolean).join(" ") || undefined;
  const classes = ["text-input", className].filter(Boolean).join(" ");

  return (
    <div className="text-input-field">
      <label className="form-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        {...inputProps}
        id={inputId}
        className={classes}
        aria-invalid={error ? true : inputProps["aria-invalid"]}
        aria-describedby={describedByIds}
      />
      {helperText ? <p className="text-input-helper muted-text" id={helperId}>{helperText}</p> : null}
      {error ? <p className="text-input-error" id={errorId}>{error}</p> : null}
      <style jsx>{`
        .text-input-helper,
        .text-input-error {
          margin: 6px 0 0;
          font-size: 13px;
          line-height: 18px;
        }
        .text-input-error {
          color: var(--color-destructive);
        }
      `}</style>
    </div>
  );
}
