import { readFileSync, writeFileSync } from "fs";
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db";

type UUID = string;

interface ITodo {
  id: UUID;
  content: string;
  date: string;
  done: boolean;
}

interface InputUpdateTodo {
  content?: string;
  done?: boolean;
}
type OutputUpdateTodo = ITodo;

export function createByContent(content: string): ITodo {
  const todo: ITodo = {
    id: uuid(),
    content: content,
    date: new Date().toISOString(),
    done: false,
  };

  const ALL_TODOS = read();
  const todos = [...ALL_TODOS, todo];

  writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 1));

  return todo;
}

export function read(): ITodo[] {
  const dbString = readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db) {
    return [];
  }

  return db.todos;
}

export function updateTodo(
  id: UUID,
  partialTodo: InputUpdateTodo
): OutputUpdateTodo {
  let updatedTodo;
  const ALL_TODOS = read();

  ALL_TODOS.forEach((todo) => {
    if (todo.id === id) {
      updatedTodo = Object.assign(todo, partialTodo);
    }
  });

  if (!updatedTodo) {
    throw new Error("Provide a valid id");
  }

  writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: ALL_TODOS,
      },
      null,
      1
    )
  );

  return updatedTodo;
}
