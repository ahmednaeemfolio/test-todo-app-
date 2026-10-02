"use client";

import { useState } from "react";
import { deleteTodo, Todo, updateTodo } from "@/lib/api-client";
import { Button } from "@/components/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { TodoRow } from "@/components/todo-row";

type TodoListProps = {
  todos: Todo[];
  loading: boolean;
  loadError: string | null;
  onRetry: () => void;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onAnnounce: (message: string) => void;
};

export function TodoList({ todos, loading, loadError, onRetry, onUpdate, onDelete, onAnnounce }: TodoListProps) {
  const [deleting, setDeleting] = useState<Todo | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const completed = todos.filter((todo) => todo.completed).length;

  async function confirmDelete() {
    if (!deleting) return;
    await deleteTodo(deleting.id);
    onDelete(deleting.id);
    onAnnounce("Todo deleted.");
    setDeleting(null);
    setDeleteError("");
  }

  return (
    <>
      <section className="board" aria-labelledby="list-heading" aria-busy={loading}>
        <div className="board-header">
          <h2 id="list-heading">Your todos</h2>
          {!loading && !loadError ? <span className="list-count"><span className="count-dot" aria-hidden="true" />{todos.length} {todos.length === 1 ? "item" : "items"} · {completed} completed</span> : null}
        </div>
        {loading ? (
          <div className="state-message" role="status" aria-live="polite">
            <span className="skeleton" aria-hidden="true" /><span className="skeleton short" aria-hidden="true" />
            <span className="loading-copy">Loading your todos…</span>
          </div>
        ) : loadError ? (
          <div className="state-message error-state" role="alert">
            <p>{loadError}</p><Button variant="secondary" onClick={onRetry}>Try again</Button>
          </div>
        ) : todos.length === 0 ? (
          <p className="state-message empty-state">Nothing on your list yet. Add a todo above to get started.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onUpdate={async (patch) => {
                  const updated = await updateTodo(todo.id, patch);
                  onUpdate(updated);
                  return updated;
                }}
                onRequestDelete={() => { setDeleting(todo); setDeleteError(""); }}
              />
            ))}
          </ul>
        )}
      </section>
      <ConfirmDeleteDialog
        todo={deleting}
        error={deleteError}
        onCancel={() => { setDeleting(null); setDeleteError(""); }}
        onConfirm={async () => {
          try {
            await confirmDelete();
          } catch {
            setDeleteError("Couldn’t delete that todo. Try again.");
          }
        }}
      />
      <style jsx>{`
        .board { overflow: hidden; border: 1px solid rgb(217 220 229 / 88%); border-radius: var(--radius-panel); background: var(--color-card); box-shadow: 0 2px 8px rgb(32 36 49 / 4%), 0 1px 2px rgb(32 36 49 / 4%); }
        .board-header { min-height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 21px; border-bottom: 1px solid #e8e9ef; }
        h2 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -.025em; line-height: 28px; }
        .list-count { display: inline-flex; align-items: center; gap: 7px; color: var(--color-muted-foreground); font-size: 13px; white-space: nowrap; }
        .count-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-primary); opacity: .72; }
        .todo-list { margin: 0; padding: 0; list-style: none; }
        .state-message { min-height: 108px; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 24px; color: var(--color-muted-foreground); text-align: center; }
        .empty-state { margin: 0; }
        .error-state { flex-direction: column; color: var(--color-destructive); }
        .error-state p { margin: 0; }
        .skeleton { width: 24px; height: 24px; border-radius: 6px; background: var(--color-muted); }
        .skeleton.short { width: min(48%, 240px); height: 16px; }
        .loading-copy { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
        @media (max-width: 600px) { .board-header { min-height: 68px; padding: 13px 16px; } }
      `}</style>
    </>
  );
}
