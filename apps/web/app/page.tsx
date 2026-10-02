"use client";

import { useCallback, useEffect, useState } from "react";
import { createTodo, Todo, listTodos } from "@/lib/api-client";
import { TodoCreateForm } from "@/components/todo-create-form";
import { TodoList } from "@/components/todo-list";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    listTodos()
      .then((items) => {
        if (active) setTodos(items);
      })
      .catch(() => {
        if (active) setLoadError("We couldn’t load your todos. Try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  return (
    <div className="todo-home">
      <header className="page-header">
        <div className="brand" aria-label="Todo App">
          <span className="brand-mark" aria-hidden="true">✓</span>
          <span>TODO APP</span>
        </div>
        <h1>Your todos</h1>
        <p className="intro">Keep track of what needs doing.</p>
      </header>

      <TodoCreateForm
        onCreate={async (title) => {
          const response = await createTodo({ title });
          setTodos((current) => [response, ...current]);
          setLoadError(null);
          setAnnouncement("Todo added.");
        }}
      />

      <TodoList
        todos={todos}
        loading={loading}
        loadError={loadError}
        onRetry={refresh}
        onUpdate={(updated) => {
          setTodos((current) => current.map((todo) => todo.id === updated.id ? updated : todo));
        }}
        onDelete={(id) => {
          setTodos((current) => current.filter((todo) => todo.id !== id));
        }}
        onAnnounce={setAnnouncement}
      />
      <p className="page-announcement" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>

      <style jsx>{`
        .todo-home { width: min(100%, 720px); margin: 0 auto; padding: 4px 0 24px; }
        .page-header { margin-bottom: 26px; }
        .brand { display: inline-flex; align-items: center; gap: 9px; margin: 0 0 16px; color: #4c4d60; font-size: 13px; font-weight: 600; letter-spacing: .055em; }
        .brand-mark { display: grid; width: 27px; height: 27px; place-items: center; border: 1px solid #dedcff; border-radius: 8px; background: #efeeff; color: var(--color-primary); font-size: 15px; }
        h1 { margin: 0; font-size: 32px; font-weight: 650; letter-spacing: -.04em; line-height: 40px; }
        .intro { margin: 7px 0 0; color: var(--color-muted-foreground); font-size: 15px; line-height: 23px; }
        .page-announcement { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
        @media (max-width: 600px) { .todo-home { padding-top: 0; } .page-header { margin-bottom: 22px; } h1 { font-size: 29px; line-height: 36px; } }
      `}</style>
    </div>
  );
}
