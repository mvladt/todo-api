import Todo from "../model/Todo.js";

const baseUrl = "/api/todo";

export default async function (fastify, options) {
  fastify.get(
    baseUrl,
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      return Todo.find();
    }
  );

  fastify.post(
    baseUrl,
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      return Todo.create(request.body);
    }
  );

  fastify.delete(
    `${baseUrl}/:todoId`,
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { todoId } = request.params;
      return Todo.deleteOne({ _id: todoId });
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
