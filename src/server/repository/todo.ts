import { createByContent, read } from "@db-crud-todo";

type UUID = string;

interface Todo {
  id: UUID;
  content: string;
  date: string;
  done: boolean;
}

interface GetTodoRepositoryInput {
  page?: number;
  limit?: number;
}

interface OutputGetTodoRepository {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({
  page,
  limit,
}: GetTodoRepositoryInput = {}): OutputGetTodoRepository {
  const currentPage = page || 1;
  const currentLimit = limit || 2;
  const ALL_TODOS = read().reverse();
  const totalTodos = ALL_TODOS.length;
  const totalPages = calculatePages(totalTodos, currentLimit);

  const todosPaginated = paginate(currentPage, currentLimit, ALL_TODOS);
  return {
    todos: todosPaginated,
    total: totalTodos,
    pages: totalPages,
  };
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

function create(content: string): Todo {
  const newTodo = createByContent(content);
  return newTodo;
}

export const todoRepository = {
  get,
  create,
};
