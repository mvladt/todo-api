import Project from "../model/Project.js";
import createFastifyWrapper from "../utils/fastifyWrapper.js";

export default async function (fastify, options) {
  const baseUrl = "/api/project";
  const fastifyWrapper = createFastifyWrapper(baseUrl, fastify);

  fastifyWrapper.post("/", async (request, reply) => {
    const newProject = { ...request.body, owner_id: request.user._id };
    return projectService.add(newProject);
  });

  fastifyWrapper.get("/", async (request, reply) => {
    return projectService.getAll(request.user._id);
  });

  fastifyWrapper.delete("/:projectId", async (request, reply) => {
    return projectService.delete(request.params.projectId);
  });
}

// - - -

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
