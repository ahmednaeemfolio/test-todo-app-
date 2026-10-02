"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { InlineFeedback } from "@/components/inline-feedback";
import type { Todo } from "@/lib/api-client";

export function ConfirmDeleteDialog({ todo, onConfirm, onCancel }: { todo: Todo; onConfirm: () => Promise<void>; onCancel: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    document.getElementById("cancel-todo-deletion")?.focus();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  async function confirm() {
    setDeleting(true);
    setError("");
    try {
      await onConfirm();
      dialogRef.current?.close();
      onCancel();
    } catch {
      setError("Couldn’t delete this todo. It is still on your list; please try again.");
      setDeleting(false);
    }
  }

  function cancel() {
    if (deleting) return;
    dialogRef.current?.close();
    onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      onCancel={(event) => { event.preventDefault(); cancel(); }}
      style={{ width: "min(440px, calc(100vw - 32px))", border: "1px solid var(--color-border)", borderRadius: 14, padding: 24, color: "var(--color-foreground)", boxShadow: "0 16px 48px rgba(32,36,49,.18)" }}
    >
      <h2 id="delete-dialog-title" className="section-title" style={{ margin: "0 0 12px" }}>Delete todo?</h2>
      <p id="delete-dialog-description" style={{ margin: 0, overflowWrap: "anywhere" }}>
        Delete “{todo.title}”? This todo will be deleted. You can’t undo this action.
      </p>
      {error ? <div style={{ marginTop: 16 }}><InlineFeedback variant="error">{error}</InlineFeedback></div> : null}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
        <Button id="cancel-todo-deletion" variant="secondary" onClick={cancel} disabled={deleting}>Cancel deletion</Button>
        <Button variant="destructive" onClick={() => void confirm()} loading={deleting}>Delete todo</Button>
      </div>
    </dialog>
  );
}
