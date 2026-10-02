import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** Keep the action label visible in every state, including while loading. */
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
};

const visuallyHidden: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/** A token-styled semantic button with native keyboard behavior and a visible focus ring. */
export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type,
  className,
  style,
  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const buttonStyle: CSSProperties | undefined =
    variant === "ghost"
      ? {
          backgroundColor: "transparent",
          color: "var(--color-foreground)",
          ...style,
        }
      : style;

  return (
    <button
      {...buttonProps}
      type={type ?? "button"}
      className={["button", `button-${variant}`, className].filter(Boolean).join(" ")}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      style={buttonStyle}
    >
      <span>{children}</span>
      {loading ? (
        <>
          <span aria-hidden="true">…</span>
          <span style={visuallyHidden}>Loading</span>
        </>
      ) : null}
    </button>
  );
}
