import { Todo, TodoSchema } from "@ui/schema/todo";
import { z as schema } from "zod";

interface GetTodoRepositoryInput {
  page: number;
  limit: number;
}

interface OutputGetTodoRepository {
  todos: Todo[];
  total: number;
  pages: number;
}

async function get({
  page,
  limit,
}: GetTodoRepositoryInput): Promise<OutputGetTodoRepository> {
  return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
    async (response) => {
      const todosString = await response.text();
      const ALL_TODOS = parseTodosFromServer(JSON.parse(todosString));

      return {
        todos: ALL_TODOS.todos,
        total: ALL_TODOS.total,
        pages: ALL_TODOS.pages,
      };
    }
  );
}

function parseTodosFromServer(responseBody: unknown): {
  total: number;
  pages: number;
  todos: Todo[];
} {
  if (
    responseBody !== null &&
    typeof responseBody === "object" &&
    "todos" in responseBody &&
    "total" in responseBody &&
    "pages" in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    return {
      total: Number(responseBody.total),
      pages: Number(responseBody.pages),
      todos: responseBody.todos.map((todo) => {
        if (todo !== null && typeof todo !== "object") {
          throw new Error("Invalid todo from API!");
        }

        const { id, content, date, done } = todo as {
          id: string;
          content: string;
          date: string;
          done: string;
        };

        return {
          id,
          content,
          date,
          done: String(done).toLowerCase() === "true",
        };
      }),
    };
  }

  return {
    todos: [
      {
        content: "vish",
        date: new Date().toISOString(),
        done: true,
        id: "qw43e  ",
      },
    ],
    total: 0,
    pages: 0,
  };
}

async function createByContent(content: string): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      content,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create todo!");
  }

  const serverResponse = await response.json();
  const ServerResponseSchema = schema.object({
    todo: TodoSchema,
  });
  const serverResponseParsed = ServerResponseSchema.safeParse(serverResponse);

  if (!serverResponseParsed.success) {
    throw new Error("Failed to create TODO!");
  }

  const todo = serverResponseParsed.data.todo;

  return todo;
}

export const todoRepository = {
  get,
  createByContent,
};
