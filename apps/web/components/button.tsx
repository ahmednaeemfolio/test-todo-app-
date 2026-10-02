import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  /** Keeps the button label visible while marking and disabling an in-flight action. */
  loading?: boolean;
}

const baseStyle: CSSProperties = {
  alignItems: "center",
  border: "1px solid transparent",
  borderRadius: "var(--radius-control, 10px)",
  display: "inline-flex",
  fontSize: 14,
  fontWeight: 500,
  gap: 8,
  justifyContent: "center",
  lineHeight: "20px",
  minHeight: 40,
  padding: "9px 16px",
  transition: "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-primary, #5146e5)",
    borderColor: "var(--color-primary, #5146e5)",
    color: "#ffffff",
  },
  secondary: {
    backgroundColor: "var(--color-secondary, #e9e8ff)",
    borderColor: "var(--color-secondary, #e9e8ff)",
    color: "#29245f",
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: "var(--color-foreground, #202431)",
  },
  destructive: {
    backgroundColor: "var(--color-destructive, #b42332)",
    borderColor: "var(--color-destructive, #b42332)",
    color: "#ffffff",
  },
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-loading={loading ? "true" : undefined}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...(isDisabled ? { cursor: "not-allowed", opacity: 0.72 } : undefined),
        ...style,
      }}
    >
      <span>{children}</span>
      {loading ? <span aria-hidden="true">…</span> : null}
    </button>
  );
}
