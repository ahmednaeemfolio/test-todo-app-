"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/button";
import { InlineFeedback } from "@/components/inline-feedback";
import { TextInput } from "@/components/text-input";
import type { Todo } from "@/lib/api-client";

export type TodoRowProps = {
  todo: Todo;
  onToggle: (todo: Todo, completed: boolean) => Promise<Todo>;
  onUpdate: (todo: Todo, title: string) => Promise<Todo>;
  onDeleteRequest: (todo: Todo, trigger: HTMLElement) => void;
};

export function TodoRow({ todo, onToggle, onUpdate, onDeleteRequest }: TodoRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [validation, setValidation] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const editInputId = `edit-todo-${todo.id}`;
  const completedStatus = todo.completed ? "Completed" : "Incomplete";

  async function toggle() {
    setPending(true);
    setError("");
    try {
      await onToggle(todo, !todo.completed);
    } catch {
      setError("Couldn’t save that change. The saved status is unchanged; try again.");
    } finally {
      setPending(false);
    }
  }

  function beginEdit() {
    setDraft(todo.title);
    setValidation("");
    setError("");
    setEditing(true);
    window.setTimeout(() => document.getElementById(editInputId)?.focus(), 0);
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) {
      setValidation("Enter a todo title.");
      document.getElementById(editInputId)?.focus();
      return;
    }
    setValidation("");
    setError("");
    setPending(true);
    try {
      await onUpdate(todo, title);
      setEditing(false);
    } catch {
      setError("Couldn’t save that change. Your saved title is unchanged; please try again.");
    } finally {
      setPending(false);
    }
  }

  function cancelEdit() {
    setDraft(todo.title);
    setValidation("");
    setError("");
    setEditing(false);
  }

  return (
    <li className="todo-row" style={{ display: "flex", minHeight: 76, alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: "1px solid var(--color-border)", background: todo.completed ? "#fcfcfd" : "var(--color-card)" }}>
      <label style={{ display: "flex", flex: "0 0 24px", alignItems: "center", justifyContent: "center" }}>
        <input
          type="checkbox"
          checked={todo.completed}
          disabled={pending || editing}
          onChange={() => void toggle()}
          aria-label={`Mark ${todo.title} as ${todo.completed ? "incomplete" : "complete"}`}
          style={{ width: 19, height: 19, accentColor: "var(--color-primary)" }}
        />
      </label>
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <form onSubmit={saveEdit} noValidate>
            <TextInput
              id={editInputId}
              label={`Edit ${todo.title}`}
              value={draft}
              onChange={(event) => { setDraft(event.target.value); setValidation(""); }}
              error={validation || undefined}
              disabled={pending}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              <Button type="submit" loading={pending}>Save</Button>
              <Button variant="secondary" onClick={cancelEdit} disabled={pending}>Cancel</Button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ overflowWrap: "anywhere", color: todo.completed ? "var(--color-muted-foreground)" : "var(--color-foreground)", textDecoration: todo.completed ? "line-through" : "none" }}>{todo.title}</div>
            <span style={{ display: "block", marginTop: 2, color: todo.completed ? "#466b55" : "var(--color-muted-foreground)", fontSize: 13 }}>{completedStatus}</span>
          </>
        )}
        {error ? <div style={{ marginTop: 8 }}><InlineFeedback variant="error">{error}</InlineFeedback></div> : null}
        {pending && !editing ? <span role="status" aria-live="polite" className="muted-text" style={{ fontSize: 12 }}>Saving…</span> : null}
      </div>
      {!editing ? (
        <div style={{ display: "flex", flexShrink: 0, alignItems: "center", gap: 4 }}>
          <Button variant="ghost" disabled={pending} aria-label={`Edit ${todo.title}`} onClick={beginEdit} style={{ minWidth: 44, padding: "8px 10px" }}>Edit</Button>
          <Button
            variant="ghost"
            disabled={pending}
            aria-label={`Delete ${todo.title}`}
            onClick={(event) => onDeleteRequest(todo, event.currentTarget)}
            style={{ minWidth: 44, padding: "8px 10px", color: "var(--color-destructive)" }}
          >Delete</Button>
        </div>
      ) : null}
    </li>
  );
}
