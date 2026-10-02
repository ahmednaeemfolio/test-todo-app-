import type { CSSProperties, ReactNode } from "react";

export type FeedbackVariant = "success" | "error" | "info";

const variantStyles: Record<FeedbackVariant, CSSProperties> = {
  success: { color: "var(--color-success)" },
  error: { color: "var(--color-destructive)" },
  info: { color: "var(--color-info)" },
};

export interface InlineFeedbackProps {
  children: ReactNode;
  variant?: FeedbackVariant;
  className?: string;
}

/** Short status copy announced without moving focus away from the current task. */
export function InlineFeedback({
  children,
  variant = "info",
  className,
}: InlineFeedbackProps) {
  return (
    <p
      className={className ? `inline-feedback ${className}` : "inline-feedback"}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      style={{
        ...variantStyles[variant],
        minHeight: 20,
        margin: "12px 1px 0",
        fontSize: 13,
        lineHeight: "18px",
      }}
    >
      {children}
    </p>
  );
}

export default InlineFeedback;
