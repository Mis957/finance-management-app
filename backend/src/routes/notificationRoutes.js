// src/routes/notificationRoutes.js
import express from "express";
import { sendWeeklyReminders } from "../jobs/weeklyReminders.js";
import { protect } from "../middlewares/authMiddleware.js";  // ✅ correct import

const router = express.Router();

router.post("/send-weekly", protect, async (req, res) => {   // ✅ use protect
  try {
    const result = await sendWeeklyReminders();
    res.json({ ok: true, sent: result.sent });
  } catch (err) {
    console.error("send-weekly route error", err);
    res.status(500).json({ ok: false, error: "Failed to send reminders" });
  }
});





export default router;
