export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTodoInput = Pick<Todo, "title">;
export type UpdateTodoInput = Partial<Pick<Todo, "title" | "completed">>;

/** An HTTP failure returned by the todo API. */
export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly responseBody: unknown;

  constructor(status: number, statusText: string, responseBody: unknown) {
    const detail =
      typeof responseBody === "string" && responseBody.trim()
        ? `: ${responseBody}`
        : "";
    super(`Todo API request failed (${status} ${statusText})${detail}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody;
  }
}

const configuredBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").trim();
const baseUrl = configuredBaseUrl.replace(/\/+$/, "");

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const rawBody = await response.text();
    let responseBody: unknown = rawBody;
    if (rawBody) {
      try {
        responseBody = JSON.parse(rawBody) as unknown;
      } catch {
        // Preserve non-JSON response text for callers inspecting the error.
      }
    }
    throw new ApiError(response.status, response.statusText, responseBody);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const todoApi = {
  getTodos(): Promise<Todo[]> {
    return request<Todo[]>("/todos");
  },

  getTodo(id: string): Promise<Todo> {
    return request<Todo>(`/todos/${encodeURIComponent(id)}`);
  },

  createTodo(input: CreateTodoInput): Promise<Todo> {
    return request<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
    return request<Todo>(`/todos/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  deleteTodo(id: string): Promise<void> {
    return request<void>(`/todos/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
