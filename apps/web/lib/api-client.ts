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
  readonly statusText: string;

  constructor(status: number, statusText: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
  }
}

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = response.statusText || `Request failed with status ${response.status}`;

    try {
      const body: unknown = await response.json();
      if (typeof body === "object" && body !== null && "message" in body) {
        const apiMessage = body.message;
        if (typeof apiMessage === "string") message = apiMessage;
        else if (Array.isArray(apiMessage) && apiMessage.every((part) => typeof part === "string")) {
          message = apiMessage.join(", ");
        }
      }
    } catch {
      // Keep the HTTP status message when the server did not send JSON.
    }

    throw new ApiError(response.status, response.statusText, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function listTodos(): Promise<Todo[]> {
  return request<Todo[]>("/todos", { method: "GET" });
}

export function getTodo(id: string): Promise<Todo> {
  return request<Todo>(`/todos/${encodeURIComponent(id)}`, { method: "GET" });
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
