import { todoController } from "@server/controller/todo";
import { NextApiRequest, NextApiResponse } from "next";

export default function DeleteTodo(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "DELETE") {
    return todoController.deleteTodoById(request, response);
  }
  response.status(405).json({ message: "method not allowed" });
}
