import { NextApiRequest, NextApiResponse } from "next";
import { read } from "@db-crud-todo";

function get(_: NextApiRequest, res: NextApiResponse) {
  const ALL_TODOS = read();
  res.status(200).json({ todos: ALL_TODOS });
}

export const todoController = {
  get,
};
