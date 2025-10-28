import Transactions from "../models/Transactions.js";

export const addTransaction = async (req, res) => {
  try {
  console.log("🧾 Received data:", req.body);

  const { userId, amount, type, category, description, date } = req.body;

  const newTransaction = new Transaction({
    userId,
    amount,
    type,
    category,
    description,
    date,
  });

  const saved = await newTransaction.save();
  console.log("✅ Transaction saved:", saved);

  res.status(201).json({ message: "Transaction added successfully", transaction: saved });
} catch (error) {
  console.error("❌ Error adding transaction:", error);
  res.status(500).json({ error: "Failed to add transaction" });
}
};