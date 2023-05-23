import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";

function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    return res.status(400).json({
      message: "Page query must be a number",
    });
  }

  if (query.limit && isNaN(limit)) {
    return res.status(400).json({
      message: "Limit query must be a number",
    });
  }

  const ALL_TODOS = todoRepository.get({ page, limit });
  res.status(200).json(ALL_TODOS);
}

function create(req: NextApiRequest, res: NextApiResponse) {
  const content = req.body.content;
  const todoCreated = todoRepository.create(content);

  res.status(201).json({
    todoCreated,
  });
}

export const todoController = {
  get,
  create,
};
