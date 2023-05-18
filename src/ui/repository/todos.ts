interface Todo {
  id: string;
  content: string;
  data: Date;
  done: boolean;
}

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

        const { id, content, data, done } = todo as {
          id: string;
          content: string;
          data: string;
          done: string;
        };

        return {
          id,
          content,
          data: new Date(data),
          done: String(done).toLowerCase() === "true",
        };
      }),
    };
  }

  return {
    todos: [
      {
        content: "vish",
        data: new Date(),
        done: true,
        id: "qw43e  ",
      },
    ],
    total: 0,
    pages: 0,
  };
}

export const todoRepository = {
  get,
};
