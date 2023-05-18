import { todoRepository } from "@ui/repository/todos";

interface Todo {
  id: string;
  content: string;
  date: Date;
  done: boolean;
}

interface GetTodoControllerInput {
  page?: number;
  limit?: number;
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
    limit: limit || 1,
  };
  const res = await todoRepository.get(repositoryParams);
  return res;
}

export const todoController = {
  get,
};
