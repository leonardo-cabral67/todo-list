import { todoController } from "@server/controller/todo";
import { NextApiRequest, NextApiResponse } from "next";

export default function ToggleDone(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "PUT") {
    return todoController.toggleDone(request, response);
  }
  response.status(405).json({ message: "method not allowed" });
}
