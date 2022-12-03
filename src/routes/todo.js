import Todo from "../model/Todo.js";
import fastifyWrapper from "../utils/fastifyWrapper.js";

const baseUrl = "/api/todo";

export default async function (fastify, options) {
  fastifyWrapper.baseUrl = baseUrl;
  fastifyWrapper.fastify = fastify;

  fastifyWrapper.get("/:projectId", async (request, reply) => {
    const todos = Todo.find({ project_id: request.params.projectId });
    return todos;
  });

  fastifyWrapper.post("/:projectId", async (request, reply) => {
    const todo = Todo.create({
      ...request.body,
      project_id: request.params.projectId,
    });
    return todo;
  });

  fastify.delete(
    `${baseUrl}/:todoId`,
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      return Todo.deleteOne({ _id: request.params.todoId });
    }
  );

  fastify.put(
    `${baseUrl}/:todoId`,
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { todoId } = request.params;
      return Todo.updateOne(
        { _id: todoId },
        { text: request.body.text, checked: request.body.checked }
      );
    }
  );
}
