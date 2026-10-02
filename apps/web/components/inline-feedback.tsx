import type { CSSProperties } from "react";

export type FeedbackTone = "success" | "error" | "info";

export interface InlineFeedbackProps {
  children: React.ReactNode;
  tone?: FeedbackTone;
  /** Use alert only for urgent validation or request errors; status is polite by default. */
  role?: "status" | "alert";
  className?: string;
}

const toneStyles: Record<FeedbackTone, CSSProperties> = {
  success: { color: "var(--color-success, #187447)" },
  error: { color: "var(--color-destructive, #b42332)" },
  info: { color: "var(--color-muted-foreground, #626879)" },
};

/** Compact textual feedback that is announced without relying on color alone. */
export function InlineFeedback({
  children,
  tone = "info",
  role = "status",
  className,
}: InlineFeedbackProps) {
  return (
    <p
      className={className}
      role={role}
      aria-live={role === "alert" ? "assertive" : "polite"}
      style={{
        margin: "10px 1px 0",
        fontSize: 13,
        lineHeight: "18px",
        ...toneStyles[tone],
      }}
    >
      {children}
    </p>
  );
}

export default InlineFeedback;
