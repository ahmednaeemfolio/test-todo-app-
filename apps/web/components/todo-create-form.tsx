"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./button";
import { InlineFeedback } from "./inline-feedback";
import { TextInput } from "./text-input";
import { todoApi, type Todo } from "../lib/api-client";

export function TodoCreateForm({ onCreated }: { onCreated: (todo: Todo) => void }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Enter a todo title.");
      setMessage("");
      document.getElementById("new-todo-title")?.focus();
      return;
    }
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const saved = await todoApi.createTodo({ title: trimmedTitle });
      onCreated(saved);
      setTitle("");
      setMessage("Todo added.");
      document.getElementById("new-todo-title")?.focus();
    } catch {
      setError("We couldn’t add that todo. Your title is still here. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-label="Create a todo" style={{ marginBottom: 26, padding: 20, border: "1px solid rgba(217, 220, 229, .88)", borderRadius: "var(--radius-panel)", background: "var(--color-card)", boxShadow: "var(--shadow-panel)" }}>
      <form onSubmit={submit} noValidate>
        <TextInput
          id="new-todo-title"
          label="Add a task"
          name="title"
          type="text"
          placeholder="What needs to get done?"
          autoComplete="off"
          value={title}
          onChange={(event) => {
            setTitle(event.currentTarget.value);
            if (error) setError("");
            if (message) setMessage("");
          }}
          error={error === "Enter a todo title." ? error : undefined}
          disabled={submitting}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Button type="submit" loading={submitting} style={{ minHeight: 44, paddingInline: 18 }}>
            Add todo
          </Button>
        </div>
      </form>
      {message ? <div style={{ marginTop: 12 }}><InlineFeedback variant="success">{message}</InlineFeedback></div> : null}
      {error && error !== "Enter a todo title." ? <div style={{ marginTop: 12 }}><InlineFeedback variant="error">{error}</InlineFeedback></div> : null}
    </section>
  );
}
