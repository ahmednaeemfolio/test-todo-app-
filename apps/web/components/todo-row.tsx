"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/button";
import { updateTodo, type Todo } from "@/lib/api-client";

interface TodoRowProps {
  todo: Todo;
  onUpdated: (todo: Todo) => void;
  onDelete: () => void;
}

export function TodoRow({ todo, onUpdated, onDelete }: TodoRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const editInput = useRef<HTMLInputElement>(null);
  const editButton = useRef<HTMLButtonElement>(null);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  useEffect(() => {
    if (editing) editInput.current?.focus();
  }, [editing]);

  function cancelEdit() {
    setDraft(todo.title);
    setError(null);
    setEditing(false);
    requestAnimationFrame(() => editButton.current?.focus());
  }

  async function toggle() {
    setPending(true);
    setError(null);
    setNotice("");
    try {
      const saved = await updateTodo(todo.id, { completed: !todo.completed });
      onUpdated(saved);
      setNotice(saved.completed ? "Todo marked completed." : "Todo marked incomplete.");
    } catch {
      setError("Couldn’t save that change. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) {
      setError("Enter a todo title.");
      editInput.current?.focus();
      return;
    }
    setPending(true);
    setError(null);
    try {
      const saved = await updateTodo(todo.id, { title });
      onUpdated(saved);
      setEditing(false);
      setNotice("Todo title saved.");
      requestAnimationFrame(() => editButton.current?.focus());
    } catch {
      setError("Couldn’t save that change. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <li style={{ display: "flex", minHeight: 77, alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: "1px solid #ececf1" }}>
      <label style={{ display: "grid", width: 26, minHeight: 44, flex: "0 0 26px", placeItems: "center" }}>
        <input
          type="checkbox"
          checked={todo.completed}
          disabled={pending || editing}
          onChange={() => void toggle()}
          aria-label={`Mark ${todo.title} as ${todo.completed ? "incomplete" : "complete"}`}
          style={{ width: 19, height: 19, margin: 0, accentColor: "var(--color-primary)", cursor: pending ? "wait" : "pointer" }}
        />
      </label>

      <div style={{ minWidth: 0, flex: 1 }}>
        {editing ? (
          <form onSubmit={save} noValidate style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <label htmlFor={inputId} style={{ display: "block", marginBottom: 6, color: "var(--color-foreground)", fontSize: 14, fontWeight: 500 }}>Edit {todo.title}</label>
              <input
                ref={editInput}
                id={inputId}
                value={draft}
                onChange={(event) => { setDraft(event.target.value); if (error) setError(null); }}
                disabled={pending}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                style={{ width: "100%", minWidth: 0, minHeight: 44, padding: "8px 11px", border: `1px solid ${error ? "var(--color-destructive)" : "var(--color-border)"}`, borderRadius: "var(--radius-control)", background: "var(--color-card)", color: "var(--color-foreground)" }}
              />
              {error && <p id={errorId} role="alert" style={{ margin: "6px 0 0", color: "var(--color-destructive)", fontSize: 13 }}>{error}</p>}
            </div>
            <Button type="submit" loading={pending} style={{ minHeight: 44 }}>{pending ? "Saving…" : "Save"}</Button>
            <Button type="button" variant="secondary" disabled={pending} onClick={cancelEdit} style={{ minHeight: 44 }}>Cancel</Button>
          </form>
        ) : (
          <>
            <div style={{ overflowWrap: "anywhere", color: todo.completed ? "#747987" : "#292d3a", fontSize: 15, lineHeight: "22px", textDecoration: todo.completed ? "line-through" : undefined, textDecorationColor: "#a8abb5" }}>{todo.title}</div>
            <span style={{ display: "block", marginTop: 2, color: todo.completed ? "#68786e" : "#777d8b", fontSize: 12, lineHeight: "17px" }}>{todo.completed ? "Completed" : "Incomplete"}</span>
          </>
        )}
        {!editing && error && <p role="alert" style={{ margin: "5px 0 0", color: "var(--color-destructive)", fontSize: 13 }}>{error}</p>}
        {!editing && notice && <p role="status" aria-live="polite" style={{ margin: "5px 0 0", color: "var(--color-success)", fontSize: 13 }}>{notice}</p>}
      </div>

      {!editing && <div style={{ display: "flex", flex: "0 0 auto", alignItems: "center", gap: 4 }}>
        <button ref={editButton} type="button" onClick={() => { setDraft(todo.title); setError(null); setNotice(""); setEditing(true); }} disabled={pending} aria-label={`Edit ${todo.title}`} style={actionStyle}>Edit</button>
        <button type="button" onClick={onDelete} disabled={pending} aria-label={`Delete ${todo.title}`} style={{ ...actionStyle, color: "var(--color-destructive)" }}>Delete</button>
      </div>}
      {pending && !editing && <span role="status" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0, 0, 0, 0)" }}>Saving {todo.title}</span>}
    </li>
  );
}

const actionStyle = {
  minWidth: 44,
  minHeight: 44,
  padding: "0 8px",
  border: "1px solid transparent",
  borderRadius: 8,
  background: "transparent",
  color: "#5f6473",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
} as const;
