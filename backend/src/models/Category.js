// src/models/Category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    icon: {
      type: String,
      default: "💰", // optional for UI
    },
    color: {
      type: String,
      default: "#4CAF50", // optional for UI
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
