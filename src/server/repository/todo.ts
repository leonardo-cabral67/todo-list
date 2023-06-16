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

// =========== SUPABASE =============
// TODO: Separar em outro arquivo
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseSecret = process.env.SUPABASE_SECRET_KEY || "";
const supabase = createClient(supabaseUrl, supabaseSecret);
// =========== SUPABASE =============

async function get({
  page,
  limit,
}: GetTodoRepositoryInput = {}): Promise<OutputGetTodoRepository> {
  const currentPage = page || 1;
  const currentLimit = limit || 10;

  const startIndex: number = (currentPage - 1) * currentLimit;
  const endIndex: number = currentPage * currentLimit - 1;

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

async function getTodoById(id: UUID): Promise<Todo> {
  const { error, data } = await supabase
    .from("todos")
    .select()
    .eq("id", id)
    .single();

  if (error) throw new Error(`There is no todo with id ${id}`);

  const parsedTodo = TodoSchema.safeParse(data);

  if (!parsedTodo.success) throw parsedTodo.error;

  return parsedTodo.data;
}

async function create(content: string): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .insert([{ content }])
    .select()
    .single();

  if (error) throw new Error("Could not create TODO");

  const parsedTodo = TodoSchema.safeParse(data);

  if (!parsedTodo.success) throw parsedTodo.error;

  return parsedTodo.data;
}

async function toggleDone(id: UUID): Promise<Todo> {
  const currentTodoExists = await getTodoById(id);
  if (!currentTodoExists) throw new Error(`There is no todo with id ${id}`);

  const { data, error } = await supabase
    .from("todos")
    .update({ done: !currentTodoExists.done })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error("Todo could not be updated");

  const parsedTodo = TodoSchema.safeParse(data);

  if (!parsedTodo.success) throw parsedTodo.error;

  return parsedTodo.data;
}

async function deleteTodoById(id: UUID) {
  const { error, data } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    throw new HttpNotFoundError(`There is no todo with id: ${id}`);
  }

  return data;
}

export const todoRepository = {
  get,
  create,
  toggleDone,
  deleteTodoById,
};
