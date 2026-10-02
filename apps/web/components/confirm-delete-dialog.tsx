"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";

export interface ConfirmDeleteDialogProps {
  todoTitle: string;
  busy?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Accessible, keyboard-operable confirmation that defaults focus to the safe action. */
export function ConfirmDeleteDialog({
  todoTitle,
  busy = false,
  error,
  onCancel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      if (!busy) onCancel();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "grid", placeItems: "center", padding: 20, background: "rgba(32,36,49,.48)" }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
        onKeyDown={handleKeyDown}
        style={{ width: "min(100%, 440px)", padding: 24, border: "1px solid var(--color-border, #d9dce5)", borderRadius: "var(--radius-panel, 14px)", background: "var(--color-card, #fff)", color: "var(--color-foreground, #202431)", boxShadow: "0 16px 48px rgba(32,36,49,.18)" }}
      >
        <h2 id="confirm-delete-title" style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 600, lineHeight: "28px" }}>Delete todo?</h2>
        <p id="confirm-delete-description" style={{ margin: 0, color: "var(--color-muted-foreground, #626879)", overflowWrap: "anywhere" }}>
          Delete “{todoTitle}”? This action can’t be undone.
        </p>
        {error && <p role="alert" aria-live="assertive" style={{ margin: "12px 0 0", color: "var(--color-destructive, #b42332)", fontSize: 14 }}>{error}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button ref={cancelRef} type="button" disabled={busy} onClick={onCancel} style={{ minHeight: 44, padding: "0 14px", border: "1px solid var(--color-border, #d9dce5)", borderRadius: "var(--radius-control, 10px)", background: "#fff", color: "var(--color-foreground, #202431)", cursor: busy ? "wait" : "pointer" }}>
            Cancel deletion
          </button>
          <button type="button" disabled={busy} onClick={onConfirm} style={{ minHeight: 44, padding: "0 14px", border: 0, borderRadius: "var(--radius-control, 10px)", background: "var(--color-destructive, #b42332)", color: "#fff", cursor: busy ? "wait" : "pointer" }}>
            {busy ? "Deleting…" : "Delete todo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteDialog;
