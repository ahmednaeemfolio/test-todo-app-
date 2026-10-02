"use client";

import { useRef, useState } from "react";
import type { Todo } from "../lib/api-client";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { TodoRow } from "./todo-row";

interface TodoListProps {
  todos: Todo[];
  onUpdated: (todo: Todo) => void;
  onDeleted: (id: string) => void;
  onAnnounce: (message: string) => void;
}

export function TodoList({ todos, onUpdated, onDeleted, onAnnounce }: TodoListProps) {
  const [pendingDelete, setPendingDelete] = useState<Todo | null>(null);
  const deleteTrigger = useRef<HTMLButtonElement | null>(null);
  const completedCount = todos.filter((todo) => todo.completed).length;

  function closeDialog() {
    setPendingDelete(null);
    window.setTimeout(() => deleteTrigger.current?.focus(), 0);
  }

  return (
    <>
      <section aria-labelledby="todo-list-heading" style={{ overflow: "hidden", border: "1px solid rgba(217, 220, 229, .88)", borderRadius: "var(--radius-panel)", background: "var(--color-card)", boxShadow: "var(--shadow-panel)" }}>
        <div style={{ display: "flex", minHeight: 76, alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 21px", borderBottom: "1px solid #e8e9ef" }}>
          <h2 id="todo-list-heading" style={{ margin: 0 }}>Your todos</h2>
          <span style={{ color: "var(--color-muted-foreground)", fontSize: 13, whiteSpace: "nowrap" }}>
            {todos.length} {todos.length === 1 ? "item" : "items"} · {completedCount} completed
          </span>
        </div>
        {todos.length === 0 ? (
          <p style={{ margin: 0, padding: "28px 21px", color: "var(--color-muted-foreground)" }}>Nothing on your list yet. Add a todo above to get started.</p>
        ) : (
          <ul aria-label="Todo items" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {todos.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onUpdated={onUpdated}
                onRequestDelete={(item, trigger) => {
                  deleteTrigger.current = trigger;
                  setPendingDelete(item);
                }}
                onAnnounce={onAnnounce}
              />
            ))}
          </ul>
        )}
      </section>
      {pendingDelete ? (
        <ConfirmDeleteDialog
          todo={pendingDelete}
          onRequestClose={closeDialog}
          onDeleted={() => {
            onDeleted(pendingDelete.id);
            onAnnounce("Todo deleted.");
            closeDialog();
          }}
        />
      ) : null}
    </>
  );
}
