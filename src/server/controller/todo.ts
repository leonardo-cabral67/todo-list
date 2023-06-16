import { HttpNotFoundError } from "@server/infra/errors";
import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";

async function get(req: NextApiRequest, res: NextApiResponse) {
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

  const ALL_TODOS = await todoRepository.get({ page, limit });
  res.status(200).json(ALL_TODOS);
}

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});

async function create(req: NextApiRequest, res: NextApiResponse) {
  const body = TodoCreateBodySchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      message: "You need to provide a content to create a TODO!",
      description: body.error,
    });
  }

  try {
    const todoCreated = await todoRepository.create(body.data.content);

    res.status(201).json({
      todo: todoCreated,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        error,
      });

      res.status(500).json({
        error: "Internal server error. Your todo could not be created",
      });
    }
  }
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

async function deleteTodoById(req: NextApiRequest, res: NextApiResponse) {
  const QuerySchema = schema.object({
    id: schema.string().uuid().nonempty(),
  });

  const parsedQuery = QuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    return res.status(401).json({
      message: "You must have to provide a valid ID!",
      error: parsedQuery.error,
    });
  }
  try {
    const todoId = parsedQuery.data.id;
    await todoRepository.deleteTodoById(todoId);
    return res.status(204).end();
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      return res.status(err.status).json({
        error: err.message,
      });
    }
    return res.status(500).json({
      error: "Server Error",
    });
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
  deleteTodoById,
};
