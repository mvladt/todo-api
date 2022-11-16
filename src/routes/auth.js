import bcrypt from "bcrypt";
import User from "../model/User.js";

const baseUrl = "/api/auth";

export default async function (fastify, options) {
  fastify.post(`${baseUrl}/signup`, async (request, reply) => {
    const passwordHash = await bcrypt.hash(request.body.password, 10); 
    const newUser = await User.create({   // TODO: сделать обработку искл. сущ. юз.
      username: request.body.username,
      password: passwordHash,
    });
    const token = fastify.jwt.sign({
      _id: newUser._id,
      username: newUser.username,
    });
    return { message: "Регистрация успешна", token: token };
  });

  fastify.post(`${baseUrl}/signin`, async (request, reply) => {
    const foundUser = await User.findOne({ username: request.body.username });
    if (!foundUser) {
      reply.code(401).send({ message: "Пользователя с таким именем не существует" });
    }
    const isPasswordVerify = await bcrypt.compare(
      request.body.password,
      foundUser.password
    );
    if (isPasswordVerify) {
      const token = fastify.jwt.sign({
        _id: foundUser._id,
        username: foundUser.username,
      });
      reply.code(200).send({ message: "Авторизация успешна", token: token });
    } else {
      reply.code(401).send({ message: "Неверный пароль" });
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
