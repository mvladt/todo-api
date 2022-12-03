import Project from "../model/Project.js";

const baseUrl = "/api/project";

export default async function (fastify, options) {
  fastify.post(
    baseUrl,
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      return projectService.add({ ...request.body, owner_id: request.user._id });
    }
  );

  fastify.get(
    baseUrl,
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      return projectService.getAll(request.user._id);
    }
  );

  fastify.delete(
    `${baseUrl}/:projectId`,
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      return projectService.delete(request.params.projectId);
    }
  );
}

const projectService = {
  add(project) {
    return Project.create(project);
  },
  getAll(userId) {
    return Project.find({ owner_id: userId });
  },
  delete(projectId) {
    return Project.deleteOne({ _id: projectId });
  },
};
