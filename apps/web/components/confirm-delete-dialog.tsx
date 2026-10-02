"use client";

import { useEffect, useRef, useState } from "react";
import { todoApi, type Todo } from "../lib/api-client";

interface ConfirmDeleteDialogProps {
  todo: Todo;
  onRequestClose: () => void;
  onDeleted: () => void;
}

export function ConfirmDeleteDialog({ todo, onRequestClose, onDeleted }: ConfirmDeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    cancelRef.current?.focus();
  }, []);

  async function confirmDelete() {
    setDeleting(true);
    setError("");
    try {
      await todoApi.deleteTodo(todo.id);
      onDeleted();
    } catch {
      setError("We couldn’t delete this todo. It is still on your list. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!deleting) onRequestClose();
      }}
      style={{ width: "min(calc(100% - 32px), 440px)", padding: 24, border: "1px solid var(--color-border)", borderRadius: "var(--radius-panel)", color: "var(--color-foreground)", background: "var(--color-card)", boxShadow: "0 16px 48px rgba(32,36,49,.18)" }}
    >
      <h2 id="delete-dialog-title" style={{ margin: "0 0 8px" }}>Delete todo?</h2>
      <p id="delete-dialog-description" style={{ margin: "0 0 20px", color: "var(--color-muted-foreground)" }}>
        “{todo.title}” will be deleted. You can’t undo this action.
      </p>
      {error ? <p role="alert" aria-live="assertive" style={{ margin: "0 0 16px", color: "var(--color-destructive)" }}>{error}</p> : null}
      <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 10 }}>
        <button ref={cancelRef} type="button" disabled={deleting} onClick={onRequestClose} style={cancelButtonStyle}>Cancel deletion</button>
        <button type="button" disabled={deleting} aria-busy={deleting} onClick={confirmDelete} style={deleteButtonStyle}>
          {deleting ? "Deleting…" : "Delete todo"}
        </button>
      </div>
    </dialog>
  );
}

const cancelButtonStyle = {
  minHeight: 44,
  padding: "0 15px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-control)",
  background: "var(--color-card)",
  fontSize: 14,
  fontWeight: 500,
};

const deleteButtonStyle = {
  ...cancelButtonStyle,
  borderColor: "var(--color-destructive)",
  background: "var(--color-destructive)",
  color: "#fff",
};
