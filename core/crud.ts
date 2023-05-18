import { readFileSync } from "fs";

const DB_FILE_PATH = "./core/db";

type UUID = string;

interface ITodo {
  id: UUID;
  content: string;
  date: string;
  done: boolean;
}

export function read(): ITodo[] {
  const dbString = readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db) {
    return [];
  }

  return db.todos;
}
