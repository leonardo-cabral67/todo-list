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
  return fetch("/api/todos").then(async (response) => {
    const todosString = await response.text();
    const ALL_TODOS = JSON.parse(todosString).todos;

    const todosLength: number = ALL_TODOS.length;
    const totalPages = calculatePages(todosLength, limit);

    const paginatedTodos = paginate(page, limit, ALL_TODOS);

    return {
      todos: paginatedTodos,
      total: todosLength,
      pages: totalPages,
    };
  });
}

function paginate(page: number, limit: number, todos: Todo[]) {
  const startIndex: number = (page - 1) * limit;
  const endIndex: number = page * limit;
  const todosPaginated = todos.slice(startIndex, endIndex);
  return todosPaginated;
}

function calculatePages(todosLength: number, limit: number) {
  const pages: number = Math.ceil(todosLength / limit);
  return pages;
}

export const todoRepository = {
  get,
};
