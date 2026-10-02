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

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, payload: unknown, message?: string) {
    super(message ?? `Todo API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    let payload: unknown = responseText;
    if (responseText) {
      try {
        payload = JSON.parse(responseText) as unknown;
      } catch {
        // Preserve a non-JSON error body for callers to inspect.
      }
    }
    throw new ApiError(response.status, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseText = await response.text();
  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

export function getTodos(): Promise<Todo[]> {
  return request<Todo[]>("/todos", { cache: "no-store" });
}

export function getTodo(id: string): Promise<Todo> {
  return request<Todo>(`/todos/${encodeURIComponent(id)}`, { cache: "no-store" });
}

export function createTodo(input: CreateTodoInput): Promise<Todo> {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
  return request<Todo>(`/todos/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTodo(id: string): Promise<void> {
  return request<void>(`/todos/${encodeURIComponent(id)}`, { method: "DELETE" });
}
