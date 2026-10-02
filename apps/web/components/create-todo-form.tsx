"use client";

import { useRef, useState, type FormEvent } from "react";
import { createTodo, type Todo } from "../lib/api";
import { InlineFeedback } from "./inline-feedback";

export interface CreateTodoFormProps {
  onCreated?: (todo: Todo) => void;
}

export function CreateTodoForm({ onCreated }: CreateTodoFormProps) {
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationError(true);
      setFeedback(null);
      inputRef.current?.focus();
      return;
    }

    setValidationError(false);
    setFeedback(null);
    setSubmitting(true);
    try {
      const createdTodo = await createTodo({ title: trimmedTitle });
      onCreated?.(createdTodo);
      setTitle("");
      setFeedback({ type: "success", message: "Todo added." });
    } catch {
      // Keep the user's original input so a failed request can be corrected or retried.
      setFeedback({ type: "error", message: "Couldn't add your todo. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(value: string) {
    setTitle(value);
    if (validationError && value.trim()) setValidationError(false);
    if (feedback) setFeedback(null);
  }

  return (
    <section
      aria-label="Create a todo"
      className="create-todo-card"
      style={{
        padding: 20,
        marginBottom: 26,
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-panel)",
        background: "var(--color-card)",
        boxShadow: "0 1px 3px rgba(32,36,49,0.06)",
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="new-todo"
          style={{ display: "block", marginBottom: 9, fontSize: 14, fontWeight: 500 }}
        >
          Add a task
        </label>
        <div className="create-todo-controls" style={{ display: "flex", gap: 10 }}>
          <input
            ref={inputRef}
            id="new-todo"
            name="title"
            type="text"
            value={title}
            onChange={(event) => handleChange(event.target.value)}
            placeholder="What needs to get done?"
            autoComplete="off"
            disabled={submitting}
            aria-invalid={validationError || undefined}
            aria-describedby={validationError ? "new-todo-error" : undefined}
            style={{
              width: "100%",
              minWidth: 0,
              height: 46,
              padding: "0 14px",
              border: `1px solid ${validationError ? "var(--color-destructive)" : "var(--color-border)"}`,
              borderRadius: "var(--radius-control)",
              background: "var(--color-card)",
              color: "var(--color-foreground)",
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            style={{
              display: "inline-flex",
              minHeight: 44,
              flex: "0 0 auto",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "0 16px",
              border: 0,
              borderRadius: "var(--radius-control)",
              background: "var(--color-primary)",
              color: "white",
              cursor: submitting ? "wait" : "pointer",
              fontSize: 14,
              fontWeight: 500,
              opacity: submitting ? 0.75 : 1,
            }}
          >
            {submitting ? "Adding…" : "Add todo"}
          </button>
        </div>
      </form>
      {validationError && (
        <div id="new-todo-error">
          <InlineFeedback variant="error">Enter a todo title.</InlineFeedback>
        </div>
      )}
      {feedback && (
        <InlineFeedback variant={feedback.type}>{feedback.message}</InlineFeedback>
      )}
      <style>{`
        @media (max-width: 600px) {
          .create-todo-card { padding: 16px !important; margin-bottom: 20px !important; }
          .create-todo-controls { flex-direction: column; gap: 9px !important; }
          .create-todo-controls input, .create-todo-controls button { width: 100%; min-height: 48px; }
        }
      `}</style>
    </section>
  );
}

export default CreateTodoForm;
