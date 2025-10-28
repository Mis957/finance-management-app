import mongoose from "mongoose";

const ContributionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 },
    note: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const GoalSchema = new mongoose.Schema(
  {
    // ✅ Proper user reference (instead of string)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: { type: String, required: true },

    type: {
      type: String,
      enum: ["daily", "weekly", "monthly", "other"],
      default: "monthly",
    },

    targetAmount: { type: Number, required: true },

    amountSaved: { type: Number, default: 0 },

    deadline: { type: Date, default: null },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    contributions: { type: [ContributionSchema], default: [] },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Automatically update `updatedAt` on save
GoalSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Goal = mongoose.model("Goal", GoalSchema);
export default Goal;
