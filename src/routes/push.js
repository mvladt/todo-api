import Repo from "../model/PushSubscription.js";
import createFastifyWrapper from "../utils/fastifyWrapper.js";

import webpush from "web-push";

export default async function (fastify, options) {
  const baseUrl = "/api/push";
  const fastifyWrapper = createFastifyWrapper(baseUrl, fastify);

  pushService.configWebPush();

  fastifyWrapper.post("/", async (request, reply) => {
    const { timerText } = request.body;
    const timerPayload = {
      notification: {
        title: "It's time!",
        body: `The time of the "${timerText}" has come.`,
      },
    };

    const pushSubscription = await pushService.getSubscription(request.user._id)
    const result = await pushService.sendMessage(pushSubscription, timerPayload);

    if (result.statusCode === 201) {
      reply.code(201).send({ message: "Push message has been sent"})
    } else {
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

// - - -

const pushService = {
  getVapidKeys() {
    return {
      publicKey:
        "BOS38dRJKcp46GQxYPUZaB8PxVqQnpOXYZ1jfK8HnJCEA9853jC66GL13s1sgt1RTn5KWImkYueX5nQ5ErlerFs",
      privateKey: "HVakc73XHSm9GLUMAunCqBSF8AWrqVuylYVCBOQk0pI",
    };
  },

  configWebPush() {
    webpush.setVapidDetails(
      "mailto:v-mell@yandex.ru",
      this.getVapidKeys().publicKey,
      this.getVapidKeys().privateKey
    );
  },

  async saveSubscription(pushSubscription, userId) {
    const sameSubscription = await Repo.find({
      endpoint: pushSubscription.endpoint,
    });
    if (sameSubscription.length) {
      return "Exists";
    } else {
      await Repo.create({
        endpoint: pushSubscription.endpoint,
        expiration_time: pushSubscription.expirationTime,
        p256dh_key: pushSubscription.keys.p256dh,
        auth_key: pushSubscription.keys.auth,
        owner_id: userId,
      });
      return "Success";
    }
  },
  async getSubscription(userId) {
    const subscription = await Repo.findOne({ owner_id: userId });
    return subscription;
  },
  async getAllSubscriptions() {
    const subscriptions = await Repo.find();
    return subscriptions;
  },
  async sendMessage(subscription, payload) {
    const properSubscripiton = {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expiration_time,
      keys: { p256dh: subscription.p256dh_key, auth: subscription.auth_key },
    };
    const pushResult = await webpush
      .sendNotification(properSubscripiton, JSON.stringify(payload))
      .catch((error) => console.log(error));
    return pushResult;
  },
};
