"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { TodoCreateForm } from "@/components/todo-create-form";
import { TodoList } from "@/components/todo-list";
import { createTodo, deleteTodo, getTodos, updateTodo, type Todo } from "@/lib/api-client";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const openerRef = useRef<HTMLElement | null>(null);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await getTodos();
      setTodos(result);
    } catch {
      setLoadError("We couldn’t load your todos. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  const handleCreate = async (title: string) => {
    const todo = await createTodo({ title });
    setTodos((current) => [todo, ...current]);
    return todo;
  };

  const handleUpdate = async (id: string, values: { title?: string; completed?: boolean }) => {
    const saved = await updateTodo(id, values);
    setTodos((current) => current.map((todo) => (todo.id === id ? saved : todo)));
    setAnnouncement(values.title !== undefined ? "Todo title saved." : saved.completed ? "Todo marked complete." : "Todo marked incomplete.");
    return saved;
  };

  const openDelete = (todo: Todo, trigger: HTMLElement) => {
    openerRef.current = trigger;
    setAnnouncement("");
    setSelectedTodo(todo);
  };

  const closeDelete = () => {
    setSelectedTodo(null);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  };

  const handleDelete = async () => {
    if (!selectedTodo) return;
    const id = selectedTodo.id;
    const title = selectedTodo.title;
    await deleteTodo(id);
    setTodos((current) => current.filter((todo) => todo.id !== id));
    setAnnouncement(`Deleted “${title}”.`);
  };

  return (
    <>
      <header style={{ marginBottom: 28 }}>
        <div aria-hidden="true" style={{ color: "var(--color-primary)", fontSize: 13, fontWeight: 600, letterSpacing: ".06em", marginBottom: 12 }}>
          ✓ &nbsp; TODO APP
        </div>
        <h1 className="page-title">Your todos</h1>
        <p className="muted-text" style={{ margin: "7px 0 0", fontSize: 15 }}>Keep track of what needs doing.</p>
      </header>

      <TodoCreateForm onCreate={handleCreate} />
      {announcement ? <p role="status" aria-live="polite" className="status-success" style={{ margin: "-10px 0 18px", fontSize: 13 }}>{announcement}</p> : null}

      <TodoList
        todos={todos}
        loading={loading}
        loadError={loadError}
        onRetry={() => void loadTodos()}
        onToggle={(todo, completed) => handleUpdate(todo.id, { completed })}
        onUpdate={(todo, title) => handleUpdate(todo.id, { title })}
        onDeleteRequest={(todo, trigger) => openDelete(todo, trigger)}
      />

      {selectedTodo ? (
        <ConfirmDeleteDialog
          todo={selectedTodo}
          onConfirm={handleDelete}
          onCancel={closeDelete}
        />
      ) : null}
    </>
  );
}
