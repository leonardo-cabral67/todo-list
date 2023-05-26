import { todoRepository } from "@ui/repository/todos";
import { Todo } from "@ui/schema/todo";

interface GetTodoControllerInput {
  page?: number;
  limit?: number;
}

interface OutputGetTodoController {
  todos: Todo[];
  total: number;
  pages: number;
}

interface InputCreateTodo {
  content?: string;
  onSuccess: () => void;
  onError: () => void;
}

async function get({
  page,
  limit,
}: GetTodoControllerInput): Promise<OutputGetTodoController> {
  const repositoryParams = {
    page: page || 1,
    limit: limit || 1,
  };
  const res = await todoRepository.get(repositoryParams);
  return res;
}

function filterTodosByContent<Todo>(
  todos: Array<Todo & { content: string }>,
  search: string
): Array<Todo> {
  const homeTodos = todos.filter((todo) => {
    const searchNormalized = search.toLowerCase().trim();
    const todoNormalized = todo.content.toLowerCase();
    return todoNormalized.includes(searchNormalized);
  });
  return homeTodos;
}

function create({ content, onError, onSuccess }: InputCreateTodo) {
  if (!content) {
    onError();
    return;
  }

  onSuccess();
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
};
