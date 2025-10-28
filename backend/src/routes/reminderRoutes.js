// src/routes/reminderRoutes.js
import express from "express";
import Reminder from "../models/Reminder.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ----------------------- ➕ Add Reminder ----------------------- */
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, date, recurring } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }

    const reminder = new Reminder({
      user: req.user._id,
      title,
      description,
      date,
      recurring,
    });

    await reminder.save();
    res.status(201).json({
      message: "✅ Reminder created successfully",
      reminder,
    });
  } catch (err) {
    console.error("❌ Error creating reminder:", err.message);
    res.status(500).json({ error: "Failed to create reminder" });
  }
});

/* ----------------------- 📄 Get All Reminders ----------------------- */
router.get("/", protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({ date: 1 });
    res.status(200).json(reminders);
  } catch (err) {
    console.error("❌ Error fetching reminders:", err.message);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

/* ----------------------- ✏️ Update Reminder ----------------------- */
router.put("/:id", protect, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!reminder) return res.status(404).json({ error: "Reminder not found" });

    res.status(200).json({
      message: "✏️ Reminder updated successfully",
      reminder,
    });
  } catch (err) {
    console.error("❌ Error updating reminder:", err.message);
    res.status(500).json({ error: "Failed to update reminder" });
  }
});

/* ----------------------- 🗑️ Delete Reminder ----------------------- */
router.delete("/:id", protect, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!reminder) return res.status(404).json({ error: "Reminder not found" });

    res.status(200).json({ message: "🗑️ Reminder deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting reminder:", err.message);
    res.status(500).json({ error: "Failed to delete reminder" });
  }
});

export default router;
