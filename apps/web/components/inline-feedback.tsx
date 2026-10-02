import type { CSSProperties, ReactNode } from "react";

export type InlineFeedbackVariant = "success" | "error" | "info";

export interface InlineFeedbackProps {
  variant: InlineFeedbackVariant;
  children?: ReactNode;
  /** Alternative to children for callers that prefer a named message prop. */
  message?: ReactNode;
}

const feedbackStyles: Record<InlineFeedbackVariant, CSSProperties> = {
  success: {
    backgroundColor: "var(--color-accent, #ddf5e8)",
    borderColor: "var(--color-success, #187447)",
    color: "#155b38",
  },
  error: {
    backgroundColor: "#fff3f2",
    borderColor: "var(--color-destructive, #b42332)",
    color: "var(--color-destructive, #b42332)",
  },
  info: {
    backgroundColor: "#f1f6ff",
    borderColor: "var(--color-info, #2457a6)",
    color: "var(--color-info, #2457a6)",
  },
};

const labels: Record<InlineFeedbackVariant, string> = {
  success: "Success:",
  error: "Error:",
  info: "Info:",
};

/** Announces visible feedback while identifying its kind in text, not color alone. */
export function InlineFeedback({
  variant,
  children,
  message,
}: InlineFeedbackProps) {
  const content = message ?? children;
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic="true"
      data-variant={variant}
      style={{
        alignItems: "flex-start",
        backgroundColor: feedbackStyles[variant].backgroundColor,
        border: `1px solid ${feedbackStyles[variant].borderColor}`,
        borderRadius: "var(--radius-control, 10px)",
        color: feedbackStyles[variant].color,
        display: "flex",
        fontSize: 14,
        gap: 6,
        lineHeight: "20px",
        padding: "10px 12px",
      }}
    >
      <strong>{labels[variant]}</strong>
      <span>{content}</span>
    </div>
  );
}
