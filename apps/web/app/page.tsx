"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import CreateTodoForm from "../components/create-todo-form";
import ConfirmDeleteDialog from "../components/confirm-delete-dialog";
import InlineFeedback from "../components/inline-feedback";
import { deleteTodo, listTodos, patchTodo, type Todo } from "../lib/api";

const pageStyle = {
  width: "min(100% - 48px, 720px)",
  marginInline: "auto",
  padding: "66px 0 80px",
} as const;

const buttonStyle = {
  minHeight: 44,
  padding: "0 12px",
  border: "1px solid transparent",
  borderRadius: 8,
  background: "transparent",
  color: "var(--color-muted-foreground, #626879)",
  cursor: "pointer",
  fontSize: 14,
} as const;

function requestMessage(error: unknown) {
  return error instanceof Error && error.message ? error.message : "Couldn't save that change. Try again.";
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      setTodos(await listTodos());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, retryVersion]);

  function addTodo(todo: Todo) {
    setTodos((current) => [todo, ...current]);
    setAnnouncement("Todo added.");
  }

  async function toggleTodo(todo: Todo) {
    if (busyId) return;
    setBusyId(todo.id);
    setAnnouncement("");
    try {
      const updated = await patchTodo(todo.id, { completed: !todo.completed });
      setTodos((current) => current.map((item) => item.id === todo.id ? updated : item));
      setAnnouncement(updated.completed ? "Todo marked completed." : "Todo marked incomplete.");
    } catch {
      setAnnouncement("Couldn't save that change. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditError(null);
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>, todo: Todo) {
    event.preventDefault();
    const title = editTitle.trim();
    if (!title) {
      setEditError("Enter a todo title.");
      return;
    }
    if (busyId) return;

    setBusyId(todo.id);
    setEditError(null);
    setAnnouncement("");
    try {
      const updated = await patchTodo(todo.id, { title });
      setTodos((current) => current.map((item) => item.id === todo.id ? updated : item));
      setEditingId(null);
      setEditTitle("");
      setAnnouncement("Todo title saved.");
    } catch {
      setEditError("Couldn't save that change. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteBusy) return;
    const target = deleteTarget;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await deleteTodo(target.id);
      setTodos((current) => current.filter((todo) => todo.id !== target.id));
      setDeleteTarget(null);
      setAnnouncement("Todo deleted.");
    } catch {
      setDeleteError("Couldn't delete that todo. Try again.");
    } finally {
      setDeleteBusy(false);
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <main className="todo-page" style={pageStyle}>
      <header style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 19, color: "#4c4d60", fontSize: 13, fontWeight: 600, letterSpacing: ".055em" }}>
          <span aria-hidden="true" style={{ display: "grid", width: 27, height: 27, placeItems: "center", border: "1px solid #dedcff", borderRadius: 8, background: "#efeeff", color: "var(--color-primary, #5146e5)" }}>✓</span>
          <span>TODO APP</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 650, letterSpacing: "-.045em", lineHeight: "40px" }}>Your todos</h1>
        <p style={{ margin: "7px 0 0", color: "var(--color-muted-foreground, #626879)", fontSize: 15 }}>Keep track of what needs doing.</p>
      </header>

      <CreateTodoForm onCreated={addTodo} />
      <div className="todo-board" style={{ overflow: "hidden", border: "1px solid var(--color-border, #d9dce5)", borderRadius: "var(--radius-panel, 14px)", background: "var(--color-card, #fff)", boxShadow: "0 1px 3px rgba(32,36,49,.06)" }}>
        <div style={{ display: "flex", minHeight: 76, alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 21px", borderBottom: "1px solid #e8e9ef" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-.015em", lineHeight: "28px" }}>Your todos</h2>
          <span style={{ color: "var(--color-muted-foreground, #626879)", fontSize: 13, whiteSpace: "nowrap" }}>{todos.length} {todos.length === 1 ? "item" : "items"} · {completedCount} completed</span>
        </div>

        {loading ? (
          <div aria-label="Loading todos" style={{ padding: "8px 20px 20px" }}>
            <p role="status" aria-live="polite" style={{ margin: "12px 0", color: "var(--color-muted-foreground, #626879)" }}>Loading your todos…</p>
            <div aria-hidden="true" className="todo-skeleton" />
            <div aria-hidden="true" className="todo-skeleton" />
          </div>
        ) : loadError ? (
          <div style={{ padding: "8px 20px 20px" }}>
            <InlineFeedback tone="error" role="alert">We couldn’t load your todos. Try again.</InlineFeedback>
            <button type="button" onClick={() => setRetryVersion((value) => value + 1)} style={{ ...buttonStyle, marginTop: 12, borderColor: "var(--color-border, #d9dce5)", background: "#fff", color: "var(--color-foreground, #202431)" }}>Retry</button>
          </div>
        ) : todos.length === 0 ? (
          <p style={{ margin: 0, padding: "24px 20px", color: "var(--color-muted-foreground, #626879)" }}>Nothing on your list yet. Add a todo above to get started.</p>
        ) : (
          <ul aria-label="Todo items" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {todos.map((todo) => {
              const isEditing = editingId === todo.id;
              const isBusy = busyId === todo.id;
              const errorId = `edit-error-${todo.id}`;
              return (
                <li key={todo.id} data-todo-id={todo.id} className={`todo-row${todo.completed ? " is-complete" : ""}`} style={{ display: "flex", minHeight: 77, alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: "1px solid #ececf1" }}>
                  <label aria-label={`Completion status for ${todo.title}`} style={{ display: "grid", width: 22, height: 22, flex: "0 0 22px", placeItems: "center" }}>
                    <input type="checkbox" checked={todo.completed} disabled={isBusy} aria-label={todo.completed ? `Mark ${todo.title} as incomplete` : `Mark ${todo.title} as complete`} onChange={() => void toggleTodo(todo)} style={{ width: 19, height: 19, margin: 0, accentColor: "var(--color-primary, #5146e5)", cursor: isBusy ? "wait" : "pointer" }} />
                  </label>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {isEditing ? (
                      <form onSubmit={(event) => void saveEdit(event, todo)} noValidate>
                        <input
                          autoFocus
                          type="text"
                          aria-label={`Todo title for ${todo.title}`}
                          aria-invalid={Boolean(editError) || undefined}
                          aria-describedby={editError ? errorId : undefined}
                          value={editTitle}
                          disabled={isBusy}
                          onChange={(event) => { setEditTitle(event.target.value); if (editError) setEditError(null); }}
                          style={{ width: "100%", minHeight: 42, padding: "0 10px", border: `1px solid ${editError ? "var(--color-destructive, #b42332)" : "var(--color-border, #d9dce5)"}`, borderRadius: "var(--radius-control, 10px)" }}
                        />
                        {editError && <InlineFeedback tone="error" role="alert"><span id={errorId}>{editError}</span></InlineFeedback>}
                        <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                          <button type="submit" disabled={isBusy} style={{ ...buttonStyle, background: "var(--color-primary, #5146e5)", color: "#fff" }}>{isBusy ? "Saving…" : "Save"}</button>
                          <button type="button" disabled={isBusy} onClick={cancelEdit} style={buttonStyle}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="todo-title" style={{ overflowWrap: "anywhere", color: todo.completed ? "var(--color-muted-foreground, #626879)" : "#292d3a", fontSize: 15, lineHeight: "22px", textDecoration: todo.completed ? "line-through" : undefined }}>{todo.title}</div>
                        <span className="todo-status" style={{ display: "block", marginTop: 2, color: todo.completed ? "var(--color-success, #187447)" : "#777d8b", fontSize: 12, lineHeight: "17px" }}>{todo.completed ? "Completed" : "Incomplete"}</span>
                      </>
                    )}
                  </div>
                  {!isEditing && <div className="row-actions" style={{ display: "flex", flex: "0 0 auto", alignItems: "center", gap: 4 }}>
                    <button type="button" aria-label={`Edit ${todo.title}`} disabled={Boolean(busyId)} onClick={() => startEdit(todo)} style={buttonStyle}>Edit</button>
                    <button type="button" aria-label={`Delete ${todo.title}`} disabled={Boolean(busyId)} onClick={() => { setDeleteTarget(todo); setDeleteError(null); }} style={{ ...buttonStyle, color: "var(--color-destructive, #b42332)" }}>Delete</button>
                  </div>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <p role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>{announcement}</p>
      {deleteTarget && <ConfirmDeleteDialog todoTitle={deleteTarget.title} busy={deleteBusy} error={deleteError} onCancel={() => { if (!deleteBusy) setDeleteTarget(null); }} onConfirm={() => void confirmDelete()} />}
      <style>{`
        .todo-row:last-child { border-bottom: 0 !important; }
        .todo-row:hover { background: #fcfcfe; }
        .row-actions { opacity: .72; }
        .todo-row:hover .row-actions, .todo-row:focus-within .row-actions { opacity: 1; }
        .todo-skeleton { height: 48px; margin: 10px 0; border-radius: 8px; background: var(--color-muted, #f0f1f5); }
        @media (max-width: 600px) {
          .todo-page { width: min(100% - 32px, 720px) !important; padding-top: 35px !important; padding-bottom: 48px !important; }
          .todo-page > header { margin-bottom: 23px !important; }
          .todo-board > div:first-child { min-height: 68px !important; padding: 13px 16px !important; }
          .todo-row { min-height: 0 !important; align-items: flex-start !important; gap: 10px !important; padding: 14px 12px 12px !important; }
          .row-actions { flex-wrap: wrap; }
        }
        @media (max-width: 375px) { .todo-page { width: calc(100% - 28px) !important; } }
      `}</style>
    </main>
  );
}
