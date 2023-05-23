import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todo";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    return todoController.get(request, response);
  }

  if (request.method === "POST") {
    return todoController.create(request, response);
  }

  response.status(405).json({ message: "method not allowed" });
}
