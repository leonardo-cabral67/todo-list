import { todoRepository } from "@ui/repository/todos";

interface Todo {
  id: string;
  content: string;
  data: Date;
  done: boolean;
}

interface GetTodoControllerInput {
  page?: number;
  limit: number;
}

interface OutputGetTodoController {
  todos: Todo[];
  total: number;
  pages: number;
}

async function get({
  page,
  limit,
}: GetTodoControllerInput): Promise<OutputGetTodoController> {
  const repositoryParams = {
    page: page || 1,
    limit,
  };

  return await todoRepository.get(repositoryParams);
}

export const todoController = {
  get,
};
