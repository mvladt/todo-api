import mongoose, { Schema } from "mongoose";

export default mongoose.model(
  "PushSubscription",
  mongoose.Schema({
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },
    expiration_time: {
      type: Number,
      default: null,
    },
    p256dh_key: {
      type: String,
      required: true,
    },
    auth_key: {
      type: String,
      required: true,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  })
);
