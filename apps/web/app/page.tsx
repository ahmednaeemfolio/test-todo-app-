"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CreateTodoForm } from "../components/create-todo-form";
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog";
import { InlineFeedback } from "../components/inline-feedback";
import { deleteTodo, listTodos, patchTodo, type Todo } from "../lib/api";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [mutationError, setMutationError] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  async function loadTodos() {
    setLoading(true);
    setLoadError(false);
    try {
      setTodos(await listTodos());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTodos();
  }, []);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  function addTodo(todo: Todo) {
    setTodos((current) => current.some((item) => item.id === todo.id) ? current : [...current, todo]);
    setAnnouncement("Todo added.");
    setMutationError("");
  }

  async function toggleTodo(todo: Todo) {
    if (savingId || editingId) return;
    setSavingId(todo.id);
    setMutationError("");
    setAnnouncement("");
    try {
      const updated = await patchTodo(todo.id, { completed: !todo.completed });
      setTodos((current) => current.map((item) => item.id === todo.id ? updated : item));
      setAnnouncement(updated.completed ? "Todo marked complete." : "Todo marked incomplete.");
    } catch {
      setMutationError("Couldn’t save that change. Try again.");
    } finally {
      setSavingId(null);
    }
  }

  function beginEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditValue(todo.title);
    setEditError(null);
    setMutationError("");
    setAnnouncement("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
    setEditError(null);
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>, todo: Todo) {
    event.preventDefault();
    const title = editValue.trim();
    if (!title) {
      setEditError("Enter a todo title.");
      editInputRef.current?.focus();
      return;
    }
    if (savingId) return;

    setEditError(null);
    setSavingId(todo.id);
    setMutationError("");
    try {
      const updated = await patchTodo(todo.id, { title });
      setTodos((current) => current.map((item) => item.id === todo.id ? updated : item));
      setEditingId(null);
      setEditValue("");
      setAnnouncement("Todo updated.");
    } catch {
      // Keep edit mode and the typed value so the user can retry without losing work.
      setEditError("Couldn’t save that change. Try again.");
    } finally {
      setSavingId(null);
    }
  }

  function openDelete(todo: Todo) {
    setDeleteTarget(todo);
    setDeleteError(null);
    setMutationError("");
    setAnnouncement("");
  }

  function cancelDelete() {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTodo(deleteTarget.id);
      setTodos((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      setAnnouncement("Todo deleted.");
    } catch {
      setDeleteError("Couldn’t delete that todo. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <main className="todo-page" style={{ width: "min(100% - 48px, 720px)", margin: "0 auto", padding: "66px 0 80px" }}>
      <header style={{ marginBottom: 30 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 19, color: "#4c4d60", fontSize: 13, fontWeight: 600, letterSpacing: "0.055em" }}>
          <span aria-hidden="true" style={{ display: "grid", width: 27, height: 27, placeItems: "center", border: "1px solid #dedcff", borderRadius: 8, background: "#efeeff", color: "var(--color-primary)" }}>✓</span>
          <span>TODO APP</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 650, letterSpacing: "-0.03em", lineHeight: "40px" }}>Your todos</h1>
        <p style={{ margin: "7px 0 0", color: "var(--color-muted-foreground)" }}>Keep track of what needs doing.</p>
      </header>

      <CreateTodoForm onCreated={addTodo} />

      <section aria-labelledby="todo-list-heading" className="todo-board" style={{ overflow: "hidden", border: "1px solid var(--color-border)", borderRadius: "var(--radius-panel)", background: "var(--color-card)", boxShadow: "0 1px 3px rgba(32,36,49,0.06)" }}>
        <header className="todo-board-header" style={{ display: "flex", minHeight: 76, alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 21px", borderBottom: "1px solid #e8e9ef" }}>
          <h2 id="todo-list-heading" style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: "28px" }}>Your todos</h2>
          {!loading && !loadError && <span style={{ color: "var(--color-muted-foreground)", fontSize: 13, whiteSpace: "nowrap" }}>{todos.length} {todos.length === 1 ? "item" : "items"} · {completedCount} completed</span>}
        </header>

        {loading ? (
          <div role="status" aria-live="polite" style={{ padding: "24px 20px", color: "var(--color-muted-foreground)" }}>Loading your todos…</div>
        ) : loadError ? (
          <div style={{ padding: 20 }}>
            <InlineFeedback variant="error">We couldn’t load your todos. Try again.</InlineFeedback>
            <button type="button" onClick={() => void loadTodos()} style={{ minHeight: 44, marginTop: 12, padding: "0 14px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-control)", background: "var(--color-card)", cursor: "pointer" }}>Retry</button>
          </div>
        ) : todos.length === 0 ? (
          <p style={{ margin: 0, padding: "28px 20px", color: "var(--color-muted-foreground)" }}>Nothing on your list yet. Add a todo above to get started.</p>
        ) : (
          <ul aria-label="Todos" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {todos.map((todo) => {
              const isEditing = editingId === todo.id;
              const isSaving = savingId === todo.id;
              const errorId = `edit-error-${todo.id}`;
              return (
                <li key={todo.id} className={`todo-row${todo.completed ? " is-complete" : ""}`} data-todo-id={todo.id} style={{ display: "flex", minHeight: 77, alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: "1px solid #ececf1" }}>
                  <label className="completion" style={{ display: "grid", width: 22, height: 22, flex: "0 0 22px", placeItems: "center" }}>
                    <input type="checkbox" checked={todo.completed} disabled={isSaving || Boolean(savingId) || isEditing} onChange={() => void toggleTodo(todo)} aria-label={`${todo.completed ? "Mark" : "Mark"} ${todo.title} as ${todo.completed ? "incomplete" : "complete"}`} style={{ width: 19, height: 19, margin: 0, accentColor: "var(--color-primary)", cursor: isSaving ? "wait" : "pointer" }} />
                  </label>
                  <div className="todo-copy" style={{ minWidth: 0, flex: 1 }}>
                    {isEditing ? (
                      <form onSubmit={(event) => void saveEdit(event, todo)} noValidate>
                        <input
                          ref={editInputRef}
                          aria-label={`Edit ${todo.title}`}
                          aria-invalid={Boolean(editError) || undefined}
                          aria-describedby={editError ? errorId : undefined}
                          value={editValue}
                          onChange={(event) => { setEditValue(event.target.value); if (editError) setEditError(null); }}
                          disabled={isSaving}
                          style={{ width: "100%", minWidth: 0, minHeight: 42, padding: "0 10px", border: `1px solid ${editError ? "var(--color-destructive)" : "var(--color-border)"}`, borderRadius: "var(--radius-control)", background: "var(--color-card)" }}
                        />
                        {editError && <p id={errorId} role="alert" style={{ margin: "5px 0 0", color: "var(--color-destructive)", fontSize: 13 }}>{editError}</p>}
                        <div className="edit-actions" style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <button type="submit" disabled={isSaving} style={smallButtonStyle}>{isSaving ? "Saving…" : "Save"}</button>
                          <button type="button" onClick={cancelEdit} disabled={isSaving} style={smallButtonStyle}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="todo-title" style={{ overflowWrap: "anywhere", color: todo.completed ? "var(--color-muted-foreground)" : "#292d3a", fontSize: 15, lineHeight: "22px", textDecoration: todo.completed ? "line-through" : "none", textDecorationColor: "#a8abb5" }}>{todo.title}</div>
                        <span className="todo-status" style={{ display: "block", marginTop: 2, color: todo.completed ? "var(--color-success)" : "#777d8b", fontSize: 12, lineHeight: "17px" }}>{todo.completed ? "Completed" : "Incomplete"}</span>
                      </>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="row-actions" style={{ display: "flex", flex: "0 0 auto", alignItems: "center", gap: 4 }}>
                      <button type="button" aria-label={`Edit ${todo.title}`} onClick={() => beginEdit(todo)} disabled={Boolean(savingId)} style={rowButtonStyle}>Edit</button>
                      <button type="button" aria-label={`Delete ${todo.title}`} onClick={() => openDelete(todo)} disabled={Boolean(savingId)} style={{ ...rowButtonStyle, color: "var(--color-destructive)" }}>Delete</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {mutationError && <InlineFeedback variant="error">{mutationError}</InlineFeedback>}
      <p role="status" aria-live="polite" style={{ minHeight: 20, margin: "12px 1px 0", color: "var(--color-success)", fontSize: 13 }}>{announcement}</p>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        todoTitle={deleteTarget?.title ?? ""}
        deleting={deleting}
        error={deleteError}
        onCancel={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
      <style>{`
        @media (max-width: 600px) {
          .todo-page { width: min(100% - 32px, 720px) !important; padding-top: 35px !important; padding-bottom: 48px !important; }
          .todo-page > header { margin-bottom: 23px !important; }
          .todo-page h1 { font-size: 29px !important; line-height: 36px !important; }
          .todo-board-header { min-height: 68px !important; padding: 13px 16px !important; }
          .todo-row { min-height: 0 !important; align-items: flex-start !important; gap: 10px !important; padding: 14px 12px 12px !important; }
          .row-actions { gap: 1px !important; }
          .row-actions button { min-width: 44px !important; padding: 0 6px !important; }
          .edit-actions { flex-wrap: wrap; }
        }
      `}</style>
    </main>
  );
}

const smallButtonStyle = {
  minHeight: 40,
  padding: "0 12px",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  background: "var(--color-card)",
  cursor: "pointer",
};

const rowButtonStyle = {
  display: "inline-flex",
  minWidth: 44,
  minHeight: 44,
  alignItems: "center",
  justifyContent: "center",
  padding: "0 8px",
  border: "1px solid transparent",
  borderRadius: 8,
  background: "transparent",
  color: "#5f6473",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
};
