"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { todoApi, type Todo } from "../lib/api-client";

interface TodoRowProps {
  todo: Todo;
  onUpdated: (todo: Todo) => void;
  onRequestDelete: (todo: Todo, trigger: HTMLButtonElement) => void;
  onAnnounce: (message: string) => void;
}

export function TodoRow({ todo, onUpdated, onRequestDelete, onAnnounce }: TodoRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const editInput = useRef<HTMLInputElement>(null);
  const busy = saving;

  async function toggle(event: ChangeEvent<HTMLInputElement>) {
    const completed = event.currentTarget.checked;
    setSaving(true);
    setError("");
    try {
      const updated = await todoApi.updateTodo(todo.id, { completed });
      onUpdated(updated);
      onAnnounce(updated.completed ? "Todo marked completed." : "Todo marked incomplete.");
    } catch {
      setError("Couldn’t save that change. Try again.");
      onAnnounce("Couldn’t save that change. The todo is unchanged.");
    } finally {
      setSaving(false);
    }
  }

  async function saveTitle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) {
      setError("Enter a todo title.");
      editInput.current?.focus();
      return;
    }
    setError("");
    setSaving(true);
    try {
      const updated = await todoApi.updateTodo(todo.id, { title });
      onUpdated(updated);
      setDraft(updated.title);
      setEditing(false);
      onAnnounce("Todo title saved.");
    } catch {
      setError("Couldn’t save that change. Try again.");
      onAnnounce("Couldn’t save that change. The saved title is unchanged.");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setDraft(todo.title);
    setError("");
    setEditing(false);
  }

  return (
    <li style={{ display: "flex", minHeight: 77, alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: "1px solid #ececf1", background: todo.completed ? "#fcfcfd" : "var(--color-card)" }}>
      <label style={{ display: "grid", width: 28, height: 44, flex: "0 0 28px", placeItems: "center" }}>
        <input
          type="checkbox"
          checked={todo.completed}
          disabled={busy || editing}
          onChange={toggle}
          aria-label={`${todo.completed ? "Mark" : "Mark"} ${todo.title} ${todo.completed ? "incomplete" : "complete"}`}
          style={{ width: 19, height: 19, margin: 0, accentColor: "var(--color-primary)" }}
        />
      </label>
      <div style={{ minWidth: 0, flex: 1 }}>
        {editing ? (
          <form onSubmit={saveTitle}>
            <label htmlFor={`edit-${todo.id}`} style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>Edit todo title</label>
            <input
              ref={editInput}
              id={`edit-${todo.id}`}
              value={draft}
              disabled={saving}
              onChange={(event) => { setDraft(event.currentTarget.value); setError(""); }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `edit-error-${todo.id}` : undefined}
              style={{ width: "100%", minHeight: 44, padding: "8px 11px", border: `1px solid ${error ? "var(--color-destructive)" : "var(--color-border)"}`, borderRadius: "var(--radius-control)", background: "var(--color-card)" }}
            />
            {error ? <p id={`edit-error-${todo.id}`} role="alert" style={{ margin: "5px 0 0", color: "var(--color-destructive)", fontSize: 13 }}>{error}</p> : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              <button type="submit" disabled={saving} style={actionStyle}>Save</button>
              <button type="button" onClick={cancelEdit} disabled={saving} style={actionStyle}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ overflowWrap: "anywhere", color: todo.completed ? "#747987" : "#292d3a", textDecoration: todo.completed ? "line-through" : "none" }}>{todo.title}</div>
            <span style={{ display: "block", marginTop: 2, color: "var(--color-muted-foreground)", fontSize: 13 }}>{todo.completed ? "Completed" : "Incomplete"}</span>
            {error ? <p role="alert" style={{ margin: "5px 0 0", color: "var(--color-destructive)", fontSize: 13 }}>{error}</p> : null}
          </>
        )}
      </div>
      {!editing ? (
        <div style={{ display: "flex", flex: "0 0 auto", alignItems: "center", gap: 4 }}>
          <button type="button" disabled={busy} aria-label={`Edit ${todo.title}`} onClick={() => { setDraft(todo.title); setError(""); setEditing(true); }} style={actionStyle}>Edit</button>
          <button type="button" disabled={busy} aria-label={`Delete ${todo.title}`} onClick={(event) => onRequestDelete(todo, event.currentTarget)} style={{ ...actionStyle, color: "var(--color-destructive)" }}>Delete</button>
        </div>
      ) : null}
    </li>
  );
}

const actionStyle = {
  display: "inline-flex",
  minWidth: 44,
  minHeight: 44,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  padding: "0 9px",
  border: "1px solid transparent",
  borderRadius: 8,
  background: "transparent",
  color: "#5f6473",
  fontSize: 13,
  fontWeight: 500,
};
