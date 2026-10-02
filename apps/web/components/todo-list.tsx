"use client";

import { useCallback, useEffect, useState } from "react";
import { listTodos, type Todo } from "../lib/api";
import { CreateTodoForm } from "./create-todo-form";
import { InlineFeedback } from "./inline-feedback";
import { TodoRow } from "./todo-row";

export interface TodoListProps {
  /** Provide already-fetched todos to skip the initial client-side GET request. */
  initialTodos?: Todo[];
}

export function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos ?? []);
  const [loading, setLoading] = useState(initialTodos === undefined);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const loadedTodos = await listTodos();
      setTodos(loadedTodos);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialTodos === undefined) void load();
  }, [initialTodos, load]);

  function addTodo(todo: Todo) {
    setTodos((current) => {
      // The persisted server response is authoritative; guard against duplicate callbacks.
      if (current.some((item) => item.id === todo.id)) return current;
      return [...current, todo];
    });
  }

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <>
      <CreateTodoForm onCreated={addTodo} />
      <section
        aria-labelledby="todo-list-heading"
        className="todo-board"
        style={{
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-panel)",
          background: "var(--color-card)",
          boxShadow: "0 1px 3px rgba(32,36,49,0.06)",
        }}
      >
        <header
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
            style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: "28px" }}
          >
            Your todos
          </h2>
          {!loading && !loadError && (
            <span style={{ color: "var(--color-muted-foreground)", fontSize: 13, whiteSpace: "nowrap" }}>
              {todos.length} {todos.length === 1 ? "item" : "items"} · {completedCount} completed
            </span>
          )}
        </header>

        {loading ? (
          <div role="status" aria-live="polite" style={{ padding: "24px 20px", color: "var(--color-muted-foreground)" }}>
            Loading your todos…
          </div>
        ) : loadError ? (
          <div style={{ padding: "20px" }}>
            <InlineFeedback variant="error">We couldn’t load your todos. Try again.</InlineFeedback>
            <button
              type="button"
              onClick={() => void load()}
              style={{
                minHeight: 44,
                marginTop: 12,
                padding: "0 14px",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-control)",
                background: "var(--color-card)",
                color: "var(--color-foreground)",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        ) : todos.length === 0 ? (
          <p style={{ margin: 0, padding: "28px 20px", color: "var(--color-muted-foreground)" }}>
            Nothing on your list yet. Add a todo above to get started.
          </p>
        ) : (
          <ul aria-label="Todos" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {todos.map((todo) => <TodoRow key={todo.id} todo={todo} />)}
          </ul>
        )}
      </section>
      <style>{`
        @media (max-width: 600px) {
          .todo-board > header { min-height: 68px !important; padding: 13px 16px !important; }
          .todo-row { min-height: 0 !important; padding: 14px 15px 12px !important; }
        }
      `}</style>
    </>
  );
}

export default TodoList;
