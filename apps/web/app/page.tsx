"use client";

import { useCallback, useEffect, useState } from "react";
import { InlineFeedback } from "@/components/inline-feedback";
import { TodoCreateForm } from "@/components/todo-create-form";
import { TodoList } from "@/components/todo-list";
import { Button } from "@/components/button";
import { getTodos, type Todo } from "@/lib/api-client";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      setTodos(await getTodos());
    } catch {
      setLoadError("We couldn’t load your todos. Try again.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addTodo = (todo: Todo) => {
    setTodos((current) => [todo, ...(current ?? [])]);
  };

  const updateTodo = (updated: Todo) => {
    setTodos((current) => current?.map((todo) => todo.id === updated.id ? updated : todo) ?? [updated]);
  };

  const removeTodo = (id: string) => {
    setTodos((current) => current?.filter((todo) => todo.id !== id) ?? []);
  };

  return (
    <main style={{ width: "100%" }}>
      <header style={{ marginBottom: 30 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 18, color: "#4c4d60", fontSize: 13, fontWeight: 600, letterSpacing: ".055em" }}>
          <span aria-hidden="true" style={{ display: "grid", width: 28, height: 28, placeItems: "center", border: "1px solid #dedcff", borderRadius: 8, background: "#efeeff", color: "var(--color-primary)", fontSize: 17 }}>✓</span>
          <span>TODO APP</span>
        </div>
        <h1>Your todos</h1>
        <p style={{ margin: "7px 0 0", color: "var(--color-muted-foreground)", fontSize: 15 }}>Keep track of what needs doing.</p>
      </header>

      <TodoCreateForm onCreated={addTodo} />

      {loadError ? (
        <section aria-label="Todo list" style={{ padding: 24, border: "1px solid var(--color-border)", borderRadius: "var(--radius-panel)", background: "var(--color-card)" }}>
          <InlineFeedback type="error">{loadError}</InlineFeedback>
          <Button type="button" variant="secondary" onClick={() => void load()} style={{ marginTop: 16 }}>Retry</Button>
        </section>
      ) : todos === null ? (
        <section aria-label="Todo list" aria-busy="true" style={{ overflow: "hidden", border: "1px solid var(--color-border)", borderRadius: "var(--radius-panel)", background: "var(--color-card)", boxShadow: "var(--shadow-panel)" }}>
          <div style={{ padding: "20px 22px", borderBottom: "1px solid var(--color-border)", fontWeight: 600 }}>Your todos</div>
          <p role="status" style={{ margin: 0, padding: "22px", color: "var(--color-muted-foreground)" }}>Loading your todos…</p>
          <div aria-hidden="true" style={{ padding: "0 22px 20px" }}>
            {[1, 2].map((item) => <div key={item} style={{ height: 12, marginTop: 14, borderRadius: 6, background: "var(--color-muted)", maxWidth: item === 1 ? "78%" : "54%" }} />)}
          </div>
        </section>
      ) : (
        <TodoList todos={todos} onUpdated={updateTodo} onDeleted={removeTodo} />
      )}
    </main>
  );
}
