"use client";

import { useEffect, useRef } from "react";

export interface ConfirmDeleteDialogProps {
  open: boolean;
  todoTitle: string;
  deleting: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Accessible confirmation modal. Deletion is performed only by the explicit confirm action. */
export function ConfirmDeleteDialog({
  open,
  todoTitle,
  deleting,
  error,
  onCancel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef(onCancel);
  cancelRef.current = onCancel;

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !deleting) {
        event.preventDefault();
        cancelRef.current();
      }

      if (event.key !== "Tab") return;
      const dialog = document.getElementById("confirm-delete-dialog");
      const controls = dialog?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, deleting]);

  if (!open) return null;

  return (
    <div
      className="delete-dialog-backdrop"
      style={{
        position: "fixed",
        zIndex: 20,
        inset: 0,
        display: "grid",
        placeItems: "center",
        padding: 20,
        background: "rgba(32,36,49,0.42)",
      }}
    >
      <section
        id="confirm-delete-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
        className="confirm-delete-dialog"
        style={{
          width: "min(100%, 440px)",
          padding: 24,
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-panel)",
          background: "var(--color-card)",
          boxShadow: "0 16px 48px rgba(32,36,49,0.18)",
        }}
      >
        <h2 id="confirm-delete-title" style={{ margin: "0 0 8px", fontSize: 20, lineHeight: "28px" }}>
          Delete todo?
        </h2>
        <p id="confirm-delete-description" style={{ margin: 0, color: "var(--color-muted-foreground)" }}>
          This todo will be deleted. You can’t undo this action.
        </p>
        <p style={{ margin: "12px 0 0", overflowWrap: "anywhere", fontWeight: 500 }}>
          {todoTitle}
        </p>
        {error && (
          <p role="alert" style={{ margin: "12px 0 0", color: "var(--color-destructive)", fontSize: 14 }}>
            {error}
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={deleting}
            style={{
              minHeight: 44,
              padding: "0 16px",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-control)",
              background: "var(--color-card)",
              cursor: deleting ? "wait" : "pointer",
            }}
          >
            Cancel deletion
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            aria-busy={deleting}
            style={{
              minHeight: 44,
              padding: "0 16px",
              border: 0,
              borderRadius: "var(--radius-control)",
              background: "var(--color-destructive)",
              color: "white",
              cursor: deleting ? "wait" : "pointer",
            }}
          >
            {deleting ? "Deleting…" : "Delete todo"}
          </button>
        </div>
      </section>
      <style>{`
        @media (max-width: 440px) {
          .confirm-delete-dialog > div { flex-direction: column-reverse; }
          .confirm-delete-dialog > div button { width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default ConfirmDeleteDialog;
