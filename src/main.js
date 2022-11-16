import fastify from "fastify";
import mongoose from "mongoose";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";

import todoRoutes from "./routes/todo.js";
import authRoutes from "./routes/auth.js";

const app = fastify({ logger: true });

mongoose.connect("mongodb://localhost:27017/TodoDb");

app.register(fastifyCors, {
  origin: "*",
  methods: "GET, PUT, POST, DELETE",
  credentials: true,
  allowedHeaders: "Content-Type, Authorization",
});

app.register(fastifyJwt, {
  secret: "mysecretkey",
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

try {
  app.listen({ port: "8000" });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
