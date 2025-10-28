import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  // req.user is set by authMiddleware
  res.json({ user: req.user });
});

// example: protected transactions (placeholder)
router.get("/transactions", authMiddleware, (req, res) => {
  // fetch transactions for req.user._id ...
  res.json({ transactions: [] });
});

export default router;
