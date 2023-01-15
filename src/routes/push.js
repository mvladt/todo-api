import createFastifyWrapper from "../utils/fastifyWrapper.js";
import pushService from "../service/pushService.js";

export default async function (fastify, options) {
  const baseUrl = "/api/push";
  const fastifyWrapper = createFastifyWrapper(baseUrl, fastify);

  fastifyWrapper.post("/", async (request, reply) => {
    const result = await pushService.pushUser(request.user, request.body.timerText);

    if (result === Colors.BLUE) {
      reply.code(201).send({ message: "Push sending is completed" });
    } else if (result === "Error") {
      reply.code(500);
    }
  });

  fastifyWrapper.post("/subscription", async (request, reply) => {
    const result = await pushService.saveSubscription(request.body, request.user._id);

    if (result === "Success") {
      reply.code(200).send({ message: "Success" });
    } else if (result === "Exists") {
      reply.code(409).send({ message: "Subscription already exists" });
    }
  });
}
