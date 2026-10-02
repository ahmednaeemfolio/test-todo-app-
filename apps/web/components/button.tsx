import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-primary)",
    borderColor: "var(--color-primary)",
    color: "#ffffff",
  },
  secondary: {
    backgroundColor: "var(--color-secondary)",
    borderColor: "var(--color-secondary)",
    color: "#29245f",
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: "var(--color-foreground)",
  },
  destructive: {
    backgroundColor: "var(--color-destructive)",
    borderColor: "var(--color-destructive)",
    color: "#ffffff",
  },
};

/** A semantic button with a visible text label in every state. */
export function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  children,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const buttonStyle: CSSProperties = {
    alignItems: "center",
    border: "1px solid",
    borderRadius: "var(--radius-control)",
    cursor: isDisabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 500,
    gap: 8,
    justifyContent: "center",
    lineHeight: "20px",
    minHeight: 40,
    opacity: isDisabled ? 0.65 : 1,
    padding: "9px 16px",
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      style={buttonStyle}
    >
      {children}
    </button>
  );
}
