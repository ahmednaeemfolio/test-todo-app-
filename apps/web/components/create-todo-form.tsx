"use client";

import { useRef, useState, type FormEvent } from "react";
import { createTodo, TodoApiError, type Todo } from "../lib/api";
import InlineFeedback from "./inline-feedback";

export interface CreateTodoFormProps {
  /** Called with the persisted response so the owner can insert it into its list. */
  onCreated?: (todo: Todo) => void;
}

const cardStyle = {
  padding: 20,
  marginBottom: 26,
  border: "1px solid var(--color-border, #d9dce5)",
  borderRadius: "var(--radius-panel, 14px)",
  background: "var(--color-card, #fff)",
  boxShadow: "0 1px 3px rgba(32,36,49,.06)",
} as const;

/** Accessible create form; validation happens before any request is sent. */
export function CreateTodoForm({ onCreated }: CreateTodoFormProps) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setInvalid(true);
      setFeedback(null);
      inputRef.current?.focus();
      return;
    }

    setInvalid(false);
    setFeedback(null);
    setSubmitting(true);
    try {
      const created = await createTodo({ title: trimmedTitle });
      setTitle("");
      setFeedback({ tone: "success", message: "Todo added." });
      onCreated?.(created);
    } catch (error) {
      const message =
        error instanceof TodoApiError && error.status >= 400 && error.status < 500
          ? "Enter a todo title."
          : "Couldn't add your todo. Try again.";
      setFeedback({ tone: "error", message });
      // Keep the typed value intact so the user can correct it or retry.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-label="Create a todo" style={cardStyle}>
      <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
        <label
          htmlFor="new-todo-title"
          style={{ display: "block", marginBottom: 9, fontSize: 14, fontWeight: 500 }}
        >
          Add a task
        </label>
        <div className="create-todo-controls" style={{ display: "flex", gap: 10 }}>
          <input
            ref={inputRef}
            id="new-todo-title"
            name="title"
            type="text"
            autoComplete="off"
            placeholder="What needs to get done?"
            value={title}
            disabled={submitting}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? "new-todo-title-error" : undefined}
            onChange={(event) => {
              setTitle(event.target.value);
              if (invalid) setInvalid(false);
              if (feedback) setFeedback(null);
            }}
            style={{
              minWidth: 0,
              minHeight: 46,
              flex: 1,
              padding: "0 14px",
              border: `1px solid ${invalid ? "var(--color-destructive, #b42332)" : "var(--color-border, #d9dce5)"}`,
              borderRadius: "var(--radius-control, 10px)",
              background: "var(--color-card, #fff)",
              color: "var(--color-foreground, #202431)",
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              minHeight: 44,
              flex: "0 0 auto",
              padding: "0 16px",
              border: 0,
              borderRadius: "var(--radius-control, 10px)",
              background: "var(--color-primary, #5146e5)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.75 : 1,
            }}
          >
            {submitting ? "Adding…" : "Add todo"}
          </button>
        </div>
        {invalid && (
          <InlineFeedback
            tone="error"
            role="alert"
            className="create-todo-validation"
          >
            <span id="new-todo-title-error">Enter a todo title.</span>
          </InlineFeedback>
        )}
        {feedback && (
          <InlineFeedback tone={feedback.tone} role={feedback.tone === "error" ? "alert" : "status"}>
            {feedback.message}
          </InlineFeedback>
        )}
      </form>
      <style>{`
        @media (max-width: 600px) {
          .create-todo-controls { flex-direction: column; }
          .create-todo-controls input, .create-todo-controls button { width: 100%; min-height: 48px; }
        }
      `}</style>
    </section>
  );
}

export default CreateTodoForm;
