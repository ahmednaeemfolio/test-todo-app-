/** A todo returned by the shared REST collection. */
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
}

/** PATCH fields are intentionally optional so callers can update one field at a time. */
export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

/** Keeps the HTTP status and response body available to API callers. */
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

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");
const TODOS_URL = `${API_BASE_URL}/todos`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : response.statusText || "The todo request failed.";
    throw new TodoApiError(response.status, message, body);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function listTodos(): Promise<Todo[]> {
  return request<Todo[]>(TODOS_URL);
}

export function createTodo(input: CreateTodoInput): Promise<Todo> {
  return request<Todo>(TODOS_URL, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getTodoById(id: string): Promise<Todo> {
  return request<Todo>(`${TODOS_URL}/${encodeURIComponent(id)}`);
}

export function patchTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
  return request<Todo>(`${TODOS_URL}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTodo(id: string): Promise<void> {
  return request<void>(`${TODOS_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
