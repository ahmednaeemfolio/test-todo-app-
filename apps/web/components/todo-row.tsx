import type { Todo } from "../lib/api";

export interface TodoRowProps {
  todo: Todo;
}

/** A semantic, text-first representation of one persisted todo. */
export function TodoRow({ todo }: TodoRowProps) {
  return (
    <li
      className={`todo-row${todo.completed ? " is-complete" : ""}`}
      data-todo-id={todo.id}
      style={{
        display: "flex",
        minHeight: 72,
        alignItems: "center",
        gap: 14,
        padding: "13px 20px",
        borderBottom: "1px solid #ececf1",
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          className="todo-title"
          style={{
            overflowWrap: "anywhere",
            color: todo.completed ? "var(--color-muted-foreground)" : "var(--color-foreground)",
            fontSize: 15,
            lineHeight: "22px",
            textDecoration: todo.completed ? "line-through" : "none",
            textDecorationColor: "#a8abb5",
          }}
        >
          {todo.title}
        </div>
        <span
          className="todo-status"
          style={{
            display: "block",
            marginTop: 2,
            color: todo.completed ? "var(--color-success)" : "var(--color-muted-foreground)",
            fontSize: 13,
            lineHeight: "18px",
          }}
        >
          {todo.completed ? "Completed" : "Incomplete"}
        </span>
      </div>
    </li>
  );
}

export default TodoRow;
