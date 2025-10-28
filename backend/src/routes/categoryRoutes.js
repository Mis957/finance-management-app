// src/routes/categoryRoutes.js
import express from "express";
import Category from "../models/Category.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ----------------------- ➕ Add Category ----------------------- */
router.post("/", protect, async (req, res) => {
  try {
    const { name, type, icon, color } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }

    const category = new Category({
      user: req.user._id,
      name,
      type,
      icon,
      color,
    });

    await category.save();
    res.status(201).json({
      message: "✅ Category created successfully",
      category,
    });
  } catch (err) {
    console.error("❌ Error creating category:", err.message);
    res.status(500).json({ error: "Failed to create category" });
  }
});

/* ----------------------- 📄 Get All Categories ----------------------- */
router.get("/", protect, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    console.error("❌ Error fetching categories:", err.message);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

/* ----------------------- ✏️ Update Category ----------------------- */
router.put("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.status(200).json({
      message: "✏️ Category updated successfully",
      category,
    });
  } catch (err) {
    console.error("❌ Error updating category:", err.message);
    res.status(500).json({ error: "Failed to update category" });
  }
});

/* ----------------------- 🗑️ Delete Category ----------------------- */
router.delete("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.status(200).json({ message: "🗑️ Category deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting category:", err.message);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
