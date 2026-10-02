"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/button";
import { createTodo, type Todo } from "@/lib/api-client";

export function TodoCreateForm({ onCreated }: { onCreated: (todo: Todo) => void }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Enter a todo title.");
      setNotice("");
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setNotice("");
    setPending(true);
    try {
      const created = await createTodo({ title: trimmed });
      onCreated(created);
      setTitle("");
      setNotice("Todo added.");
    } catch {
      setError("Couldn’t add that todo. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section aria-label="Create a todo" style={{ padding: 20, marginBottom: 26, border: "1px solid var(--color-border)", borderRadius: "var(--radius-panel)", background: "var(--color-card)", boxShadow: "var(--shadow-panel)" }}>
      <form onSubmit={submit} noValidate>
        <div className="todo-create-controls" style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label htmlFor="new-todo" style={{ display: "block", marginBottom: 8, color: "var(--color-foreground)", fontSize: 14, fontWeight: 500 }}>Add a task</label>
            <input
              ref={inputRef}
              id="new-todo"
              type="text"
              placeholder="What needs to get done?"
              autoComplete="off"
              value={title}
              onChange={(event) => { setTitle(event.target.value); if (error) setError(null); }}
              disabled={pending}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "new-todo-error" : undefined}
              style={{ width: "100%", minWidth: 0, minHeight: 46, padding: "9px 12px", border: `1px solid ${error ? "var(--color-destructive)" : "var(--color-border)"}`, borderRadius: "var(--radius-control)", background: "var(--color-card)", color: "var(--color-foreground)" }}
            />
            {error && <p id="new-todo-error" role="alert" style={{ margin: "6px 0 0", color: "var(--color-destructive)", fontSize: 13 }}>{error}</p>}
          </div>
          <Button type="submit" loading={pending} style={{ minHeight: 46, flexShrink: 0 }}>
            {pending ? "Adding…" : "＋ Add todo"}
          </Button>
        </div>
      </form>
      {notice && <p role="status" aria-live="polite" style={{ margin: "12px 1px 0", color: "var(--color-success)", fontSize: 13 }}>{notice}</p>}
      <style jsx>{`
        @media (max-width: 600px) {
          .todo-create-controls { align-items: stretch !important; flex-direction: column; }
          .todo-create-controls button { width: 100%; min-height: 48px !important; }
        }
      `}</style>
    </section>
  );
}
