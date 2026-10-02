"use client";

import { useCallback, useEffect, useState } from "react";
import { listTodos, type Todo } from "../lib/api";
import InlineFeedback from "./inline-feedback";
import TodoRow from "./todo-row";

export interface TodoListProps {
  /** Provide todos to use the list as a controlled view; otherwise it loads GET /todos. */
  todos?: Todo[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const boardStyle = {
  overflow: "hidden",
  border: "1px solid var(--color-border, #d9dce5)",
  borderRadius: "var(--radius-panel, 14px)",
  background: "var(--color-card, #fff)",
  boxShadow: "0 1px 3px rgba(32,36,49,.06)",
} as const;

/** Loads the shared collection by default and also supports parent-controlled data. */
export function TodoList({ todos, loading, error, onRetry }: TodoListProps) {
  const controlled = todos !== undefined;
  const [loadedTodos, setLoadedTodos] = useState<Todo[]>([]);
  const [requestLoading, setRequestLoading] = useState(!controlled);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadTodos = useCallback(async () => {
    setRequestLoading(true);
    setRequestError(null);
    try {
      setLoadedTodos(await listTodos());
    } catch {
      setRequestError("We couldn’t load your todos. Try again.");
    } finally {
      setRequestLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!controlled) void loadTodos();
  }, [controlled, loadTodos, retryCount]);

  const items = controlled ? todos : loadedTodos;
  const isLoading = loading ?? requestLoading;
  const errorMessage = controlled ? error : requestError;

  function retry() {
    if (onRetry) {
      onRetry();
    } else if (controlled) {
      setRetryCount((count) => count + 1);
    } else {
      void loadTodos();
    }
  }

  const completedCount = items.filter((todo) => todo.completed).length;

  return (
    <section aria-labelledby="todo-list-heading" style={boardStyle}>
      <div
        style={{
          display: "flex",
          minHeight: 76,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "16px 21px",
          borderBottom: "1px solid #e8e9ef",
        }}
      >
        <h2
          id="todo-list-heading"
          style={{ margin: 0, fontSize: 20, fontWeight: 600, lineHeight: "28px", letterSpacing: "-.015em" }}
        >
          Your todos
        </h2>
        <span style={{ color: "var(--color-muted-foreground, #626879)", fontSize: 13, whiteSpace: "nowrap" }}>
          {items.length} {items.length === 1 ? "item" : "items"} · {completedCount} completed
        </span>
      </div>

      {isLoading ? (
        <p role="status" aria-live="polite" style={{ margin: 0, padding: "24px 20px", color: "var(--color-muted-foreground, #626879)" }}>
          Loading your todos…
        </p>
      ) : errorMessage ? (
        <div style={{ padding: "8px 20px 20px" }}>
          <InlineFeedback tone="error" role="alert">{errorMessage}</InlineFeedback>
          <button
            type="button"
            onClick={retry}
            style={{
              minHeight: 44,
              marginTop: 12,
              padding: "0 14px",
              border: "1px solid var(--color-border, #d9dce5)",
              borderRadius: "var(--radius-control, 10px)",
              background: "var(--color-card, #fff)",
              color: "var(--color-foreground, #202431)",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <p style={{ margin: 0, padding: "24px 20px", color: "var(--color-muted-foreground, #626879)" }}>
          Nothing on your list yet. Add a todo above to get started.
        </p>
      ) : (
        <ul aria-label="Todo items" style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {items.map((todo) => <TodoRow key={todo.id} todo={todo} />)}
        </ul>
      )}
    </section>
  );
}

export default TodoList;
