import {
  createByContent,
  read,
  updateTodo,
  deleteTodoById as dbDeleteTodo,
} from "@db-crud-todo";
import { HttpNotFoundError } from "@server/infra/errors";
import { TodoSchema } from "@server/schema/todo";
import { createClient } from "@supabase/supabase-js";

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

async function get({
  page,
  limit,
}: GetTodoRepositoryInput = {}): Promise<OutputGetTodoRepository> {
  const currentPage = page || 1;
  const currentLimit = limit || 10;

  const startIndex: number = (currentPage - 1) * currentLimit;
  const endIndex: number = currentPage * currentLimit - 1;

  // =========== SUPABASE =============
  // TODO: Separar em outro arquivo
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseSecret);
  // =========== SUPABASE =============

  const { data, error, count } = await supabase
    .from("todos")
    .select("*", {
      count: "exact",
    })
    .order("date", {
      ascending: false,
    })
    .range(startIndex, endIndex);

  if (error) throw new Error("failed to fecth data");

  const parsedData = TodoSchema.array().safeParse(data);

  if (!parsedData.success) {
    throw parsedData.error;
  }

  const todos = parsedData.data;
  const total = count || todos.length;
  const pages = Math.ceil(total / currentLimit);

  return {
    total,
    pages,
    todos,
  };
}

function create(content: string): Todo {
  const newTodo = createByContent(content);
  return newTodo;
}

function toggleDone(id: UUID): Todo {
  const ALL_TODOS = read();

  const currentTodo = ALL_TODOS.find((todo) => {
    return todo.id === id;
  });

  if (!currentTodo) {
    throw new Error(`Todo with id "${id}" not found`);
  }

  const updatedTodo = updateTodo(id, {
    done: !currentTodo.done,
  });

  return updatedTodo;
}

function deleteTodoById(id: UUID) {
  const deletedTodo = dbDeleteTodo(id);

  if (!deletedTodo) {
    throw new HttpNotFoundError(`There is no todo with id: ${id}`);
  }

  return deletedTodo;
}

export const todoRepository = {
  get,
  create,
  toggleDone,
  deleteTodoById,
};
