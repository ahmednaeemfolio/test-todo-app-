"use client";

import type { Todo } from "@/lib/api-client";
import { TodoRow } from "@/components/todo-row";
import { Button } from "@/components/button";
import { InlineFeedback } from "@/components/inline-feedback";

export type TodoListProps = {
  todos: Todo[];
  loading: boolean;
  loadError: string | null;
  onRetry: () => void;
  onToggle: (todo: Todo, completed: boolean) => Promise<Todo>;
  onUpdate: (todo: Todo, title: string) => Promise<Todo>;
  onDeleteRequest: (todo: Todo, trigger: HTMLElement) => void;
};

export function TodoList({ todos, loading, loadError, onRetry, onToggle, onUpdate, onDeleteRequest }: TodoListProps) {
  const completedCount = todos.filter((todo) => todo.completed).length;
  return (
    <section className="panel" aria-labelledby="todo-list-heading" style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", minHeight: 72, alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--color-border)" }}>
        <h2 className="section-title" id="todo-list-heading">Your todos</h2>
        <span className="muted-text" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
          {loading ? "Loading" : `${todos.length} ${todos.length === 1 ? "item" : "items"} · ${completedCount} completed`}
        </span>
      </div>
      {loadError ? (
        <div style={{ padding: 20 }}>
          <InlineFeedback variant="error">{loadError}</InlineFeedback>
          <Button variant="secondary" onClick={onRetry} style={{ marginTop: 14 }}>Retry</Button>
        </div>
      ) : loading ? (
        <div role="status" aria-live="polite" aria-label="Loading your todos" style={{ padding: "8px 20px" }}>
          <p className="muted-text" style={{ margin: "12px 0" }}>Loading your todos…</p>
          {[0, 1, 2].map((row) => <div key={row} aria-hidden="true" style={{ height: 54, borderBottom: "1px solid var(--color-border)", opacity: 0.5 }} />)}
        </div>
      ) : todos.length === 0 ? (
        <p className="muted-text" style={{ margin: 0, padding: "28px 20px", textAlign: "center" }}>
          Nothing on your list yet. Add a todo above to get started.
        </p>
      ) : (
        <ul aria-label="Todo items" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {todos.map((todo) => (
            <TodoRow key={todo.id} todo={todo} onToggle={onToggle} onUpdate={onUpdate} onDeleteRequest={onDeleteRequest} />
          ))}
        </ul>
      )}
    </section>
  );
}
