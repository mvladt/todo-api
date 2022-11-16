import mongoose from "mongoose";

export default mongoose.model(
  "Todo",
  mongoose.Schema({
    text: String,
    checked: Boolean,
  })
);
