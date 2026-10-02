"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Todo } from "@/lib/api-client";

type ConfirmDeleteDialogProps = {
  todo: Todo | null;
  error: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export function ConfirmDeleteDialog({ todo, error, onCancel, onConfirm }: ConfirmDeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const isOpen = Boolean(todo);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  async function confirm() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby="delete-title"
      aria-describedby="delete-description"
      onCancel={(event) => { event.preventDefault(); if (!submitting) onCancel(); }}
      onClick={(event) => { if (event.target === dialogRef.current && !submitting) onCancel(); }}
    >
      {todo ? <div className="dialog-content">
        <h2 id="delete-title">Delete todo?</h2>
        <p id="delete-description">“{todo.title}” will be deleted. You can’t undo this action.</p>
        {error ? <p className="dialog-error" role="alert">{error}</p> : null}
        <div className="dialog-actions">
          <Button autoFocus variant="secondary" disabled={submitting} onClick={onCancel}>Cancel deletion</Button>
          <Button variant="destructive" loading={submitting} onClick={() => void confirm()}>Delete todo</Button>
        </div>
      </div> : null}
      <style jsx>{`
        .confirm-dialog { width: min(calc(100% - 32px), 440px); padding: 0; border: 1px solid var(--color-border); border-radius: var(--radius-panel); background: var(--color-card); color: var(--color-foreground); box-shadow: 0 16px 48px rgb(32 36 49 / 18%); }
        .confirm-dialog::backdrop { background: rgb(32 36 49 / 38%); }
        .dialog-content { padding: 24px; }
        h2 { margin: 0; font-size: 20px; font-weight: 600; line-height: 28px; }
        p { margin: 10px 0 0; color: var(--color-muted-foreground); }
        .dialog-error { color: var(--color-destructive); }
        .dialog-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
        @media (max-width: 480px) { .dialog-actions { flex-direction: column-reverse; } .dialog-actions :global(button) { width: 100%; min-height: 46px; } }
      `}</style>
    </dialog>
  );
}
