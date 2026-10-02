import type { ReactNode } from "react";

export type FeedbackVariant = "success" | "error" | "info";

export type InlineFeedbackProps = {
  variant: FeedbackVariant;
  children: ReactNode;
  className?: string;
};

const variantLabels: Record<FeedbackVariant, string> = {
  success: "Success",
  error: "Error",
  info: "Info",
};

/** Inline status feedback announced to assistive technology and labeled in text. */
export function InlineFeedback({ variant, children, className }: InlineFeedbackProps) {
  const classes = ["inline-feedback", `inline-feedback-${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <p
        className={classes}
        role={variant === "error" ? "alert" : "status"}
        aria-live={variant === "error" ? "assertive" : "polite"}
        aria-atomic="true"
      >
        <span className="inline-feedback-label">{variantLabels[variant]}:</span> {children}
      </p>
      <style jsx>{`
        .inline-feedback {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin: 0;
          font-size: 14px;
          line-height: 20px;
        }
        .inline-feedback-label {
          font-weight: 600;
        }
        .inline-feedback-success { color: var(--color-success); }
        .inline-feedback-error { color: var(--color-destructive); }
        .inline-feedback-info { color: var(--color-info); }
      `}</style>
    </>
  );
}
