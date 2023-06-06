import { todoRepository } from "@ui/repository/todos";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

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
  onSuccess: (todo: Todo) => void;
  onError: () => void;
}

interface InputToggleDone {
  id: string;
  onError(): void;
  updateTodoOnScreen(): void;
}

async function get({
  page,
}: GetTodoControllerInput): Promise<OutputGetTodoController> {
  const repositoryParams = {
    page: page || 1,
    limit: 2,
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
  const parsedParams = schema.string().nonempty().safeParse(content);

  if (!parsedParams.success) {
    onError();
    return;
  }
  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
}

function toggleDone({ id, onError, updateTodoOnScreen }: InputToggleDone) {
  todoRepository
    .toggleDone(id)
    .then(() => {
      updateTodoOnScreen();
    })
    .catch(() => {
      onError();
    });
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
  toggleDone,
};
