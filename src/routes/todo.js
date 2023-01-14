import Todo from "../model/Todo.js";
import createFastifyWrapper from "../utils/fastifyWrapper.js";

export default async function (fastify, options) {
  const baseUrl = "/api/todo";
  const fastifyWrapper = createFastifyWrapper(baseUrl, fastify);

  fastifyWrapper.post("/:projectId", async (request, reply) => {
    const newTodo = { ...request.body, project_id: request.params.projectId };
    return todoService.add(newTodo);
  });

  fastifyWrapper.get("/:projectId", async (request, reply) => {
    return todoService.getAll(request.params.projectId);
  });

  fastifyWrapper.delete("/:todoId", async (request, reply) => {
    return todoService.delete(request.params.todoId);
  });

  fastifyWrapper.put("/:todoId", async (request, reply) => {
    const newTodo = { text: request.body.text, checked: request.body.checked };
    return todoService.update(request.params.todoId, newTodo);
  });
}

// - - -

const todoService = {
  add(newTodo) {
    return Todo.create(newTodo);
  },
  getAll(projectId) {
    return Todo.find({ project_id: projectId });
  },
  delete(todoId) {
    return Todo.deleteOne({ _id: todoId });
  },
  update(todoId, newTodo) {
    return Todo.updateOne({ _id: todoId }, newTodo);
  },
};
