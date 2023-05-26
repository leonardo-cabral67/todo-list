import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";

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

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});

function create(req: NextApiRequest, res: NextApiResponse) {
  const body = TodoCreateBodySchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      message: "You need to provide a content to create a TODO!",
      description: body.error,
    });
  }

  const todoCreated = todoRepository.create(body.data.content);

  res.status(201).json({
    todo: todoCreated,
  });
}

export const todoController = {
  get,
  create,
};
