// backend/src/routes/splitRoutes.js
import express from "express";
import Split from "../models/Split.js";

const router = express.Router();

// Create a split entry
router.post("/", async (req, res) => {
  try {
    const { userId, payer = "You", total, people, description = "", date } = req.body;
    if (!userId || typeof total !== "number" || total <= 0) {
      return res.status(400).json({ error: "Missing required fields or invalid total" });
    }

    // people: array of names OR number -> normalize to array of objects
    let peopleArr = [];
    if (Array.isArray(people)) {
      peopleArr = people.map((p) => ({ name: String(p || "").trim() || "Participant" }));
    } else if (typeof people === "number") {
      for (let i = 1; i <= people; i++) peopleArr.push({ name: `Person ${i}` });
    } else {
      // fallback: single payer only
      peopleArr = [];
    }

    const participantsCount = peopleArr.length + 1; // include payer
    const perPerson = +(total / participantsCount).toFixed(2);

    const newSplit = new Split({
      userId,
      payer,
      total,
      people: peopleArr,
      perPerson,
      description,
      date: date ? new Date(date) : new Date(),
    });

    await newSplit.save();
    res.status(201).json({ message: "Split saved", split: newSplit });
  } catch (err) {
    console.error("Error saving split:", err);
    res.status(500).json({ error: "Failed to save split" });
  }
});

// Get splits (optionally filter by userId)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    const splits = await Split.find(filter).sort({ createdAt: -1 });
    res.json({ splits });
  } catch (err) {
    console.error("Error fetching splits:", err);
    res.status(500).json({ error: "Failed to fetch splits" });
  }
});

// Delete split by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Split.findByIdAndDelete(id);
    res.json({ message: "Split deleted" });
  } catch (err) {
    console.error("Error deleting split:", err);
    res.status(500).json({ error: "Failed to delete split" });
  }
});

export default router;
