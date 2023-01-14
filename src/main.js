import fastify from "fastify";
import mongoose from "mongoose";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import dotenv from "dotenv";

import todoRoutes from "./routes/todo.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/project.js";
import pushRoutes from "./routes/push.js";

dotenv.config();

const app = fastify({ logger: true });

mongoose.connect(process.env.MONGODB_URI);

app.register(fastifyCors, {
  origin: "*",
  methods: "GET, PUT, POST, DELETE",
  credentials: true,
  allowedHeaders: "Content-Type, Authorization",
});

app.register(fastifyJwt, {
  secret: process.env.SECRET ?? "secret",
});

app.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.send(error);
  }
});

app.register(todoRoutes);
app.register(authRoutes);
app.register(projectRoutes);
app.register(pushRoutes);

try {
  app.listen({ port: process.env.PORT ?? "8080" });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
