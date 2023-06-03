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

function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const parsedTodoId = schema.string().nonempty().uuid().safeParse(id);

  if (!parsedTodoId.success) {
    return res.status(400).json({
      Error: "You have to provide a valid TODO ID!",
      description: parsedTodoId.error,
    });
  }

  try {
    const updatedTodo = todoRepository.toggleDone(parsedTodoId.data);
    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({
        message: error.message,
      });
    }
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
};
