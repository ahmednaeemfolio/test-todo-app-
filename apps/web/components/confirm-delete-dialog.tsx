"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/button";
import { InlineFeedback } from "@/components/inline-feedback";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({ open, title, pending, error, onCancel, onConfirm }: ConfirmDeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      onCancel={(event) => { event.preventDefault(); if (!pending) onCancel(); }}
      onClick={(event) => { if (event.target === dialogRef.current && !pending) onCancel(); }}
      style={{ width: "min(100% - 32px, 440px)", padding: 24, border: "1px solid var(--color-border)", borderRadius: "var(--radius-panel)", color: "var(--color-foreground)", boxShadow: "0 16px 48px rgb(32 36 49 / 18%)" }}
    >
      <h2 id="delete-dialog-title" style={{ margin: "0 0 10px", fontSize: 20, lineHeight: "28px" }}>Delete todo?</h2>
      <p id="delete-dialog-description" style={{ margin: "0 0 16px", color: "var(--color-muted-foreground)" }}>
        “{title}” will be deleted. You can’t undo this action.
      </p>
      {error && <div style={{ marginBottom: 16 }}><InlineFeedback type="error">{error}</InlineFeedback></div>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
        <button ref={cancelRef} type="button" disabled={pending} onClick={onCancel} style={{ minHeight: 44, padding: "9px 16px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-control)", background: "var(--color-secondary)", color: "#29245f", cursor: "pointer", font: "inherit", fontSize: 14 }}>Cancel deletion</button>
        <Button type="button" variant="destructive" loading={pending} onClick={onConfirm}>{pending ? "Deleting…" : "Delete todo"}</Button>
      </div>
    </dialog>
  );
}
