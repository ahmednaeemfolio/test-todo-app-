export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTodoInput = Pick<Todo, "title">;
export type PatchTodoInput = Partial<Pick<Todo, "title" | "completed">>;

/** An API failure that retains its HTTP status and response payload for callers. */
export class TodoApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "TodoApiError";
    this.status = status;
    this.body = body;
  }
}

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const rawBody = await response.text().catch(() => "");
    let body: unknown = rawBody || undefined;
    try {
      body = JSON.parse(rawBody);
    } catch {
      // Keep non-JSON error responses available to callers as their raw text.
    }

    const responseMessage =
      body && typeof body === "object" && "message" in body
        ? body.message
        : typeof body === "string"
          ? body
          : undefined;
    const message = Array.isArray(responseMessage)
      ? responseMessage.join(", ")
      : responseMessage !== undefined
        ? String(responseMessage)
        : response.statusText || "The request could not be completed.";

    throw new TodoApiError(response.status, message, body);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function listTodos(): Promise<Todo[]> {
  return request<Todo[]>("/todos");
}

export function createTodo(input: CreateTodoInput): Promise<Todo> {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getTodoById(id: string): Promise<Todo> {
  return request<Todo>(`/todos/${encodeURIComponent(id)}`);
}

export function patchTodo(id: string, changes: PatchTodoInput): Promise<Todo> {
  return request<Todo>(`/todos/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteTodo(id: string): Promise<void> {
  return request<void>(`/todos/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
