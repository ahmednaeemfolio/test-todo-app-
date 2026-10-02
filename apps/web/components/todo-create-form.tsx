"use client";

import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/button";
import { InlineFeedback } from "@/components/inline-feedback";
import { Todo } from "@/lib/api-client";

type TodoCreateFormProps = { onCreate: (title: string) => Promise<void | Todo> };

export function TodoCreateForm({ onCreate }: TodoCreateFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    setRequestError("");
    if (!trimmed) {
      setError("Enter a todo title.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onCreate(trimmed);
      setTitle("");
    } catch {
      setRequestError("Couldn’t add that todo. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="create-card" aria-label="Create a todo">
      <form onSubmit={handleSubmit} noValidate>
        <label className="form-label" htmlFor="new-todo">Add a task</label>
        <input
          ref={inputRef}
          id="new-todo"
          className="text-input"
          type="text"
          placeholder="What needs to get done?"
          autoComplete="off"
          value={title}
          onChange={(event) => { setTitle(event.target.value); if (error) setError(""); }}
          disabled={submitting}
          aria-required="true"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "new-todo-error" : undefined}
        />
        {error ? <p className="field-error" id="new-todo-error" role="alert">{error}</p> : null}
        <div className="create-controls">
          <Button type="submit" loading={submitting}>Add todo</Button>
        </div>
      </form>
      {requestError ? <InlineFeedback variant="error">{requestError}</InlineFeedback> : null}
      <style jsx>{`
        .create-card { padding: 20px; margin-bottom: 24px; border: 1px solid rgb(217 220 229 / 88%); border-radius: var(--radius-panel); background: var(--color-card); box-shadow: 0 2px 8px rgb(32 36 49 / 4%), 0 1px 2px rgb(32 36 49 / 4%); }
        .create-controls { display: flex; justify-content: flex-end; margin-top: 12px; }
        .field-error { margin: 6px 0 0; color: var(--color-destructive); font-size: 13px; }
        .text-input[aria-invalid="true"] { border-color: var(--color-destructive); }
        @media (max-width: 600px) { .create-card { padding: 16px; margin-bottom: 20px; } .create-controls :global(button) { width: 100%; min-height: 48px; } }
      `}</style>
    </section>
  );
}
