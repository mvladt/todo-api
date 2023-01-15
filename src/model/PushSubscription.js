import mongoose, { Schema } from "mongoose";

const schema = mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
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
});

schema.index({ endpoint: 1, owner_id: 1 }, { unique: true });

export default mongoose.model("PushSubscription", schema);
