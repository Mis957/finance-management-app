// backend/src/models/Split.js
import mongoose from "mongoose";

const SplitSchema = new mongoose.Schema(
  {
    // ✅ Proper user reference instead of string
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    payer: { type: String, default: "You" },

    total: { type: Number, required: true },

    // Array of people involved in the split
    people: [
      {
        name: { type: String, required: true },
      },
    ],

    perPerson: { type: Number, required: true },

    description: { type: String, default: "" },

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Auto-update timestamps handled automatically
const Split = mongoose.model("Split", SplitSchema);
export default Split;
