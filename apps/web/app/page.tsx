"use client";

import { useCallback, useEffect, useState } from "react";
import { InlineFeedback } from "../components/inline-feedback";
import { TodoCreateForm } from "../components/todo-create-form";
import { TodoList } from "../components/todo-list";
import { todoApi, type Todo } from "../lib/api-client";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    let active = true;
    setLoadState("loading");
    todoApi.getTodos().then((items) => {
      if (!active) return;
      setTodos(items);
      setLoadState("ready");
    }).catch(() => {
      if (active) setLoadState("error");
    });
    return () => {
      active = false;
    };
  }, [retry]);

  const handleCreated = useCallback((todo: Todo) => {
    setTodos((current) => [todo, ...current.filter((item) => item.id !== todo.id)]);
    setLoadState("ready");
  }, []);

  const updateTodo = useCallback((updated: Todo) => {
    setTodos((current) => current.map((todo) => todo.id === updated.id ? updated : todo));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }, []);

  return (
    <main>
      <header style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 19, color: "#4c4d60", fontSize: 13, fontWeight: 600, letterSpacing: ".055em" }}>
          <span aria-hidden="true" style={{ display: "grid", width: 27, height: 27, placeItems: "center", border: "1px solid #dedcff", borderRadius: 8, background: "#efeeff", color: "var(--color-primary)" }}>✓</span>
          <span>TODO APP</span>
        </div>
        <h1>Your todos</h1>
        <p style={{ margin: "7px 0 0", color: "var(--color-muted-foreground)" }}>Keep track of what needs doing.</p>
      </header>

      <TodoCreateForm onCreated={handleCreated} />

      {announcement ? (
        <div role="status" aria-live="polite" aria-atomic="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap" }}>
          {announcement}
        </div>
      ) : null}

      {loadState === "loading" ? (
        <section aria-labelledby="list-heading" aria-busy="true" style={boardStyle}>
          <BoardHeader count={null} />
          <p role="status" style={{ margin: 0, padding: "24px 21px", color: "var(--color-muted-foreground)" }}>Loading your todos…</p>
        </section>
      ) : loadState === "error" ? (
        <section aria-labelledby="list-heading" style={boardStyle}>
          <BoardHeader count={null} />
          <div style={{ padding: 20 }}>
            <InlineFeedback variant="error">We couldn’t load your todos. Try again.</InlineFeedback>
            <button type="button" onClick={() => setRetry((value) => value + 1)} style={retryButtonStyle}>Retry</button>
          </div>
        </section>
      ) : (
        <TodoList todos={todos} onUpdated={updateTodo} onDeleted={deleteTodo} onAnnounce={setAnnouncement} />
      )}
    </main>
  );
}

const boardStyle = {
  overflow: "hidden" as const,
  border: "1px solid rgba(217, 220, 229, 0.88)",
  borderRadius: "var(--radius-panel)",
  background: "var(--color-card)",
  boxShadow: "0 2px 8px rgba(32,36,49,.045), 0 1px 2px rgba(32,36,49,.035)",
};

const retryButtonStyle = {
  minHeight: 44,
  marginTop: 12,
  padding: "0 15px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-control)",
  background: "var(--color-card)",
  fontWeight: 500,
};

function BoardHeader({ count }: { count: number | null }) {
  return (
    <div style={{ display: "flex", minHeight: 72, alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 21px", borderBottom: "1px solid #e8e9ef" }}>
      <h2 id="list-heading" style={{ margin: 0 }}>Your todos</h2>
      <span style={{ color: "var(--color-muted-foreground)", fontSize: 13 }}>
        {count === null ? "Your list" : `${count} ${count === 1 ? "item" : "items"}`}
      </span>
    </div>
  );
}
