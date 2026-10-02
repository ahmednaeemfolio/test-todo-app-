"use client";

import { useState } from "react";
import { InlineFeedback } from "@/components/inline-feedback";
import { TodoRow } from "@/components/todo-row";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { deleteTodo, type Todo } from "@/lib/api-client";

interface TodoListProps {
  todos: Todo[];
  onUpdated: (todo: Todo) => void;
  onDeleted: (id: string) => void;
}

export function TodoList({ todos, onUpdated, onDeleted }: TodoListProps) {
  const [selected, setSelected] = useState<Todo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  async function confirmDelete() {
    if (!selected) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTodo(selected.id);
      onDeleted(selected.id);
      setAnnouncement("Todo deleted.");
      setSelected(null);
    } catch {
      setDeleteError("Couldn’t delete that todo. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  function openDelete(todo: Todo) {
    setDeleteError(null);
    setSelected(todo);
  }

  return (
    <section aria-labelledby="list-heading" style={{ overflow: "hidden", border: "1px solid var(--color-border)", borderRadius: "var(--radius-panel)", background: "var(--color-card)", boxShadow: "var(--shadow-panel)" }}>
      <div style={{ display: "flex", minHeight: 76, alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 21px", borderBottom: "1px solid #e8e9ef" }}>
        <h2 id="list-heading" style={{ margin: 0, fontSize: 20, letterSpacing: "-.015em", lineHeight: "28px" }}>Your todos</h2>
        <span style={{ color: "var(--color-muted-foreground)", fontSize: 13, whiteSpace: "nowrap" }}>
          <span aria-hidden="true" style={{ display: "inline-block", width: 6, height: 6, marginRight: 7, borderRadius: "50%", background: "var(--color-primary)" }} />
          {todos.length} {todos.length === 1 ? "item" : "items"} · {todos.filter((todo) => todo.completed).length} completed
        </span>
      </div>
      {announcement && <p role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0, 0, 0, 0)" }}>{announcement}</p>}
      {todos.length === 0 ? (
        <p style={{ margin: 0, padding: "28px 22px", color: "var(--color-muted-foreground)" }}>Nothing on your list yet. Add a todo above to get started.</p>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {todos.map((todo) => (
            <TodoRow key={todo.id} todo={todo} onUpdated={onUpdated} onDelete={() => openDelete(todo)} />
          ))}
        </ul>
      )}
      <ConfirmDeleteDialog
        open={selected !== null}
        title={selected?.title ?? ""}
        pending={deleting}
        error={deleteError}
        onCancel={() => { if (!deleting) setSelected(null); }}
        onConfirm={() => void confirmDelete()}
      />
    </section>
  );
}
