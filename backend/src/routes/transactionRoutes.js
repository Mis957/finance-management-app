import express from "express";
import Transaction from "../models/Transactions.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ----------------------- ➕ Add a Transaction ----------------------- */
router.post("/", protect, async (req, res) => {
  try {
    const { amount, type, category, description } = req.body;

    // ✅ Validate required fields
    if (!amount || !type || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Always use req.user._id (MongoDB ObjectId)
    const newTransaction = new Transaction({
      user: req.user._id,
      amount,
      type,
      category,
      description,
    });

    await newTransaction.save();

    res.status(201).json({
      message: "✅ Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (err) {
    console.error("❌ Error adding transaction:", err.message);
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

/* ----------------------- 📄 Get All Transactions ----------------------- */
router.get("/", protect, async (req, res) => {
  try {
    // ✅ Fetch only current user's transactions
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate("user", "name email");

    res.status(200).json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err.message);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

/* ----------------------- 🗑️ Delete a Transaction ----------------------- */
router.delete("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // ✅ ensure ownership
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Transaction not found or unauthorized" });
    }

    res.status(200).json({ message: "🗑️ Transaction deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting transaction:", err.message);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

/* ----------------------- ✏️ Update a Transaction ----------------------- */
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // ✅ ensure ownership
      req.body,
      { new: true }
    );

    if (!updatedTransaction) {
      return res
        .status(404)
        .json({ error: "Transaction not found or unauthorized" });
    }

    res.status(200).json({
      message: "✏️ Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (err) {
    console.error("❌ Error updating transaction:", err.message);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

export default router;
