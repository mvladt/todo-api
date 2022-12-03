import mongoose from "mongoose";

export default mongoose.model(
  "User",
  mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
);
