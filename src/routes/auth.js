// TODO: добавить имейл в регистрацию, аккаунт
// TODO: тестирование, юнит тесты

import bcrypt from "bcrypt";
import User from "../model/User.js";

export default async function (fastify, options) {
  const baseUrl = "/api/auth";

  fastify.post(`${baseUrl}/signup`, async (request, reply) => {
    const { username, password } = request.body;
    if (!username || !password) {
      reply.code(400).send({ message: "The 'password' or 'username' field is missing" });
    } else if (await authService.findUser(username)) {
      reply.code(409).send({ message: "A user with this name already exists" });
    } else {
      const newUser = await authService.createNewUser(username, password);
      const token = fastify.jwt.sign({
        _id: newUser._id,
        username: newUser.username,
      });
      reply.code(201).send({ message: "Registration is successful", token: token });
    }
  });

  fastify.post(`${baseUrl}/signin`, async (request, reply) => {
    const { username, password } = request.body;
    const user = await authService.findUser(username);
    if (!username || !password) {
      reply.code(400).send({ message: "The 'password' or 'username' field is missing" });
    } else if (!user) {
      reply.code(401).send({ message: "There is no user with this name" });
    } else if (await bcrypt.compare(password, user.password)) {
      const token = fastify.jwt.sign({
        _id: user._id,
        username: username,
      });
      reply.code(200).send({ message: "Authorization is successful", token: token });
    } else {
      reply.code(401).send({ message: "Invalid password or username" });
    }
  });


  fastify.get(
    `${baseUrl}/check`,
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      return request.user;
    }
  );
}

// - - -

const authService = {
  async findUser(username) {
    const foundUser = await User.findOne({ username });
    return foundUser;
  },
  async createNewUser(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    return await User.create({
      username: username,
      password: passwordHash,
    });
  },
};
