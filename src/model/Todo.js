import mongoose, { Schema } from "mongoose";

export default mongoose.model(
  "Todo",
  mongoose.Schema({
    text: {
      type: String,
      require: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  })
);
