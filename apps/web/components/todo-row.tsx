import type { CSSProperties } from "react";
import type { Todo } from "../lib/api";

export interface TodoRowProps {
  todo: Todo;
}

const rowStyle: CSSProperties = {
  display: "flex",
  minHeight: 76,
  alignItems: "center",
  gap: 14,
  padding: "13px 20px",
  borderBottom: "1px solid #ececf1",
};

/** A semantic list item with state communicated in plain text as well as visually. */
export function TodoRow({ todo }: TodoRowProps) {
  return (
    <li
      data-todo-id={todo.id}
      className={todo.completed ? "todo-row is-complete" : "todo-row"}
      style={rowStyle}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            overflowWrap: "anywhere",
            color: todo.completed ? "var(--color-muted-foreground, #626879)" : "var(--color-foreground, #202431)",
            fontSize: 15,
            lineHeight: "22px",
            textDecoration: todo.completed ? "line-through" : undefined,
          }}
        >
          {todo.title}
        </div>
        <span
          style={{
            display: "block",
            marginTop: 2,
            color: todo.completed ? "var(--color-success, #187447)" : "var(--color-muted-foreground, #626879)",
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
