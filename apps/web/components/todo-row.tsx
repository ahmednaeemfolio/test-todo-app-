"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Todo, UpdateTodoInput } from "@/lib/api-client";
import { Button } from "@/components/button";

type TodoRowProps = {
  todo: Todo;
  onUpdate: (patch: UpdateTodoInput) => Promise<Todo>;
  onRequestDelete: () => void;
};

export function TodoRow({ todo, onUpdate, onRequestDelete }: TodoRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [validationError, setValidationError] = useState("");
  const [mutationError, setMutationError] = useState("");
  const [saving, setSaving] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  function beginEdit() {
    setDraft(todo.title);
    setValidationError("");
    setMutationError("");
    setEditing(true);
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) {
      setValidationError("Enter a todo title.");
      editRef.current?.focus();
      return;
    }
    setValidationError("");
    setMutationError("");
    setSaving(true);
    try {
      await onUpdate({ title });
      setEditing(false);
    } catch {
      setMutationError("Couldn’t save that change. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleCompleted(checked: boolean) {
    setMutationError("");
    setSaving(true);
    try {
      await onUpdate({ completed: checked });
    } catch {
      setMutationError("Couldn’t save that change. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className={`todo-row${todo.completed ? " is-complete" : ""}`}>
      {editing ? (
        <>
          <form className="edit-form" onSubmit={saveEdit} noValidate>
            <label className="sr-only" htmlFor={`edit-${todo.id}`}>Edit {todo.title}</label>
            <input
              ref={editRef}
              id={`edit-${todo.id}`}
              className="edit-input"
              value={draft}
              onChange={(event) => { setDraft(event.target.value); if (validationError) setValidationError(""); }}
              disabled={saving}
              aria-invalid={Boolean(validationError)}
              aria-describedby={validationError ? `edit-error-${todo.id}` : undefined}
            />
            {validationError ? <span className="field-error" id={`edit-error-${todo.id}`}>{validationError}</span> : null}
            <div className="edit-actions">
              <Button type="submit" loading={saving}>Save</Button>
              <Button variant="secondary" disabled={saving} onClick={() => { setEditing(false); setDraft(todo.title); setValidationError(""); setMutationError(""); }}>Cancel</Button>
            </div>
          </form>
        </>
      ) : (
        <>
          <label className="completion">
            <input
              type="checkbox"
              checked={todo.completed}
              disabled={saving}
              onChange={(event) => void toggleCompleted(event.target.checked)}
              aria-label={`Mark ${todo.title} as ${todo.completed ? "incomplete" : "complete"}`}
            />
          </label>
          <div className="todo-copy">
            <div className="todo-title">{todo.title}</div>
            <span className="todo-status">{todo.completed ? "Completed" : "Incomplete"}</span>
            {mutationError ? <span className="row-error" role="alert">{mutationError}</span> : null}
          </div>
          <div className="row-actions">
            <button className="action-button" type="button" onClick={beginEdit} disabled={saving} aria-label={`Edit ${todo.title}`}>Edit</button>
            <button className="action-button delete" type="button" onClick={onRequestDelete} disabled={saving} aria-label={`Delete ${todo.title}`}>Delete</button>
          </div>
        </>
      )}
      <style jsx>{`
        .todo-row { min-height: 77px; display: flex; align-items: center; gap: 14px; padding: 13px 20px; border-bottom: 1px solid #ececf1; transition: background-color 120ms ease; }
        .todo-row:last-child { border-bottom: 0; }
        .todo-row:hover { background: #fcfcfe; }
        .completion { width: 22px; height: 22px; flex: 0 0 22px; display: grid; place-items: center; }
        .completion input { width: 19px; height: 19px; margin: 0; accent-color: var(--color-primary); cursor: pointer; }
        .completion input:focus-visible { outline-offset: 3px; }
        .todo-copy { min-width: 0; flex: 1; }
        .todo-title { overflow-wrap: anywhere; color: #292d3a; font-size: 15px; line-height: 22px; }
        .todo-status { display: block; margin-top: 2px; color: #626879; font-size: 12px; line-height: 17px; }
        .is-complete .todo-title { color: #747987; text-decoration: line-through; text-decoration-color: #a8abb5; }
        .is-complete .todo-status { color: #526b5d; }
        .row-actions { display: flex; flex: 0 0 auto; align-items: center; gap: 4px; }
        .action-button { min-width: 44px; min-height: 44px; padding: 0 8px; border: 0; border-radius: 8px; background: transparent; color: #5f6473; cursor: pointer; font-size: 13px; font-weight: 500; }
        .action-button:hover:not(:disabled) { background: #f0f1f6; color: #303444; }
        .action-button.delete:hover:not(:disabled) { background: #fff0f1; color: var(--color-destructive); }
        .action-button:disabled { cursor: not-allowed; opacity: .55; }
        .edit-form { width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; }
        .edit-input { width: 100%; min-height: 44px; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-control); }
        .edit-actions { display: flex; gap: 8px; }
        .field-error, .row-error { color: var(--color-destructive); font-size: 13px; }
        .row-error { display: block; margin-top: 3px; }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
        @media (max-width: 600px) { .todo-row { min-height: 0; align-items: flex-start; gap: 10px; padding: 13px 12px; } .completion { margin-top: 2px; } .todo-copy { padding-top: 1px; } .row-actions { gap: 1px; } .action-button { min-width: 42px; min-height: 42px; padding-inline: 6px; } .edit-form { grid-template-columns: 1fr; } .edit-actions { flex-wrap: wrap; } }
      `}</style>
    </li>
  );
}
