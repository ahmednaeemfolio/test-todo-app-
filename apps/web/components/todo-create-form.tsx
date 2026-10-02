"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/button";
import { InlineFeedback } from "@/components/inline-feedback";
import { TextInput } from "@/components/text-input";
import type { Todo } from "@/lib/api-client";

const inputId = "new-todo-title";

export function TodoCreateForm({ onCreate }: { onCreate: (title: string) => Promise<Todo> }) {
  const [title, setTitle] = useState("");
  const [validation, setValidation] = useState("");
  const [requestError, setRequestError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    setSuccess(false);
    setRequestError("");
    if (!trimmedTitle) {
      setValidation("Enter a todo title.");
      document.getElementById(inputId)?.focus();
      return;
    }
    setValidation("");
    setSubmitting(true);
    try {
      await onCreate(trimmedTitle);
      setTitle("");
      setSuccess(true);
    } catch {
      setRequestError("Couldn’t add that todo. Your title is still here; please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel" aria-label="Create a todo" style={{ padding: 20, marginBottom: 24 }}>
      <form onSubmit={submit} noValidate>
        <TextInput
          id={inputId}
          label="Add a task"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (validation) setValidation("");
            setSuccess(false);
          }}
          placeholder="What needs to get done?"
          autoComplete="off"
          error={validation || undefined}
          disabled={submitting}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Button type="submit" loading={submitting} style={{ minWidth: 132 }}>
            Add todo
          </Button>
        </div>
      </form>
      {success ? <p role="status" aria-live="polite" className="status-success" style={{ margin: "12px 0 0", fontSize: 13 }}>Todo added.</p> : null}
      {requestError ? <div style={{ marginTop: 12 }}><InlineFeedback variant="error">{requestError}</InlineFeedback></div> : null}
    </section>
  );
}
