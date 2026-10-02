import type { CSSProperties, ReactNode } from "react";

type FeedbackVariant = "success" | "error" | "info";

export type InlineFeedbackProps = {
  variant: FeedbackVariant;
  children: ReactNode;
  className?: string;
  id?: string;
};

const variantDetails: Record<FeedbackVariant, { label: string; color: string }> = {
  success: { label: "Success", color: "var(--color-success)" },
  error: { label: "Error", color: "var(--color-destructive)" },
  info: { label: "Info", color: "var(--color-info)" },
};

/** Announces feedback through a live region and names its kind in text, not color alone. */
export function InlineFeedback({ variant, children, className, id }: InlineFeedbackProps) {
  const { label, color } = variantDetails[variant];
  const style: CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    border: `1px solid ${color}`,
    borderRadius: "var(--radius-control)",
    backgroundColor: "var(--color-card)",
    color: "var(--color-foreground)",
    padding: "8px 12px",
  };

  return (
    <div
      id={id}
      className={["inline-feedback", `inline-feedback-${variant}`, className].filter(Boolean).join(" ")}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      style={style}
    >
      <strong style={{ color }}>{label}:</strong>
      <span>{children}</span>
    </div>
  );
}
