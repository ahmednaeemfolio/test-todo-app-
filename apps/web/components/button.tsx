import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
};

/** A semantic button with consistent variants and a persistent action label. */
export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = ["button", `button-${variant}`, className].filter(Boolean).join(" ");

  return (
    <>
      <button
        {...props}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        {children}
        {loading ? <span className="button-loading-indicator" aria-hidden="true" /> : null}
      </button>
      <style jsx>{`
        .button-ghost {
          border-color: transparent;
          background: transparent;
          color: var(--color-foreground);
        }
        .button-ghost:hover:not(:disabled) {
          background: var(--color-muted);
        }
        .button-loading-indicator {
          width: 14px;
          height: 14px;
          flex: 0 0 auto;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: button-spin 700ms linear infinite;
        }
        @keyframes button-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .button-loading-indicator { animation: none; }
        }
      `}</style>
    </>
  );
}
