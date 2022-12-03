import mongoose, { Schema } from "mongoose";

export default mongoose.model(
  "Project",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  })
);
