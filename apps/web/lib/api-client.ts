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
  readonly details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

function endpoint(path: string): string {
  return `${apiBaseUrl}${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(endpoint(path), {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const responseText = await response.text();
  let body: unknown;
  if (responseText) {
    try {
      body = JSON.parse(responseText) as unknown;
    } catch {
      body = responseText;
    }
  }

  if (!response.ok) {
    const errorBody = body as { message?: unknown } | null;
    const serverMessage =
      errorBody && typeof errorBody === "object" && typeof errorBody.message === "string"
        ? errorBody.message
        : typeof body === "string" && body.length > 0
          ? body
          : response.statusText || "The request could not be completed.";
    throw new ApiError(response.status, serverMessage, body);
  }

  if (response.status === 204 || responseText.length === 0) {
    return undefined as T;
  }

  return body as T;
}

export function getTodos(): Promise<Todo[]> {
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
