import Repo from "../model/PushSubscription.js";
import webpush from "web-push";

// TODO: пофиксить работу env
// console.log(process.env.PORT);

// webpush.setVapidDetails(
//   `mailto:${process.env.VAPID_SUBJECT_EMAIL}`,
//   process.env.VAPID_PUBLIC_KEY,
//   process.env.VAPID_PRIVATE_KEY
// );

webpush.setVapidDetails(
  "mailto:v-mell@yandex.ru",
  "BOS38dRJKcp46GQxYPUZaB8PxVqQnpOXYZ1jfK8HnJCEA9853jC66GL13s1sgt1RTn5KWImkYueX5nQ5ErlerFs",
  "HVakc73XHSm9GLUMAunCqBSF8AWrqVuylYVCBOQk0pI"
);

const pushService = {
  async saveSubscription(pushSubscription, userId) {
    try {
      const sameSubscription = await Repo.findOne({
        endpoint: pushSubscription.endpoint,
        owner_id: userId,
      });
      if (sameSubscription) {
        return "Exists";
      } else {
        const newSubscription = await Repo.create({
          endpoint: pushSubscription.endpoint,
          expiration_time: pushSubscription.expirationTime,
          p256dh_key: pushSubscription.keys.p256dh,
          auth_key: pushSubscription.keys.auth,
          owner_id: userId,
        });
        console.log(
          newSubscription
            ? `[Saved subscription]\n${newSubscription}`
            : "[Subscription not saved]\n"
        );
        return "Success";
      }
    } catch (error) {
      console.error(error);
    }
  },

  async getUserSubscription(userId) {
    try {
      const subscription = await Repo.findOne({ owner_id: userId });
      return subscription;
    } catch (error) {
      console.error(error);
    }
  },
  async getAllUserSubscriptions(userId) {
    try {
      const allSubscriptions = await Repo.find({ owner_id: userId });
      return allSubscriptions;
    } catch (error) {
      console.error(error);
    }
  },
  async sendMessage(subscription, payload) {
    try {
      // TODO: Переделать монго-схему чтоб убрать это 
      const properSubscripiton = {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expiration_time,
        keys: { p256dh: subscription.p256dh_key, auth: subscription.auth_key },
      };
      const pushResult = await webpush.sendNotification(
        properSubscripiton,
        JSON.stringify(payload)
      );
      console.log("[Webpush.sendNotification]\n", pushResult);
      return pushResult;
    } catch (error) {
      console.error(error);
    }
  },
  async pushUser(user, timerText) {
    try {
      const timerPayload = {
        notification: {
          title: "It's time!",
          body: `The time of the "${timerText}" has come.`,
        },
      };
      const userSubscriptions = await pushService.getAllUserSubscriptions(user._id);
      await Promise.all(
        userSubscriptions.map(async (subscription) => {
          await pushService.sendMessage(subscription, timerPayload);
        })
      );
      console.log(`[Push sending is completed (user: ${user.username})]\n`);
      return "Success";
    } catch (error) {
      console.error(error);
      return "Error";
    }
  },
};

export default pushService;
