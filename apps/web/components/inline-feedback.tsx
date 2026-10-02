import type { CSSProperties, ReactNode } from "react";

export type InlineFeedbackType = "success" | "error" | "info";

export interface InlineFeedbackProps {
  type: InlineFeedbackType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const feedbackStyles: Record<InlineFeedbackType, CSSProperties> = {
  success: {
    backgroundColor: "var(--color-accent)",
    borderColor: "var(--color-success)",
    color: "#155b38",
  },
  error: {
    backgroundColor: "#fff4f4",
    borderColor: "var(--color-destructive)",
    color: "var(--color-destructive)",
  },
  info: {
    backgroundColor: "#f1f6ff",
    borderColor: "var(--color-info)",
    color: "var(--color-info)",
  },
};

const labels: Record<InlineFeedbackType, string> = {
  success: "Success:",
  error: "Error:",
  info: "Info:",
};

/** Textual, live-announced feedback; each variant is identified beyond color. */
export function InlineFeedback({ type, children, className, style }: InlineFeedbackProps) {
  const isError = type === "error";
  const feedbackStyle: CSSProperties = {
    alignItems: "flex-start",
    border: "1px solid",
    borderRadius: "var(--radius-control)",
    display: "flex",
    fontSize: 14,
    gap: 6,
    lineHeight: "20px",
    padding: "10px 12px",
    ...feedbackStyles[type],
    ...style,
  };

  return (
    <div
      className={className}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      style={feedbackStyle}
    >
      <span style={{ fontWeight: 600 }}>{labels[type]}</span>
      <span>{children}</span>
    </div>
  );
}
